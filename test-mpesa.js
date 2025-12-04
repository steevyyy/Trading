
import axios from 'axios';

// Instructions:
// 1. Create a `.env` file in the root of the project.
// 2. Add your M-Pesa sandbox credentials to the `.env` file:
//    VITE_MPESA_CONSUMER_KEY="your_consumer_key"
//    VITE_MPESA_CONSUMER_SECRET="your_consumer_secret"
//    VITE_MPESA_SHORTCODE="your_shortcode"
//    VITE_MPESA_PASSKEY="your_passkey"
// 3. Make sure to install `dotenv` by running: npm install dotenv
// 4. Run this script from the root of your project: node test-mpesa.js

require('dotenv').config();

const CONSUMER_KEY = process.env.VITE_MPESA_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.VITE_MPESA_CONSUMER_SECRET;
const SHORTCODE = process.env.VITE_MPESA_SHORTCODE;
const PASSKEY = process.env.VITE_MPESA_PASSKEY;

const Mpesa = {
  getAuthToken: async () => {
    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
    try {
      const response = await axios.get(
        'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
        { headers: { Authorization: `Basic ${auth}` } }
      );
      return response.data.access_token;
    } catch (error) {
      console.error('Failed to get M-Pesa auth token:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  initiateStkPush: async (token, phoneNumber, amount) => {
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
    const password = Buffer.from(`${SHORTCODE}${PASSKEY}${timestamp}`).toString('base64');

    try {
      const response = await axios.post(
        'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
        {
          BusinessShortCode: SHORTCODE,
          Password: password,
          Timestamp: timestamp,
          TransactionType: 'CustomerPayBillOnline',
          Amount: amount,
          PartyA: phoneNumber,
          PartyB: SHORTCODE,
          PhoneNumber: phoneNumber,
          CallBackURL: 'https://your-callback-url.com/mpesa-callback', // This should be a publicly accessible URL
          AccountReference: 'ConnectaTest',
          TransactionDesc: 'Test payment',
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to initiate STK push:', error.response ? error.response.data : error.message);
      throw error;
    }
  },
};

async function testMpesaIntegration() {
  console.log('🧪 Testing M-Pesa STK Push...');

  if (!CONSUMER_KEY || !CONSUMER_SECRET || !SHORTCODE || !PASSKEY) {
    console.error('❌ Error: M-Pesa credentials are not set. Please check your .env file.');
    return;
  }

  try {
    const token = await Mpesa.getAuthToken();
    console.log('✅ Got M-Pesa auth token.');

    const testPhoneNumber = '254708374149'; // Use a valid test phone number
    const testAmount = 1;

    console.log(`🚀 Initiating STK push to ${testPhoneNumber} for KSh ${testAmount}...`);
    const result = await Mpesa.initiateStkPush(token, testPhoneNumber, testAmount);

    if (result.ResponseCode === '0') {
      console.log('✅ STK Push initiated successfully!');
      console.log('    - CheckoutRequestID:', result.CheckoutRequestID);
      console.log('    - CustomerMessage:', result.CustomerMessage);
      console.log('ℹ️  Check your phone for the M-Pesa prompt.');
    } else {
      console.error('❌ STK Push initiation failed:', result);
    }
  } catch (error) {
    console.error('❌ M-Pesa integration test failed.');
  }
}

testMpesaIntegration();
