
import axios from 'axios';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

const MPESA_BASE_URL = process.env.MPESA_BASE_URL || 'https://sandbox.safaricom.co.ke';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { phoneNumber, amount, accountReference, transactionDesc, bookingId } = req.body;

    // Get M-Pesa access token
    const auth = Buffer.from(
      `${process.env.VITE_MPESA_CONSUMER_KEY}:${process.env.VITE_MPESA_CONSUMER_SECRET}`
    ).toString('base64');

    const tokenResponse = await axios.get(
      `${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
      { headers: { Authorization: `Basic ${auth}` } }
    );

    const accessToken = tokenResponse.data.access_token;

    // Generate timestamp and password
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = Buffer.from(
      `${process.env.VITE_MPESA_SHORTCODE}${process.env.VITE_MPESA_PASSKEY}${timestamp}`
    ).toString('base64');

    // Initiate STK Push
    const stkResponse = await axios.post(
      `${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
      {
        BusinessShortCode: process.env.VITE_MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.ceil(amount),
        PartyA: phoneNumber,
        PartyB: process.env.VITE_MPESA_SHORTCODE,
        PhoneNumber: phoneNumber,
        CallBackURL: process.env.MPESA_CALLBACK_URL,
        AccountReference: accountReference,
        TransactionDesc: transactionDesc,
      },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    // Store CheckoutRequestID in the booking
    await sql`
      UPDATE bookings
      SET checkout_request_id = ${stkResponse.data.CheckoutRequestID}
      WHERE id = ${bookingId}
    `;

    return res.status(200).json(stkResponse.data);
  } catch (error: any) {
    console.error('M-Pesa Error:', error.response?.data || error.message);
    return res.status(500).json({
      error: error.response?.data || error.message
    });
  }
}
