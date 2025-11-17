import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
    node_env: process.env.NODE_ENV,
    port: process.env.PORT,
    database_url: process.env.DATABASE_URL,
    bcrypt_salt_rounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,
    cloudinary: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    },
    jwt: {
        access_token_secret: process.env.JWT_ACCESS_TOKEN_SECRET,
        refresh_token_secret: process.env.JWT_REFRESH_TOKEN_SECRET,
        expire_in: process.env.JWT_EXPIRE_IN,
        reset_pass_secret: process.env.RESET_PASSWORD_SECRET,
        reset_pass_token_expires_in: process.env.RESET_PASS_TOKEN_EXPIRE_IN,
    },
    reset_pass_link: process.env.RESET_PASS_LINK,
    openRouterApiKey: process.env.OPEN_ROUTER_API_KEY,
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    stripeWebHookSecret: process.env.STRIPE_WEBHOOK_SECRET,


    emailSender: {
        email: process.env.EMAIL,
        app_pass: process.env.APP_PASS
    },
}