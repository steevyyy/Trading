# Vercel Environment Setup

To deploy your application to Vercel, you will need to configure the following environment variables in your project settings.

## Production Environment Variables

Go to your Vercel project's "Settings" tab, then navigate to "Environment Variables" and add the following:

### Clerk Authentication
-   **Name:** `VITE_CLERK_PUBLISHABLE_KEY`
-   **Value:** `pk_live_your_clerk_production_key`

### GeoApify Location Services
-   **Name:** `VITE_GEOAPIFY_API_KEY`
-   **Value:** Your production GeoApify API key.

### NeonDB Database
-   **Name:** `DATABASE_URL`
-   **Value:** `postgresql://<user>:<password>@<host>:<port>/<dbname>`
    -   *Note: This must be a **production** database connection string.*

### M-Pesa Payment (Safaricom)
-   **Name:** `VITE_MPESA_CONSUMER_KEY`
-   **Value:** Your production M-Pesa Consumer Key.
-   **Name:** `VITE_MPESA_CONSUMER_SECRET`
-   **Value:** Your production M-Pesa Consumer Secret.
-   **Name:** `VITE_MPESA_SHORTCODE`
-   **Value:** Your production M-Pesa Shortcode (e.g., `600986`).
-   **Name:** `VITE_MPESA_PASSKEY`
-   **Value:** Your production M-Pesa Passkey.

## Security Warning

**Do not commit sensitive files like `.env` or `.env.production` to your Git repository.** Use the Vercel environment variable settings to keep your secrets secure.

By following these instructions, your application will have the necessary configuration to run in a production environment on Vercel.
