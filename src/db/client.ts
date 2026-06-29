/**
 * Database Client for Railway PostgreSQL
 * Simple connection pooling with prepared queries
 */

import { Pool, QueryResult } from 'pg';
import { QUERIES } from './schema';

class DatabaseClient {
  private pool: Pool | null = null;

  constructor() {
    // Lazy initialization - only connect when needed
    if (typeof window === 'undefined') {
      this.initPool();
    }
  }

  private initPool() {
    if (this.pool) return;

    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 10, // Max 10 connections (Railway free tier limit)
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    this.pool.on('error', (err) => {
      console.error('Unexpected pool error:', err);
    });
  }

  async query(text: string, params?: any[]): Promise<QueryResult> {
    if (!this.pool) {
      throw new Error('Database pool not initialized');
    }

    const start = Date.now();
    try {
      const result = await this.pool.query(text, params);
      const duration = Date.now() - start;
      
      if (duration > 100) {
        console.warn(`Slow query (${duration}ms):`, text.substring(0, 100));
      }
      
      return result;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  // Student operations
  async getStudent(kidId: string) {
    const result = await this.query(QUERIES.getStudent, [kidId]);
    return result.rows[0];
  }

  async createStudent(data: {
    kidId: string;
    name: string;
    avatar: string;
    gradeLevel: number;
    coins?: number;
    streak?: number;
  }) {
    const result = await this.query(QUERIES.createStudent, [
      data.kidId,
      data.name,
      data.avatar,
      data.gradeLevel,
      data.coins || 0,
      data.streak || 0,
    ]);
    return result.rows[0];
  }

  // Lesson operations
  async getLessons(subject: string, gradeLevel: number) {
    const result = await this.query(QUERIES.getLessons, [subject, gradeLevel]);
    return result.rows;
  }

  // Progress tracking
  async upsertProgress(data: {
    studentId: string;
    lessonId: string;
    completed: boolean;
    score: number;
    timeSpent: number;
    attempts: number;
  }) {
    const completedAt = data.completed ? new Date() : null;
    const result = await this.query(QUERIES.upsertProgress, [
      data.studentId,
      data.lessonId,
      data.completed,
      data.score,
      data.timeSpent,
      data.attempts,
      completedAt,
    ]);
    return result.rows[0];
  }

  // Tutor logging
  async logTutorInteraction(data: {
    studentId: string;
    question: string;
    answer: string;
    cached: boolean;
    latency: number;
  }) {
    const result = await this.query(QUERIES.logTutorInteraction, [
      data.studentId,
      data.question,
      data.answer,
      data.cached,
      data.latency,
    ]);
    return result.rows[0];
  }

  // Agent logging
  async logAgentAction(data: {
    agentType: 'tutor' | 'content_gen' | 'code_agent';
    action: string;
    success: boolean;
    errorMessage?: string;
    metadata?: Record<string, any>;
    costUsd?: number;
  }) {
    const result = await this.query(QUERIES.logAgentAction, [
      data.agentType,
      data.action,
      data.success,
      data.errorMessage || null,
      data.metadata || {},
      data.costUsd || 0,
    ]);
    return result.rows[0];
  }

  async close() {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
    }
  }
}

// Singleton instance
export const db = new DatabaseClient();
