# Setup Guide - Fixing Common Errors

## Common Errors and Solutions

### 1. Missing TypeScript Types
If you see errors about missing types for `js-cookie`:
```bash
cd frontend
npm install --save-dev @types/js-cookie
```

### 2. Missing Dependencies
Install all dependencies:
```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### 3. Environment Variables
Create `.env` files:

**Backend** (`backend/.env`):
```
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=wearcart
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_key_here
FRONTEND_URL=http://localhost:3000
```

**Frontend** (`frontend/.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 4. Database Connection
Make sure PostgreSQL is running and database exists:
```sql
CREATE DATABASE wearcart;
```

### 5. Port Already in Use
If port 5000 or 3000 is already in use:
- Change PORT in backend/.env
- Change port in frontend: `npm run dev -- -p 3001`

### 6. Module Not Found Errors
Clear node_modules and reinstall:
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json .next
npm install
```

### 7. TypeScript Errors
If you see TypeScript errors, make sure all type definitions are installed:
```bash
cd frontend
npm install --save-dev @types/node @types/react @types/react-dom @types/js-cookie
```

### 8. Image Loading Issues
Make sure logo files exist in `public/images/`:
- `public/images/logo.png`
- `public/favicon.ico`

If missing, run the logo extraction script again or manually add the images.

## Quick Start Commands

```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

## Troubleshooting

1. **"Cannot find module" errors**: Run `npm install` in the respective directory
2. **Database connection errors**: Check PostgreSQL is running and credentials are correct
3. **CORS errors**: Ensure FRONTEND_URL in backend/.env matches your frontend URL
4. **JWT errors**: Make sure JWT_SECRET is set in backend/.env

