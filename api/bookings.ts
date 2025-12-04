
import { neon } from '@neondatabase/serverless';
import { Clerk } from '@clerk/clerk-sdk-node';

const sql = neon(process.env.DATABASE_URL!);
const clerk = Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { sessionId } = req.query;
  if (!sessionId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const session = await clerk.sessions.verifySession(sessionId);
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.method === 'POST') {
      const {
        user_id, vehicle_id, pickup_location, destination,
        pickup_coords, destination_coords, booking_date,
        ride_type, ride_status, status, total_amount, payment_status
      } = req.body;

      if (session.userId !== user_id) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      const result = await sql`
        INSERT INTO bookings (
          user_id, vehicle_id, pickup_location, destination,
          pickup_coords, destination_coords, booking_date,
          ride_type, ride_status, status, total_amount, payment_status
        ) VALUES (
          ${user_id}, ${vehicle_id}, ${pickup_location}, ${destination},
          ${pickup_coords}, ${destination_coords}, ${booking_date},
          ${ride_type || 'scheduled'}, ${ride_status || 'pending'},
          ${status || 'pending'}, ${total_amount}, ${payment_status || 'pending'}
        ) RETURNING *
      `;

      return res.status(200).json(result[0]);
    }

    if (req.method === 'GET') {
      const { user_id, booking_id, active } = req.query;

      if (user_id && session.userId !== user_id) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      if (booking_id) {
        const result = await sql`SELECT * FROM bookings WHERE id = ${booking_id}`;
        return res.status(200).json(result[0] || null);
      }

      if (active === 'true' && user_id) {
        const result = await sql`
          SELECT * FROM bookings
          WHERE user_id = ${user_id}
          AND ride_type = 'instant'
          AND ride_status IN ('searching', 'driver_assigned', 'en_route', 'arrived', 'in_progress')
          ORDER BY created_at DESC
          LIMIT 1
        `;
        return res.status(200).json(result[0] || null);
      }

      if (user_id) {
        const result = await sql`
          SELECT * FROM bookings
          WHERE user_id = ${user_id}
          ORDER BY created_at DESC
        `;
        return res.status(200).json(result);
      }

      return res.status(400).json({ error: 'Missing parameters' });
    }

    if (req.method === 'PUT') {
      const { booking_id, payment_status, mpesa_transaction_id, driver_info, ride_status } = req.body;

      const [booking] = await sql`SELECT user_id FROM bookings WHERE id = ${booking_id}`;
      if (booking && session.userId !== booking.user_id) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      if (driver_info) {
        const result = await sql`
          UPDATE bookings SET
            driver_id = ${driver_info.driver_id},
            driver_name = ${driver_info.driver_name},
            driver_phone = ${driver_info.driver_phone},
            driver_rating = ${driver_info.driver_rating},
            vehicle_plate = ${driver_info.vehicle_plate},
            estimated_arrival = ${driver_info.estimated_arrival},
            ride_status = 'driver_assigned'
          WHERE id = ${booking_id}
          RETURNING *
        `;
        return res.status(200).json(result[0]);
      }

      if (payment_status) {
        const result = await sql`
          UPDATE bookings SET
            payment_status = ${payment_status},
            mpesa_transaction_id = ${mpesa_transaction_id}
          WHERE id = ${booking_id}
          RETURNING *
        `;
        return res.status(200).json(result[0]);
      }

      if (ride_status) {
        const result = await sql`
          UPDATE bookings SET ride_status = ${ride_status}
          WHERE id = ${booking_id}
          RETURNING *
        `;
        return res.status(200).json(result[0]);
      }

      return res.status(400).json({ error: 'Missing update parameters' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
