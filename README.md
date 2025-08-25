# PixelKit - Digital Media E-commerce Platform

A modern e-commerce platform for selling digital media assets including images, videos, e-books, and PDFs. Built with Next.js, TypeScript, and integrated with ImageKit for media storage and Razorpay for payments.

##  Project Overview

PixelKit is a comprehensive digital media marketplace similar to Shutterstock and ImagesBazaar, where creators can sell their digital assets in various formats and sizes. The platform handles dynamic image resizing, multiple licensing options, and secure payment processing.

### Key Features

- **Multi-format Digital Assets**: Support for images, videos, e-books, and PDFs
- **Dynamic Image Variants**: Automatic generation of different sizes and aspect ratios
- **Flexible Licensing**: Personal and commercial license options
- **Secure Payments**: Integrated Razorpay payment gateway
- **Cloud Storage**: ImageKit integration for efficient media management
- **User Authentication**: NextAuth.js for secure user management
- **Admin Panel**: Complete product and order management system

##  Architecture

### Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js
- **Media Storage**: ImageKit
- **Payments**: Razorpay
- **Email**: Nodemailer

### Core Components

#### Image Variants System
The platform supports three main image formats:
- **Square (1:1)**: 1200x1200px - Perfect for social media
- **Widescreen (16:9)**: 1920x1080px - Ideal for presentations and videos
- **Portrait (3:4)**: 1080x1440px - Great for mobile content

Each variant can have different pricing and licensing options.

#### Licensing Model
- **Personal License**: For individual use, personal projects
- **Commercial License**: For business use, commercial projects

##  Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB database
- ImageKit account
- Razorpay account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pixelKit
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file with the following variables:
   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string
   
   # NextAuth
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   
   # ImageKit
   IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
   IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
   IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
   
   # Razorpay
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   
   # Email (Optional)
   EMAIL_SERVER_HOST=your_smtp_host
   EMAIL_SERVER_PORT=587
   EMAIL_SERVER_USER=your_email_user
   EMAIL_SERVER_PASSWORD=your_email_password
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
pixelKit/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── products/      # Product management
│   │   ├── orders/        # Order processing
│   │   └── webhook/       # Payment webhooks
│   ├── components/        # Reusable React components
│   ├── login/             # User login page
│   ├── register/          # User registration
│   ├── products/          # Product catalog
│   └── orders/            # Order history
├── lib/                   # Utility libraries
├── models/                # MongoDB schemas
└── types.d.ts            # TypeScript definitions
```

##  Key Features Implementation

### 1. Dynamic Image Processing
- Images are stored in their original format
- On-demand resizing for different variants
- Automatic aspect ratio maintenance
- Quality optimization for web delivery

### 2. Payment Integration
- Secure Razorpay integration
- Webhook handling for payment verification
- Order status tracking
- Download link generation after successful payment

### 3. User Management
- Secure authentication with NextAuth.js
- User registration and login
- Order history tracking
- Admin role management

### 4. Admin Features
- Product upload and management
- Order monitoring and fulfillment
- User management
- Sales analytics

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/session` - Get current session

### Products
- `GET /api/products` - List all products
- `GET /api/products/[id]` - Get specific product
- `POST /api/products` - Create new product (Admin)
- `PUT /api/products/[id]` - Update product (Admin)
- `DELETE /api/products/[id]` - Delete product (Admin)

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/user` - Get user-specific orders

### Payments
- `POST /api/webhook/razorpay` - Razorpay webhook handler

##  UI/UX Features

- **Responsive Design**: Mobile-first approach
- **Modern Interface**: Clean, professional design
- **Image Gallery**: High-quality product previews
- **Shopping Cart**: Seamless checkout experience
- **Order Tracking**: Real-time order status updates

##  Security Features

- **Authentication**: Secure user sessions
- **Payment Security**: PCI-compliant payment processing
- **File Upload**: Secure media upload with validation
- **API Protection**: Rate limiting and input validation
- **Data Encryption**: Sensitive data encryption

##  Deployment

### Vercel Deployment (Recommended)

1. **Connect to Vercel**
   ```bash
   npm install -g vercel
   vercel login
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Environment Variables**
   Set all environment variables in Vercel dashboard

### Other Platforms

The application can be deployed on any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

##  Future Enhancements

- **Advanced Search**: AI-powered image search
- **Bulk Downloads**: Multiple asset purchases
- **Subscription Plans**: Monthly/yearly subscriptions
- **Creator Dashboard**: Analytics for content creators
- **API Access**: Public API for third-party integrations
- **Mobile App**: React Native mobile application
- **Advanced Licensing**: Extended license options
- **Analytics**: Detailed sales and user analytics

##  Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

##  Acknowledgments

- Next.js team for the amazing framework
- ImageKit for media storage solutions
- Razorpay for payment processing
- MongoDB for database solutions
- The open-source community for various libraries and tools

---

**PixelKit** - Empowering creators to monetize their digital assets with ease and security.
