
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

  const { sessionId, clerk_id } = req.query;
  if (!sessionId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const session = await clerk.sessions.verifySession(sessionId);
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (session.userId !== clerk_id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (req.method === 'POST') {
      const { email, name, phone } = req.body;

      const result = await sql`
        INSERT INTO users (clerk_id, email, name, phone)
        VALUES (${clerk_id}, ${email}, ${name}, ${phone})
        ON CONFLICT (clerk_id) DO UPDATE SET
          email = ${email},
          name = ${name},
          phone = ${phone}
        RETURNING *
      `;

      return res.status(200).json(result[0]);
    }

    if (req.method === 'GET') {
      const result = await sql`
        SELECT * FROM users WHERE clerk_id = ${clerk_id}
      `;

      return res.status(200).json(result[0] || null);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
