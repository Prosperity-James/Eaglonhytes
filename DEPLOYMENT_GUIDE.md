# Eaglonhytes Production Deployment Guide

## 🚀 Quick Start

This guide will help you deploy the Eaglonhytes real estate application to production.

---

## 📋 Pre-Deployment Checklist

### 1. Environment Setup

#### Backend (.env file)
Create `api/.env` file:
```env
# Database Configuration
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASS=your_strong_password_here
DB_NAME=eaglonhytes

# Application URLs
BASE_URL=https://yourdomain.com/api/
FRONTEND_URL=https://yourdomain.com

# Session Security
SESSION_SECURE=true
SESSION_SAMESITE=Strict

# Environment
APP_ENV=production
```

#### Frontend (.env file)
Create `frontend/.env.production`:
```env
# API Configuration
VITE_API_URL=https://yourdomain.com/api

# Environment
VITE_APP_ENV=production
```

### 2. Database Setup

```sql
-- Create database
CREATE DATABASE eaglonhytes CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create database user (replace with strong password)
CREATE USER 'eaglon_user'@'localhost' IDENTIFIED BY 'STRONG_PASSWORD_HERE';

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON eaglonhytes.* TO 'eaglon_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Security Hardening

#### PHP Configuration (php.ini or .htaccess)
```ini
# Disable error display
display_errors = Off
log_errors = On
error_log = /path/to/error_log.txt

# Session security
session.cookie_secure = On
session.cookie_httponly = On
session.cookie_samesite = Strict

# File upload limits
upload_max_filesize = 10M
post_max_size = 10M
```

#### Apache .htaccess (in api/ directory)
```apache
# Prevent directory listing
Options -Indexes

# Protect sensitive files
<FilesMatch "\.(env|log|sql|md)$">
    Order allow,deny
    Deny from all
</FilesMatch>

# Enable HTTPS redirect
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Security headers
Header set X-Content-Type-Options "nosniff"
Header set X-Frame-Options "SAMEORIGIN"
Header set X-XSS-Protection "1; mode=block"
Header set Referrer-Policy "strict-origin-when-cross-origin"
```

---

## 🔧 Deployment Steps

### Option 1: Shared Hosting (cPanel)

#### Step 1: Build Frontend
```bash
cd frontend
npm install
npm run build
```

#### Step 2: Upload Files
1. Upload `frontend/dist/*` to `public_html/`
2. Upload `api/*` to `public_html/api/`
3. Upload `assets/*` to `public_html/assets/`

#### Step 3: Configure Database
1. Create database via cPanel MySQL
2. Import database schema (run migrations)
3. Update `api/.env` with database credentials

#### Step 4: Set Permissions
```bash
chmod 755 api/
chmod 644 api/*.php
chmod 755 api/uploads/
chmod 755 api/uploads/lands/
chmod 755 api/uploads/profile_pictures/
```

#### Step 5: Install SSL
1. Use cPanel AutoSSL or Let's Encrypt
2. Force HTTPS in .htaccess
3. Update .env files with https:// URLs

### Option 2: VPS/Cloud Server

#### Step 1: Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install LAMP stack
sudo apt install apache2 mysql-server php php-mysqli php-json php-mbstring -y

# Enable Apache modules
sudo a2enmod rewrite
sudo a2enmod headers
sudo systemctl restart apache2
```

#### Step 2: Deploy Application
```bash
# Clone or upload files
cd /var/www/html
sudo mkdir eaglonhytes
cd eaglonhytes

# Upload files via SCP/FTP or git clone

# Set ownership
sudo chown -R www-data:www-data /var/www/html/eaglonhytes
```

#### Step 3: Configure Virtual Host
```apache
<VirtualHost *:80>
    ServerName yourdomain.com
    DocumentRoot /var/www/html/eaglonhytes
    
    <Directory /var/www/html/eaglonhytes>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    ErrorLog ${APACHE_LOG_DIR}/eaglonhytes_error.log
    CustomLog ${APACHE_LOG_DIR}/eaglonhytes_access.log combined
</VirtualHost>
```

#### Step 4: Install SSL with Let's Encrypt
```bash
sudo apt install certbot python3-certbot-apache -y
sudo certbot --apache -d yourdomain.com
```

---

## 🗄️ Database Migration

### Run Initial Setup
```bash
# Navigate to database directory
cd database

# Run schema creation
mysql -u your_user -p eaglonhytes < land_selling_database.sql
```

### Create Admin User
```sql
INSERT INTO users (full_name, email, password, is_admin, role, created_at) 
VALUES (
    'Admin User', 
    'admin@yourdomain.com', 
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: admin123
    1, 
    'super_admin', 
    NOW()
);
```

**⚠️ IMPORTANT:** Change the admin password immediately after first login!

---

## 🧪 Post-Deployment Testing

### 1. Basic Functionality
- [ ] Homepage loads correctly
- [ ] Login/Register works
- [ ] Land listings display
- [ ] Image uploads work
- [ ] Contact form submits

### 2. Admin Functions
- [ ] Admin dashboard accessible
- [ ] Can add/edit/delete lands
- [ ] Can approve/reject applications
- [ ] Can reply to messages
- [ ] User management works

### 3. Security Checks
- [ ] HTTPS is enforced
- [ ] Session cookies are secure
- [ ] File uploads are validated
- [ ] SQL injection protected
- [ ] XSS protection enabled

### 4. Performance
- [ ] Page load time < 3 seconds
- [ ] Images are optimized
- [ ] API responses < 1 second
- [ ] Database queries optimized

---

## 🔍 Troubleshooting

### Issue: "Database connection failed"
**Solution:** Check `.env` file credentials and database permissions

### Issue: "CORS error"
**Solution:** Update `FRONTEND_URL` in `api/.env` to match your domain

### Issue: "Session not persisting"
**Solution:** Ensure `SESSION_SECURE=true` and site uses HTTPS

### Issue: "Images not uploading"
**Solution:** Check directory permissions (755 for folders, 644 for files)

### Issue: "404 errors on routes"
**Solution:** Enable Apache `mod_rewrite` and check `.htaccess`

---

## 📊 Monitoring & Maintenance

### Log Files
- **PHP Errors:** `api/error_log.txt`
- **Apache Errors:** `/var/log/apache2/error.log`
- **Access Logs:** `/var/log/apache2/access.log`

### Regular Tasks
- **Daily:** Check error logs
- **Weekly:** Database backup
- **Monthly:** Update dependencies
- **Quarterly:** Security audit

### Backup Strategy
```bash
# Database backup
mysqldump -u user -p eaglonhytes > backup_$(date +%Y%m%d).sql

# File backup
tar -czf backup_files_$(date +%Y%m%d).tar.gz /var/www/html/eaglonhytes
```

---

## 🆘 Support

### Common Commands
```bash
# Restart Apache
sudo systemctl restart apache2

# Check PHP errors
tail -f api/error_log.txt

# Check Apache errors
tail -f /var/log/apache2/error.log

# Test database connection
mysql -u user -p eaglonhytes
```

### Environment Variables Reference
| Variable | Development | Production |
|----------|-------------|------------|
| `APP_ENV` | development | production |
| `SESSION_SECURE` | false | true |
| `SESSION_SAMESITE` | Lax | Strict |
| `DB_HOST` | localhost | production_host |

---

## ✅ Production Checklist

- [ ] `.env` files created and configured
- [ ] Database created with strong password
- [ ] SSL certificate installed
- [ ] HTTPS enforced
- [ ] Error logging enabled
- [ ] File permissions set correctly
- [ ] Admin user created
- [ ] Default password changed
- [ ] Backup system configured
- [ ] Monitoring setup
- [ ] Test all features
- [ ] Security audit completed

---

## 🎉 You're Ready!

Your Eaglonhytes application is now production-ready. Remember to:
1. Monitor logs regularly
2. Keep backups updated
3. Update dependencies
4. Review security periodically

For issues or questions, check the troubleshooting section or review the error logs.
