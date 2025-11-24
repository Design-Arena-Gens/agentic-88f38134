'use client';

import { useState } from 'react';

export default function Home() {
  const [apiKey, setApiKey] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [prompt, setPrompt] = useState('');
  const [schedule, setSchedule] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [jobs, setJobs] = useState<any[]>([]);

  const generateContent = async () => {
    if (!openaiKey || !prompt) {
      setError('Please provide OpenAI API key and content prompt');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ openaiKey, prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate content');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const uploadVideo = async () => {
    if (!apiKey || !videoUrl) {
      setError('Please provide YouTube API key and video URL');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey,
          videoUrl,
          title: result?.title || 'AI Generated Video',
          description: result?.description || 'Created by AI Agent',
          tags: result?.tags || [],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload video');
      }

      setResult(data);
      alert('Video scheduled for upload! Check the status in the jobs section.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const schedulePost = async () => {
    if (!apiKey || !videoUrl || !schedule) {
      setError('Please provide YouTube API key, video URL, and schedule time');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey,
          videoUrl,
          title: result?.title || 'AI Generated Video',
          description: result?.description || 'Created by AI Agent',
          tags: result?.tags || [],
          scheduleTime: schedule,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to schedule post');
      }

      setJobs([...jobs, data]);
      alert('Video scheduled successfully!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getJobs = async () => {
    try {
      const response = await fetch('/api/jobs');
      const data = await response.json();
      setJobs(data.jobs || []);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <main className="min-h-screen p-8 max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
        <h1 className="text-4xl font-bold mb-2 text-gray-800">YouTube AI Agent</h1>
        <p className="text-gray-600 mb-6">Automatically generate and post videos to YouTube</p>

        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Step 1: Configure API Keys</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  YouTube API Key (from Google Cloud Console)
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your YouTube Data API v3 key"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  OpenAI API Key (for content generation)
                </label>
                <input
                  type="password"
                  value={openaiKey}
                  onChange={(e) => setOpenaiKey(e.target.value)}
                  placeholder="Enter your OpenAI API key"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Step 2: Generate Video Metadata</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content Prompt (AI will generate title, description, and tags)
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., Create metadata for a tech review video about the latest smartphone"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              </div>
              <button
                onClick={generateContent}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? 'Generating...' : 'Generate Metadata with AI'}
              </button>
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Step 3: Upload Video</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video URL (direct link to video file)
                </label>
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://example.com/video.mp4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={uploadVideo}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {loading ? 'Uploading...' : 'Upload Now'}
                </button>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Step 4: Schedule Post (Optional)</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Schedule Time
                </label>
                <input
                  type="datetime-local"
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              </div>
              <button
                onClick={schedulePost}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? 'Scheduling...' : 'Schedule Post'}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {result && (
            <div className="bg-green-50 border border-green-200 px-4 py-3 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Result:</h3>
              <pre className="text-sm text-green-700 whitespace-pre-wrap">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-xl p-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Scheduled Jobs</h2>
          <button
            onClick={getJobs}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Refresh
          </button>
        </div>
        {jobs.length === 0 ? (
          <p className="text-gray-600">No scheduled jobs yet</p>
        ) : (
          <div className="space-y-4">
            {jobs.map((job, idx) => (
              <div key={idx} className="border border-gray-200 p-4 rounded-lg">
                <div className="text-sm text-gray-600">
                  <p><strong>Status:</strong> {job.status}</p>
                  <p><strong>Scheduled for:</strong> {new Date(job.scheduleTime).toLocaleString()}</p>
                  <p><strong>Title:</strong> {job.title}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Setup Instructions:</h3>
        <ol className="list-decimal list-inside space-y-2 text-blue-800 text-sm">
          <li>Get YouTube Data API v3 key from Google Cloud Console</li>
          <li>Enable YouTube Data API v3 in your project</li>
          <li>Get OpenAI API key from platform.openai.com</li>
          <li>Enter your API keys above</li>
          <li>Use AI to generate video metadata or enter manually</li>
          <li>Provide a direct URL to your video file</li>
          <li>Upload immediately or schedule for later</li>
        </ol>
      </div>
    </main>
  );
}
