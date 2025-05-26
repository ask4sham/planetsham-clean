import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    // Your cron job logic here
    console.log('Cron job executed at:', new Date().toISOString());
    
    // Example: Fetch data from an API
    // const data = await fetch('https://api.example.com');
    
    res.status(200).json({
      success: true,
      message: 'Cron job completed',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Cron job failed:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}