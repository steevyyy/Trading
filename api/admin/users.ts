
import { neon } from '@neondatabase/serverless';
import { Clerk } from '@clerk/clerk-sdk-node';

const sql = neon(process.env.DATABASE_URL!);
const clerk = Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE');
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
      const users = await sql`SELECT * FROM users ORDER BY created_at DESC`;
      return res.status(200).json(users);
    }

    if (req.method === 'PUT') {
      const { user_id, name, email, phone } = req.body;
      const result = await sql`
        UPDATE users SET name = ${name}, email = ${email}, phone = ${phone}
        WHERE id = ${user_id} RETURNING *
      `;
      return res.status(200).json(result[0]);
    }

    if (req.method === 'DELETE') {
      const { user_id } = req.body;
      await sql`DELETE FROM bookings WHERE user_id = ${user_id}`;
      await sql`DELETE FROM users WHERE id = ${user_id}`;
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Admin Users API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
