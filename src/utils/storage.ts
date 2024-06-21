import { Storage } from '@google-cloud/storage';
import { GCP_BUCKET_SERVICE_ACCOUNT, PRODUCT_BUCKET_NAME } from '@/lib/config';

const storage = new Storage({
  keyFilename: GCP_BUCKET_SERVICE_ACCOUNT,
});
const bucket = storage.bucket(PRODUCT_BUCKET_NAME);

export { bucket, storage };
