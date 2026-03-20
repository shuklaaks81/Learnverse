import { NextRequest, NextResponse } from 'next/server';
import { lessonGenerator } from '@/utils/lessonGenerator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subject, topic, gradeLevel, difficulty } = body;

    // Validate input
    if (!subject || !topic || !gradeLevel || !difficulty) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if Groq is configured
    if (!lessonGenerator.isConfigured()) {
      console.error('Groq API key missing or empty');
      return NextResponse.json(
        { error: 'Groq API not configured. Please add NEXT_PUBLIC_GROQ_API_KEY to .env' },
        { status: 500 }
      );
    }

    console.log('Generating lesson:', { subject, topic, gradeLevel, difficulty });

    // Generate lesson
    const lesson = await lessonGenerator.generateLesson({
      subject,
      topic,
      gradeLevel,
      difficulty,
    });

    console.log('Lesson generated successfully');
    return NextResponse.json({ lesson });
    
  } catch (error) {
    console.error('Lesson generation API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate lesson';
    return NextResponse.json(
      { error: `Failed to generate lesson: ${errorMessage}` },
      { status: 500 }
    );
  }
}
