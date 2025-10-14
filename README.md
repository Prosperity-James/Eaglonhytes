# Eaglonhytes Real Estate Application

   

## 🌟 Features

### For Customers
- 🏡 Browse available land properties
- 📝 Submit property applications
- 💬 Contact admin via messaging system
- 🔔 Real-time notifications
- 📱 Fully responsive mobile design
- 👤 User profile management

### For Administrators
- 📊 Comprehensive admin dashboard
- 🏗️ Land property management (CRUD)
- ✅ Application approval/rejection workflow
- 💼 User management with role-based access
- 📧 Message reply system
- 📈 Analytics and reporting
- 🖼️ Secure image upload system
- 🎨 **Content Management System**
  - Edit website story content
  - Manage homepage carousel (5+ images)
  - Drag & drop image uploads
  - Real-time content updates

### Security Features
- 🔐 Secure authentication with sessions
- 🛡️ Role-based access control (User, Admin, Super Admin)
- 🔒 CSRF protection
- 📁 Secure file uploads with MIME validation
- 🚫 SQL injection prevention
- 🌐 CORS configuration
- 🔑 Password hashing (bcrypt)

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 18
- **Routing:** React Router v6
- **Styling:** Tailwind CSS
- **Icons:** Heroicons
- **Build Tool:** Vite
- **State Management:** React Hooks & Context API

### Backend
- **Language:** PHP 7.4+
- **Database:** MySQL 5.7+ / MariaDB 10.2+
- **Session Management:** PHP Sessions
- **API Architecture:** RESTful API

## 📋 Requirements

### Development
- Node.js 16+
- PHP 7.4+
- MySQL 5.7+ or MariaDB 10.2+
- XAMPP / WAMP / MAMP (for local development)
- **Database:** Create database named `eaglonhytes`

### Production
- PHP 7.4+ with extensions: mysqli, json, fileinfo, session
- MySQL 5.7+ or MariaDB 10.2+
- Apache/Nginx web server
- SSL Certificate (Let's Encrypt recommended)

## 🚀 Quick Start

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Eaglonhytes
   ```

2. **Setup Backend**
   ```bash
   cd api
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Setup Database**
   
   **Main Database Name:** `eaglonhytes`
   
   ```sql
   CREATE DATABASE eaglonhytes;
   ```
   Import main schema:
   mysql -u root -p eaglonhytes < database/land_selling_database.sql
   ```
   
   **For Content Management (Optional):**
   ```bash
   # Add content management tables for story and carousel
   mysql -u root -p eaglonhytes < database/add_content_management_tables.sql
   ```
   Or visit: `http://localhost/Eaglonhytes/setup_tables.php`
   
   **⚠️ Important:** All SQL commands and imports must use the database name `eaglonhytes`

### Database Troubleshooting

**Common Issues:**
- **Wrong database name:** Ensure you're using `eaglonhytes` (not `eaglonhytes_db` or similar)
- **Connection failed:** Check your MySQL credentials in `api/.env`
- **Tables missing:** Run the database import scripts in order
- **Permission denied:** Ensure MySQL user has full privileges on `eaglonhytes` database

**Quick Database Check:**
```sql
USE eaglonhytes;
SHOW TABLES;
```
Should show: `users`, `lands`, `land_applications`, `story_content`, `carousel_images`, etc.

4. **Setup Frontend**
   ```bash
   cd frontend
   cp .env.example .env
   npm install
   npm run dev
   ```

5. **Access Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost/Eaglonhytes/api
   - Setup Check: http://localhost/Eaglonhytes/api/setup_production.php

### Default Admin Credentials

#### Super Admin Account
- **Email:** admin@eaglonhytes.com
- **Password:** admin123
- **Access Level:** Full system access (users, lands, applications, content management, reports, settings)

#### Admin Account  
- **Email:** iam111@gmail.com
- **Password:** lisa123
- **Access Level:** Limited admin access (lands, applications, content management, messages)

**⚠️ IMPORTANT: Change these passwords immediately after first login for security!**

### Content Management Access
Both admin accounts can access the **Content Management** section to:
- Edit story content (Our Journey section)
- Upload and manage carousel images (5+ images supported)
- Drag & drop image uploads
- Real-time content updates

## 📚 Documentation

- **[Setup Instructions](SETUP_INSTRUCTIONS.md)** - Detailed development setup
- **[Deployment Guide](DEPLOYMENT_GUIDE.md)** - Production deployment steps
- **[Testing Guide](TESTING_GUIDE.md)** - Testing procedures
- **[Changelog](CHANGELOG.md)** - Version history

## 🏗️ Project Structure

```
Eaglonhytes/
├── api/                          # Backend PHP API
│   ├── config.php               # Configuration loader
│   ├── env_config.php           # Environment configuration
│   ├── cors_headers.php         # CORS configuration
│   ├── session_config.php       # Session security
│   ├── *.php                    # API endpoints
│   └── uploads/                 # Uploaded files
├── frontend/                     # React frontend
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   ├── context/             # React Context
│   │   ├── hooks/               # Custom hooks
│   │   ├── pages/               # Page components
│   │   ├── utils/               # Utilities
│   │   └── config/              # Configuration
│   ├── public/                  # Static assets
│   └── package.json
├── database/                     # Database schemas
├── assets/                       # Application assets
├── .gitignore                   # Git ignore rules
└── README.md                    # This file
```

## 🔐 Security Best Practices

### Development
- Use `.env` files for sensitive data
- Never commit `.env` files to version control
- Keep dependencies updated
- Use strong passwords

### Production
- Enable HTTPS (SSL/TLS)
- Set `APP_ENV=production` in `.env`
- Set `SESSION_SECURE=true`
- Disable error display (`display_errors=Off`)
- Use strong database passwords
- Regular security audits
- Keep backups updated

## 🧪 Testing

Run the setup check:
```bash
# Visit in browser
http://localhost/Eaglonhytes/api/setup_production.php
```

This checks:
- Database connection (to `eaglonhytes` database)
- Required tables
- Upload directories
- PHP extensions
- Admin users
- Security configuration

## 📦 Building for Production

### Frontend Build
```bash
cd frontend
npm run build
```

Output will be in `frontend/dist/`

### Backend Deployment
1. Upload `api/` folder to server
2. Create `.env` file with production settings
3. Set proper file permissions
4. Configure web server (Apache/Nginx)
5. Install SSL certificate

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is proprietary software. All rights reserved.

## 👥 Team

- **Development:** Eaglonhytes Development Team
- **Design:** UI/UX Team
- **Support:** support@eaglonhytes.com

## 🐛 Bug Reports

Report bugs by creating an issue in the repository or contact support@eaglonhytes.com

## 📞 Support

- **Email:** support@eaglonhytes.com
- **WhatsApp:** +2347038779189
- **Documentation:** See docs folder

## 🎉 Acknowledgments

- React Team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Heroicons for the beautiful icon set
- All contributors and testers

---

**Version:** 1.1.0  
**Last Updated:** 2025-10-02  
**Status:** Production Ready ✅  
**Latest Features:** Content Management System, Drag & Drop Uploads, 5+ Carousel Images
"# Eaglonhytes" 
