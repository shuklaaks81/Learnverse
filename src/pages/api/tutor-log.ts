import type { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

/**
 * POST /api/tutor-log
 * 
 * Log tutor interactions for analytics
 * Tracks student engagement with tutor feature
 * 
 * Request body:
 * {
 *   "studentId": "uuid-123",
 *   "question": "What is 1/2 + 1/4?",
 *   "answerPreview": "Great question! Think of 1/2 as half...",
 *   "cached": false,
 *   "latency": 1234,
 *   "timestamp": 1676540400000
 * }
 * 
 * Response: { success: true, logId?: number, source: "database|console" }
 */

// Initialize connection pool (lazy - only if DATABASE_URL is set)
let pool: Pool | null = null;

function initializePool(): Pool | null {
  if (!process.env.DATABASE_URL) {
    return null;
  }
  
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 20, // Max connections in pool
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    pool.on('error', (err) => {
      console.error('[DATABASE] Unexpected error on idle client:', err);
      // Don't crash, just log - pool will handle reconnection
    });
  }
  
  return pool;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { studentId, question, answerPreview, cached, latency, timestamp } = req.body;
    
    // Validate minimal input
    if (!studentId || !question) {
      return res.status(400).json({
        error: 'Missing studentId or question',
      });
    }
    
    const currentTimestamp = timestamp || Date.now();
    const answerPreviewTruncated = answerPreview?.substring(0, 500) || '';
    
    // Try to use database if available, fallback to console
    const dbPool = initializePool();
    
    if (dbPool) {
      try {
        const result = await dbPool.query(
          `INSERT INTO tutor_logs (student_id, question, answer_preview, cached, latency_ms, timestamp)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING id`,
          [studentId, question, answerPreviewTruncated, cached || false, latency || 0, currentTimestamp]
        );
        
        console.log('[TUTOR-LOG] Database:', {
          logId: result.rows[0]?.id,
          studentId,
          question: question.substring(0, 100),
          cached: cached || false,
          latency: latency || 0,
        });
        
        return res.status(200).json({
          success: true,
          logId: result.rows[0]?.id,
          source: 'database',
        });
      } catch (dbError) {
        // Database error - fallback to console logging
        console.error('[DATABASE] Insert failed:', dbError);
        console.log('[TUTOR-LOG] Fallback (database error):', {
          studentId,
          question: question.substring(0, 100),
          cached: cached || false,
          latency: latency || 0,
        });
        
        return res.status(200).json({
          success: true,
          source: 'console-fallback',
          error: 'Database unavailable, logged to console',
        });
      }
    } else {
      // No database configured - console logging only
      console.log('[TUTOR-LOG] Console:', {
        studentId,
        question: question.substring(0, 100),
        cached: cached || false,
        latency: latency || 0,
        timestamp: currentTimestamp,
      });
      
      return res.status(200).json({
        success: true,
        source: 'console',
        note: 'DATABASE_URL not configured',
      });
    }
  } catch (error) {
    console.error('[API /tutor-log] Error:', error);
    // Don't fail the parent request if logging fails
    return res.status(200).json({
      success: true,
      error: 'Logging failed but request succeeded',
    });
  }
}
