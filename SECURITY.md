# SEA Catering Project

## Environment Setup

### Backend Environment Variables

1. **Copy the environment template:**
   ```bash
   cd sea-catering-backend
   cp .env.example .env
   ```

2. **Update the `.env` file with your settings:**
   - For development: Use the default localhost MongoDB URI
   - For production: Replace with your actual MongoDB Atlas URI
   - **⚠️ NEVER commit the `.env` file to git!**

### Security Best Practices

- ✅ The `.env` file is ignored by git
- ✅ Use `.env.example` as a template
- ✅ Store real secrets in environment variables or secure secret management
- ❌ Never commit real API keys, passwords, or connection strings

### Local Development

```bash
# Frontend
cd sea-catering
npm install
npm run dev

# Backend
cd sea-catering-backend
npm install
npm run dev
```

## Production Deployment

For production deployments:

1. Set environment variables directly on your hosting platform
2. Use services like:
   - **Vercel**: Environment Variables section
   - **Heroku**: Config Vars
   - **Railway**: Environment Variables
   - **AWS/Azure/GCP**: Secret Manager

3. **Never** use the `.env` file in production

## MongoDB Atlas Setup

If using MongoDB Atlas:

1. Create a cluster at [mongodb.com](https://www.mongodb.com/cloud/atlas)
2. Get your connection string
3. Replace `<username>`, `<password>`, and `<cluster>` with real values
4. Set `MONGODB_URI` in your production environment variables

Example production URI:
```
mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/sea-catering
```
