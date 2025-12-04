
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

const TRUSTED_IP_ADDRESSES = process.env.MPESA_TRUSTED_IPS?.split(',') || [];

export default async function handler(req: any, res: any) {
  const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  if (TRUSTED_IP_ADDRESSES.length > 0 && !TRUSTED_IP_ADDRESSES.includes(clientIp)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { Body } = req.body;
    const { stkCallback } = Body;

    if (stkCallback.ResultCode === 0) {
      const checkoutRequestId = stkCallback.CheckoutRequestID;
      const mpesaTransactionId = stkCallback.CallbackMetadata.Item.find((item: any) => item.Name === 'MpesaReceiptNumber')?.Value;

      await sql`
        UPDATE bookings
        SET payment_status = 'paid', mpesa_transaction_id = ${mpesaTransactionId}
        WHERE checkout_request_id = ${checkoutRequestId}
      `;
    }

    return res.status(200).json({ ResultCode: 0, ResultDesc: 'Success' });
  } catch (error: any) {
    console.error('M-Pesa Callback Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
