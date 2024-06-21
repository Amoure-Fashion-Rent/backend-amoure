import { config } from 'dotenv';

// config({ path: `.env` });
config();

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const { ENV, PORT, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, ORIGIN, DATABASE_URL, PRODUCT_BUCKET_NAME, GCP_BUCKET_SERVICE_ACCOUNT } =
  process.env;
