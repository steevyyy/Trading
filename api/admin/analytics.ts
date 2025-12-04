
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
    if (!session || session.publicUserData?.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (req.method === 'GET') {
      const { type, days = '30' } = req.query;

      if (type === 'stats') {
        const [users, bookings, revenue, activeRides] = await Promise.all([
          sql`SELECT COUNT(*) as count FROM users`,
          sql`SELECT COUNT(*) as count FROM bookings`,
          sql`SELECT SUM(total_amount) as total FROM bookings WHERE payment_status = 'paid'`,
          sql`SELECT COUNT(*) as count FROM bookings WHERE ride_status IN ('driver_assigned', 'en_route', 'in_progress')`
        ]);

        return res.status(200).json({
          totalUsers: parseInt(users[0]?.count || '0'),
          totalBookings: parseInt(bookings[0]?.count || '0'),
          totalRevenue: parseFloat(revenue[0]?.total || '0'),
          activeRides: parseInt(activeRides[0]?.count || '0')
        });
      }

      if (type === 'revenue') {
        const result = await sql`
          SELECT
            DATE(created_at) as date,
            SUM(total_amount) as revenue,
            COUNT(*) as rides
          FROM bookings
          WHERE payment_status = 'paid'
          AND created_at >= NOW() - INTERVAL '1 day' * ${parseInt(days)}
          GROUP BY DATE(created_at)
          ORDER BY date DESC
        `;
        return res.status(200).json(result);
      }

      return res.status(400).json({ error: 'Invalid type parameter' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Admin Analytics API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
