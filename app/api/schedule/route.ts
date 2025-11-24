import { NextRequest, NextResponse } from 'next/server';

// In-memory job storage (use database in production)
const scheduledJobs: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const { apiKey, videoUrl, title, description, tags, scheduleTime } = await request.json();

    if (!apiKey || !videoUrl || !scheduleTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const job = {
      id: Date.now().toString(),
      apiKey,
      videoUrl,
      title,
      description,
      tags,
      scheduleTime: new Date(scheduleTime),
      status: 'scheduled',
      createdAt: new Date(),
    };

    scheduledJobs.push(job);

    // In production, use a proper job queue system like:
    // - Bull Queue with Redis
    // - AWS SQS
    // - Vercel Cron Jobs
    // - Upstash QStash

    return NextResponse.json({
      success: true,
      jobId: job.id,
      message: 'Job scheduled successfully',
      scheduleTime: job.scheduleTime,
    });
  } catch (error: any) {
    console.error('Schedule error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to schedule job' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    jobs: scheduledJobs,
  });
}
