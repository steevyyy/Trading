
import { neon } from '@neondatabase/serverless';
import { Clerk } from '@clerk/clerk-sdk-node';

const sql = neon(process.env.DATABASE_URL!);
const clerk = Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { sessionId } = req.query;
  if (!sessionId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const session = await clerk.sessions.verifySession(sessionId);
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.method === 'GET') {
      const rides = await sql`
        SELECT b.*, u.name as user_name, u.phone as user_phone
        FROM bookings b
        LEFT JOIN users u ON b.user_id = u.id
        WHERE b.ride_type = 'instant'
        AND b.ride_status = 'searching'
        AND b.driver_id IS NULL
        ORDER BY b.created_at ASC
      `;
      return res.status(200).json(rides);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any)
{
    console.error('Available Rides API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
