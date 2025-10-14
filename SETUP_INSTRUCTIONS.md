# Eaglonhytes Setup Instructions

## 🎯 Quick Setup for Development

### 1. Create Environment Files

#### Backend Environment
Copy the example file and configure:
```bash
cd api
cp .env.example .env
```

Edit `api/.env`:
```env
DB_HOST=127.0.0.1
DB_USER=root
DB_PASS=
DB_NAME=eaglonhytes
BASE_URL=http://localhost/Eaglonhytes/
FRONTEND_URL=http://localhost:5173
SESSION_SECURE=false
SESSION_SAMESITE=Lax
APP_ENV=development
```

#### Frontend Environment
```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost/Eaglonhytes/api
VITE_APP_ENV=development
```

### 2. Database Setup

Create database in phpMyAdmin or MySQL:
```sql
CREATE DATABASE eaglonhytes CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Import the schema:
```bash
mysql -u root -p eaglonhytes < database/land_selling_database.sql
```

### 3. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 4. Start Development

#### Start Frontend (Vite)
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

#### Start Backend (XAMPP)
1. Start Apache and MySQL in XAMPP Control Panel
2. Backend API available at `http://localhost/Eaglonhytes/api`

### 5. Test the Setup

Visit: `http://localhost/Eaglonhytes/api/setup_production.php`

This will check:
- Database connection
- Required tables
- Upload directories
- PHP extensions
- Admin users

### 6. Default Login Credentials

**Admin Account:**
- Email: `admin@eaglonhytes.com`
- Password: `admin123`

**⚠️ Change this password immediately after first login!**

---

## 🔧 Troubleshooting

### Issue: "Database connection failed"
- Check XAMPP MySQL is running
- Verify database name in `.env`
- Ensure database exists

### Issue: "CORS error"
- Check `FRONTEND_URL` in `api/.env` matches your Vite dev server
- Verify `VITE_API_URL` in `frontend/.env` is correct

### Issue: "Module not found"
- Run `npm install` in frontend directory
- Clear node_modules and reinstall if needed

### Issue: "Upload directory not writable"
- Check folder permissions
- On Windows: Right-click folder → Properties → Security
- On Linux: `chmod 755 api/uploads`

---

## 📁 Project Structure

```
Eaglonhytes/
├── api/                    # Backend PHP API
│   ├── .env               # Environment config (create from .env.example)
│   ├── config.php         # Main configuration
│   ├── env_config.php     # Environment loader
│   ├── *.php              # API endpoints
│   └── uploads/           # Uploaded files
├── frontend/              # React frontend
│   ├── .env               # Frontend config (create from .env.example)
│   ├── src/               # Source code
│   ├── public/            # Static assets
│   └── package.json       # Dependencies
├── database/              # Database schemas
├── .gitignore             # Git ignore rules
├── DEPLOYMENT_GUIDE.md    # Production deployment
└── SETUP_INSTRUCTIONS.md  # This file
```

---

## ✅ Setup Checklist

- [ ] Created `api/.env` from `.env.example`
- [ ] Created `frontend/.env` from `.env.example`
- [ ] Created database `eaglonhytes`
- [ ] Imported database schema
- [ ] Installed frontend dependencies (`npm install`)
- [ ] Started XAMPP (Apache + MySQL)
- [ ] Started Vite dev server (`npm run dev`)
- [ ] Tested setup at `/api/setup_production.php`
- [ ] Logged in with default credentials
- [ ] Changed default admin password

---

## 🚀 Ready for Production?

See `DEPLOYMENT_GUIDE.md` for complete production deployment instructions.

---

## 📞 Need Help?

Check the troubleshooting section above or review error logs:
- PHP errors: `api/error_log.txt`
- Browser console: F12 → Console tab
- Network requests: F12 → Network tab
