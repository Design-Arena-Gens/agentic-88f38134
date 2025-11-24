import { NextResponse } from 'next/server';

// This would connect to your job storage in production
export async function GET() {
  return NextResponse.json({
    jobs: [],
    message: 'No jobs found. Jobs are stored in memory and cleared on restart.',
  });
}
