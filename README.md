# 🍽️ SEA Catering - Smart Meal Subscription Platform

SEA Catering is a modern, full-stack meal subscription platform that connects customers with premium catering services. Built with Next.js 15 and Node.js, it offers a secure, scalable solution for meal plan subscriptions with comprehensive user and admin dashboards.

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

### 🎨 Design Features
- **Modern UI**: Clean, responsive design with Tailwind CSS
- **Consistent Branding**: Green color palette throughout
- **Mobile-First**: Responsive design for all devices
- **Accessibility**: Screen reader friendly components
- **Loading States**: Smooth user experience with loading indicators

## 🏗️ Tech Stack

### Frontend
- **Next.js 15**: App Router with file-based routing
- **React 19**: Latest React features and hooks
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **React Hook Form**: Form handling and validation

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database with Mongoose ODM
- **JWT**: Authentication tokens
- **bcrypt**: Password hashing
- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Express Rate Limit**: Request throttling

### Security Stack
- **express-validator**: Input validation
- **mongo-sanitize**: NoSQL injection prevention
- **DOMPurify**: XSS protection
- **express-mongo-sanitize**: Additional MongoDB protection
- **Custom CSRF**: Cross-site request forgery protection

## 🚀 Quick Start

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
   
   Create `.env` file in `sea-catering-backend/`:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/sea-catering
   
   # Server
   PORT=5000
   NODE_ENV=development
   
   # JWT Secret (Generate a strong secret for production!)
   JWT_SECRET=your-super-secret-jwt-key-here
   
   # CORS Settings
   FRONTEND_URL=http://localhost:3002
   ```

   Create `.env.local` file in `sea-catering/`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
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
   - Frontend: http://localhost:3002
   - Backend API: http://localhost:5000

## 📊 Sample Data & Testing

### Generate Test Data
Create sample users, admins, and subscriptions:

```bash
cd sea-catering-backend
node create-test-data.js
```

This creates:
- **Sample Users**: test1@example.com to test5@example.com (password: password123)
- **Admin Account**: admin@seacatering.com (password: admin123)
- **Sample Subscriptions**: Various meal plans with different statuses
- **Realistic Data**: Subscription dates spanning recent months for analytics

### Test Accounts

**Regular User Account:**
- Email: test1@example.com
- Password: password123
- Access: User dashboard, subscription management

**Admin Account:**
- Email: admin@seacatering.com
- Password: admin123
- Access: Admin dashboard, business analytics

### Testing Guide

1. **User Dashboard Testing**:
   - Login with test1@example.com
   - Navigate to Dashboard
   - Test subscription pause/cancel/reactivate
   - Verify subscription history

2. **Admin Dashboard Testing**:
   - Login with admin@seacatering.com
   - Navigate to Admin Dashboard
   - Test date range filtering
   - Verify analytics data display

3. **Security Testing**:
   - Try accessing admin routes as regular user
   - Test rate limiting by rapid requests
   - Verify CSRF protection on forms

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

### Environment Variables
Set these in production:

```env
# Backend
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sea-catering
NODE_ENV=production
JWT_SECRET=your-super-secure-production-jwt-secret
FRONTEND_URL=https://your-domain.com

# Frontend
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

### Build Commands

**Frontend:**
```bash
cd sea-catering
npm run build
npm start
```

**Backend:**
```bash
cd sea-catering-backend
npm start
```

### Deployment Checklist
- [ ] Update MONGODB_URI for production database
- [ ] Generate strong JWT_SECRET
- [ ] Configure CORS for production domain
- [ ] Set up SSL certificates
- [ ] Configure reverse proxy (nginx)
- [ ] Set up monitoring and logging
- [ ] Enable database backups

## 🔄 Future Enhancements

### Planned Features
- **Payment Integration**: Stripe/PayPal for subscription billing
- **Email Notifications**: Subscription updates and reminders
- **Advanced Analytics**: Customer lifetime value, churn analysis
- **Mobile App**: React Native companion app
- **Inventory Management**: Real-time ingredient tracking
- **Multi-tenant**: Support for multiple catering companies

### Technical Improvements
- **Testing Suite**: Unit and integration tests
- **Performance**: Caching with Redis
- **Monitoring**: Application performance monitoring
- **Logging**: Structured logging with Winston
- **Documentation**: API documentation with Swagger
- **CI/CD**: Automated deployment pipeline

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check existing documentation
- Review the testing guide above

## 🏆 Acknowledgments

- Built for COMPFEST SEA Challenge
- Modern web development best practices
- Security-first development approach
- User-centered design principles

---

**SEA Catering** - Bringing premium meal subscriptions to the digital age 🍽️✨