# PixelKit Setup Guide

## Environment Variables Setup

Create a `.env.local` file in the root directory with the following variables:

```bash
# Database
MONGODB_URL=mongodb://localhost:27017/pixelkit

# NextAuth
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-secret-key-here

# ImageKit
IMAGEKIT_PUBLIC_KEY=your-imagekit-public-key
IMAGEKIT_PRIVATE_KEY=your-imagekit-private-key
IMAGEKIT_URL_ENDPOINT=your-imagekit-url-endpoint

# Razorpay
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret

# Email (Optional)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Quick Setup for Development

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Set up MongoDB:**
   - Install MongoDB locally, or
   - Use MongoDB Atlas (free tier available)

3. **Create .env.local file** with the variables above

4. **Generate a secret key:**
   ```bash
   openssl rand -base64 32
   ```

5. **Start the development server:**
   ```bash
   pnpm dev
   ```

## Services Setup

### MongoDB
- Local: Install MongoDB Community Edition
- Cloud: Use MongoDB Atlas (free tier)

### ImageKit
- Sign up at [ImageKit.io](https://imagekit.io)
- Get your public key, private key, and URL endpoint

### Razorpay
- Sign up at [Razorpay.com](https://razorpay.com)
- Get your key ID and key secret from the dashboard

### Google OAuth (Optional)
- Go to Google Cloud Console
- Create OAuth 2.0 credentials
- Add authorized redirect URIs

## Troubleshooting

### Tailwind CSS Issues
If you see styling issues, make sure:
- Tailwind CSS v4 is properly configured
- The `@import "tailwindcss";` directive is in your CSS

### Database Connection Issues
- Check your MongoDB connection string
- Ensure MongoDB is running
- Verify network connectivity

### Port Issues
- The app runs on port 3001 if 3000 is in use
- Check the terminal output for the correct URL
