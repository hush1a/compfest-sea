# SEA Catering 

SEA Catering is a modern, full-stack meal subscription platform that connects customers with premium catering services. Built with Next.js 15 and Node.js, it offers a secure, scalable solution for meal plan subscriptions with comprehensive user and admin dashboards. This project is made for Compfest 2025's Software Engineering Academy.

## 🌐 Live Demo

**🚀 [View Live Application](https://compfest-sea-pi.vercel.app/)**

- **Frontend**: https://compfest-sea-pi.vercel.app/
- **Backend API**: https://compfest-sea-production.up.railway.app/
- **Database**: MongoDB Atlas (Cloud)
  
## 📚 Table of Contents

- [Features](#-features)
- [Tech Stack](#tech-stack)
- [Sample Data & Testing](#-sample-data--testing)
- [Project Structure](#-project-structure)
- [Security Implementation](#-security-implementation)
- [Production Deployment](#-production-deployment)
- [License](#-license)


## ✨ Features

### 🔐 User Features
- **Authentication System**: Secure login/registration with JWT tokens
- **Public Browsing**: Browse meal plans without authentication
- **Subscription Management**: Subscribe to meal plans with secure ordering
- **User Dashboard**: 
  - View active subscriptions
  - Pause subscriptions (with date range selection)
  - Cancel subscriptions
  - Reactivate paused subscriptions
  - View subscription history and details

### 👑 Admin Features
- **Role-based Access**: Admin-only dashboard access
- **Business Analytics**:
  - Date range filtering for all metrics
  - New subscriptions tracking
  - Monthly Recurring Revenue (MRR) analysis
  - Subscription reactivations monitoring
  - Active subscriptions overview
  - Meal plan distribution charts
  - Daily subscription trends
  - Growth analytics

### 🛡️ Security Features
- **Authentication**: JWT-based with secure HTTP-only cookies
- **Authorization**: Role-based access control (User/Admin)
- **Input Validation**: Comprehensive validation with express-validator
- **XSS Protection**: Content sanitization with DOMPurify
- **CSRF Protection**: Custom CSRF token implementation
- **NoSQL Injection Prevention**: mongo-sanitize integration
- **Rate Limiting**: Request throttling to prevent abuse
- **Security Headers**: Helmet.js for enhanced security
- **Password Security**: bcrypt hashing with salt rounds

## 🏗️ Tech Stack

SEA Catering is built with a modern, scalable full-stack architecture using the latest stable technologies across the stack.

### 💻 Frontend

| Technology           | Description                                                                 |
|----------------------|-----------------------------------------------------------------------------|
| **Next.js 15**       | React framework with App Router, server components, and file-based routing  |
| **React 19**         | Latest React version with concurrent features and improved developer tools  |
| **TypeScript**       | Type-safe development for better scalability and maintainability            |
| **Tailwind CSS**     | Utility-first CSS framework for responsive, consistent UI design            |
| **React Hook Form**  | High-performance form state management and validation                       |
| **Axios**            | Promise-based HTTP client for making API requests                           |

---

### 🧠 Backend

| Technology           | Description                                                                 |
|----------------------|-----------------------------------------------------------------------------|
| **Node.js**          | JavaScript runtime environment for building scalable server-side applications |
| **Express.js**       | Minimalist web framework for building RESTful APIs                          |
| **MongoDB**          | NoSQL database used for flexible and performant data storage                |
| **Mongoose**         | MongoDB ODM for schema modeling and validation                              |
| **JWT**              | JSON Web Tokens for secure authentication and session management            |
| **bcrypt**           | Secure password hashing with configurable salt rounds                       |

---

### 🔐 Security & Middleware

| Tool / Library         | Purpose                                                                 |
|------------------------|-------------------------------------------------------------------------|
| **express-validator**  | Request input validation and sanitization                               |
| **helmet**             | Sets secure HTTP headers to mitigate common web vulnerabilities         |
| **cors**               | Configures Cross-Origin Resource Sharing policies                       |
| **rate-limit**         | Throttles repeated requests to prevent brute force and abuse            |
| **mongo-sanitize**     | Prevents NoSQL injection by filtering malicious query content           |
| **DOMPurify**          | Sanitizes HTML inputs to prevent XSS attacks                            |
| **Custom CSRF Tokens** | Stateless CSRF protection using a double-submit cookie pattern          |

---

### 🌐 Deployment & Infrastructure

| Platform / Service      | Role                                                                   |
|-------------------------|------------------------------------------------------------------------|
| **Vercel**              | Frontend hosting with CI/CD for Next.js                                |
| **Railway**             | Backend hosting with Node.js runtime and auto-deploy support           |
| **MongoDB Atlas**       | Cloud-hosted MongoDB cluster with secure authentication and backups    |
| **Environment Variables** | Secure configuration management for local and cloud environments    |
| **HTTPS (SSL)**         | Full encryption of user data in transit across frontend and backend    |

### 💻 Local Development Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd compfest-sea
   ```

2. **Setup Backend**
   ```bash
   cd sea-catering-backend
   npm install
   ```

3. **Setup Frontend**
   ```bash
   cd ../sea-catering
   npm install
   ```

4. **Environment Configuration**
   
### Local Development Setup

For local development, you can still run the project locally:

### Environment Variables (Local Development)

Create `.env` file in `sea-catering-backend/`:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/sea-catering
# Or use: mongodb+srv://[credentials]@sea-catering.xnh3llg.mongodb.net/

# Server
PORT=5000
NODE_ENV=development

# JWT Secret (Generate a strong secret for production!)
JWT_SECRET=your-super-secret-jwt-key-here

# CORS Settings
FRONTEND_URL=http://localhost:3000
```

Create `.env.local` file in `sea-catering/`:
```env
# For local backend
NEXT_PUBLIC_API_URL=http://localhost:5000

# For production backend
# NEXT_PUBLIC_API_URL=https://compfest-sea-production.up.railway.app
```

5. **Start MongoDB**
   ```bash
   # For local MongoDB
   mongod
   
   # Or use MongoDB Atlas connection string in MONGODB_URI
   ```

6. **Run the Application**
   
   Terminal 1 - Backend:
   ```bash
   cd sea-catering-backend
   npm run dev
   ```
   
   Terminal 2 - Frontend:
   ```bash
   cd sea-catering
   npm run dev
   ```

7. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Live Demo: https://compfest-sea-pi.vercel.app/

## 📊 Sample Data & Testing

### Generate Test Data
Create sample users, admins, and subscriptions:

```bash
cd sea-catering-backend
node create-test-data.js
```

This creates:
- **Sample Users**: test@example.com, user1@example.com to user5@example.com (password: password)
- **Admin Account**: admin@seacatering.com (password: password)
- **Meal Plans**: Diet Plan (Rp 30,000), Protein Plan (Rp 40,000), Royal Plan (Rp 60,000)
- **Sample Subscriptions**: Various meal plans with different statuses (active, paused, cancelled)
- **Realistic Data**: Subscription dates spanning recent months for analytics testing

### Live Test Accounts

**Regular User Account:**
- Email: test@example.com
- Password: password
- Access: User dashboard, subscription management

**Admin Account:**
- Email: admin@seacatering.com
- Password: password
- Access: Admin dashboard, business analytics

## 📁 Project Structure

```
compfest-sea/
├── README.md
├── sea-catering/                 # Frontend (Next.js)
│   ├── src/
│   │   ├── app/                  # App Router pages
│   │   │   ├── admin/            # Admin dashboard
│   │   │   ├── dashboard/        # User dashboard
│   │   │   ├── menu/             # Meal plans
│   │   │   ├── subscription/     # Subscription page
│   │   │   └── ...
│   │   ├── components/           # Reusable components
│   │   ├── contexts/             # React contexts
│   │   ├── services/             # API services
│   │   └── data/                 # Static data
│   ├── public/                   # Static assets
│   └── package.json
└── sea-catering-backend/         # Backend (Node.js/Express)
    ├── models/                   # MongoDB models
    ├── routes/                   # API routes
    ├── middleware/               # Custom middleware
    ├── create-test-data.js       # Test data generator
    ├── server.js                 # Main server file
    └── package.json
```

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Meal Plans
- `GET /api/meal-plans` - Get all available meal plans
- `GET /api/meal-plans/:id` - Get specific meal plan details

### Subscriptions
- `GET /api/subscriptions` - Get user subscriptions
- `POST /api/subscriptions` - Create subscription
- `PUT /api/subscriptions/:id/pause` - Pause subscription
- `PUT /api/subscriptions/:id/cancel` - Cancel subscription
- `PUT /api/subscriptions/:id/reactivate` - Reactivate subscription

### Admin Analytics
- `GET /api/admin/analytics` - Get business analytics
- `GET /api/admin/analytics/subscriptions` - Subscription metrics
- `GET /api/admin/analytics/revenue` - Revenue analytics

## 🔒 Security Implementation

### Production-Ready Codebase
- **Clean Build**: All test files and debug code removed for production
- **No Exposed Credentials**: Test JWT tokens and sample credentials eliminated
- **Secure Configuration**: Environment variables properly configured for deployment

### Authentication & Authorization
- JWT tokens stored in HTTP-only cookies
- Role-based access control (User/Admin)
- Protected routes with middleware validation
- Secure password hashing with bcrypt

### Input Validation & Sanitization
- express-validator for request validation
- DOMPurify for XSS prevention
- mongo-sanitize for NoSQL injection prevention
- Custom validation schemas for all endpoints

### Security Headers & Protection
- Helmet.js for security headers
- CORS configuration for cross-origin requests
- Rate limiting to prevent abuse
- Custom CSRF protection implementation

### Data Protection
- Password hashing with salt rounds
- Sensitive data exclusion from API responses
- Environment variable protection
- MongoDB connection security

## 🌐 Production Deployment

### 🚀 Current Deployment Status
- **✅ Frontend**: Deployed on Vercel
- **✅ Backend**: Deployed on Railway
- **✅ Database**: MongoDB Atlas (Cloud)
- **✅ SSL**: HTTPS enabled on all services

### Build Commands

**Frontend:**
```bash
cd sea-catering
npm run build
npm start
```

> **Note**: The build is configured to handle ESLint warnings gracefully for production deployment while maintaining code quality checks during development.

**Backend:**
```bash
cd sea-catering-backend
npm start
```

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
