import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const { apiKey, videoUrl, title, description, tags } = await request.json();

    if (!apiKey || !videoUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Initialize YouTube API client
    const youtube = google.youtube({
      version: 'v3',
      auth: apiKey,
    });

    // Download video
    const videoResponse = await axios.get(videoUrl, {
      responseType: 'stream',
      timeout: 30000,
    });

    // Upload to YouTube
    const uploadResponse = await youtube.videos.insert({
      part: ['snippet', 'status'],
      requestBody: {
        snippet: {
          title: title || 'AI Generated Video',
          description: description || 'Uploaded by AI Agent',
          tags: tags || [],
          categoryId: '22', // People & Blogs
        },
        status: {
          privacyStatus: 'private', // Start as private for safety
        },
      },
      media: {
        body: videoResponse.data,
      },
    });

    return NextResponse.json({
      success: true,
      videoId: uploadResponse.data.id,
      videoUrl: `https://www.youtube.com/watch?v=${uploadResponse.data.id}`,
      message: 'Video uploaded successfully (set to private)',
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      {
        error: error.message || 'Failed to upload video',
        details: 'Note: YouTube API requires OAuth 2.0 for uploads. This demo uses API key which has limitations. For production, implement OAuth 2.0 flow.'
      },
      { status: 500 }
    );
  }
}
