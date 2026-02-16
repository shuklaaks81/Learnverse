import type { NextApiRequest, NextApiResponse } from 'next';

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
 *   "timestamp": "2026-02-16T10:30:00Z"
 * }
 * 
 * Response: { success: true }
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { studentId, question, answerPreview, timestamp } = req.body;
    
    // Validate minimal input
    if (!studentId || !question) {
      return res.status(400).json({
        error: 'Missing studentId or question',
      });
    }
    
    // Log to console (Phase 1 - later will be database)
    console.log('[TUTOR-LOG]', {
      studentId,
      question: question.substring(0, 100),
      answerLength: answerPreview?.length || 0,
      timestamp: timestamp || new Date().toISOString(),
    });
    
    // TODO: Phase 2 - Store in PostgreSQL
    // Future: Insert into tutor_logs table for analytics dashboard
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('[API /tutor-log] Error:', error);
    // Don't fail the parent request if logging fails
    return res.status(500).json({ success: false, logged: false });
  }
}
