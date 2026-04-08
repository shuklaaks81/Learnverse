import type { NextApiRequest, NextApiResponse } from 'next';
import { tutorAgent } from '@/agents/tutor.agent';

/**
 * API Routes:
 * POST /api/tutor - Student asks a question, tutor responds
 * GET /api/tutor/stats - Get tutor agent statistics
 * DELETE /api/tutor - Clear conversation history for a student
 */

type ResponseData = {
  answer?: string;
  cached?: boolean;
  latency?: number;
  timestamp?: string | number;
  error?: string;
  message?: string;
  totalRequests?: number;
  cacheHits?: number;
  cacheMisses?: number;
  hitRate?: string;
  cacheSize?: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Handle POST /api/tutor
  if (req.method === 'POST') {
    try {
      const { question, studentId } = req.body;
      
      // Validate input
      if (!question || typeof question !== 'string') {
        return res.status(400).json({
          error: 'Missing or invalid question parameter',
        });
      }
      
      if (!studentId || typeof studentId !== 'string') {
        return res.status(400).json({
          error: 'Missing or invalid studentId parameter',
        });
      }
      
      // Validate question length (3-500 chars)
      const trimmedQuestion = question.trim();
      if (trimmedQuestion.length < 3 || trimmedQuestion.length > 500) {
        return res.status(400).json({
          error: 'Question must be 3-500 characters',
        });
      }
      
      // Get tutor response
      const response = await tutorAgent.generateExplanation(
        trimmedQuestion,
        studentId
      );
      
      // Log performance
      console.log(`[API /tutor] Response: ${response.latency}ms, cached: ${response.cached}`);
      
      return res.status(200).json({
        answer: response.answer,
        cached: response.cached,
        latency: response.latency,
        timestamp: response.timestamp,
      });
    } catch (error) {
      console.error('[API /tutor] Error:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Handle GET /api/tutor/stats
  if (req.method === 'GET') {
    try {
      const stats = tutorAgent.getStats();
      const cacheStats = tutorAgent.getCacheStats();
      
      return res.status(200).json({
        totalRequests: stats.totalRequests,
        cacheHits: stats.cacheHits,
        cacheMisses: stats.cacheMisses,
        hitRate: stats.hitRate,
        cacheSize: cacheStats.size,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('[API /tutor/stats] Error:', error);
      return res.status(500).json({
        error: 'Failed to get statistics',
      });
    }
  }

  // Handle DELETE /api/tutor - Clear conversation history
  if (req.method === 'DELETE') {
    try {
      const { studentId } = req.body;
      
      if (!studentId || typeof studentId !== 'string') {
        return res.status(400).json({
          error: 'Missing or invalid studentId parameter',
        });
      }
      
      tutorAgent.clearHistory(studentId);
      
      console.log(`[API /tutor] Cleared history for student: ${studentId}`);
      
      return res.status(200).json({
        message: 'Conversation history cleared! 🧹 Starting fresh!',
      });
    } catch (error) {
      console.error('[API /tutor] Clear history error:', error);
      return res.status(500).json({
        error: 'Failed to clear history',
      });
    }
  }

  // Method not allowed
  return res.status(405).json({
    error: 'Method not allowed',
  });
}
