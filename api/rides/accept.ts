
import { neon } from '@neondatabase/serverless';
import { Clerk } from '@clerk/clerk-sdk-node';

const sql = neon(process.env.DATABASE_URL!);
const clerk = Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
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

    if (session.publicUserData?.role !== 'driver') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (req.method === 'POST') {
      const { booking_id, driver_id, driver_name, driver_phone, driver_rating, vehicle_plate, estimated_arrival } = req.body;

      const result = await sql`
        UPDATE bookings SET
          driver_id = ${driver_id},
          driver_name = ${driver_name},
          driver_phone = ${driver_phone},
          driver_rating = ${driver_rating},
          vehicle_plate = ${vehicle_plate},
          estimated_arrival = ${estimated_arrival},
          ride_status = 'driver_assigned'
        WHERE id = ${booking_id}
        AND driver_id IS NULL
        RETURNING *
      `;

      if (result.length === 0) {
        return res.status(409).json({ error: 'Ride already accepted by another driver' });
      }

      return res.status(200).json(result[0]);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Accept Ride API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
