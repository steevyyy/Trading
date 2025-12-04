
import { neon } from '@neondatabase/serverless';
import { Clerk } from '@clerk/clerk-sdk-node';

const sql = neon(process.env.DATABASE_URL!);
const clerk = Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT');
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

    if (req.method === 'POST') {
      const { name, phone, email, vehicle_type, vehicle_plate, license_number } = req.body;

      const result = await sql`
        INSERT INTO drivers (name, phone, email, vehicle_type, vehicle_plate, license_number, status)
        VALUES (${name}, ${phone}, ${email}, ${vehicle_type}, ${vehicle_plate}, ${license_number}, 'pending')
        RETURNING *
      `;
      return res.status(200).json(result[0]);
    }

    if (req.method === 'GET') {
      const { driver_id, status } = req.query;

      if (driver_id) {
        const result = await sql`SELECT * FROM drivers WHERE id = ${driver_id}`;
        return res.status(200).json(result[0] || null);
      }

      if (status) {
        const result = await sql`SELECT * FROM drivers WHERE status = ${status} ORDER BY created_at DESC`;
        return res.status(200).json(result);
      }

      const result = await sql`SELECT * FROM drivers ORDER BY created_at DESC`;
      return res.status(200).json(result);
    }

    if (req.method === 'PUT') {
      const { driver_id, status, is_available } = req.body;

      if (session.publicUserData?.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden' });
      }

      if (status) {
        const result = await sql`
          UPDATE drivers SET status = ${status}
          WHERE id = ${driver_id} RETURNING *
        `;
        return res.status(200).json(result[0]);
      }

      if (is_available !== undefined) {
        const result = await sql`
          UPDATE drivers SET is_available = ${is_available}
          WHERE id = ${driver_id} RETURNING *
        `;
        return res.status(200).json(result[0]);
      }

      return res.status(400).json({ error: 'Missing update parameters' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Drivers API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
