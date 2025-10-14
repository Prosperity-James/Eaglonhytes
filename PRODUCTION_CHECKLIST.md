# 🚀 Eaglonhytes Production Deployment Checklist

Use this checklist to ensure everything is configured correctly before going live.

---

## 📋 Pre-Deployment Tasks

### Environment Configuration
- [ ] Created `api/.env` from `.env.example`
- [ ] Set `APP_ENV=production` in `api/.env`
- [ ] Set strong database password in `api/.env`
- [ ] Updated `BASE_URL` to production domain (https://)
- [ ] Updated `FRONTEND_URL` to production domain (https://)
- [ ] Set `SESSION_SECURE=true` in `api/.env`
- [ ] Set `SESSION_SAMESITE=Strict` in `api/.env`
- [ ] Created `frontend/.env.production`
- [ ] Set `VITE_API_URL` to production API URL
- [ ] Set `VITE_APP_ENV=production`

### Database Setup
- [ ] Created production database
- [ ] Created database user with limited permissions
- [ ] Set strong database password
- [ ] Imported database schema (`land_selling_database.sql`)
- [ ] Created admin user
- [ ] Changed default admin password
- [ ] Verified all tables exist
- [ ] Tested database connection

### Security Configuration
- [ ] Obtained SSL certificate (Let's Encrypt)
- [ ] Configured HTTPS redirect
- [ ] Verified `display_errors=Off` in php.ini
- [ ] Enabled error logging
- [ ] Set proper file permissions (755 for dirs, 644 for files)
- [ ] Created upload directories with correct permissions
- [ ] Verified `.htaccess` files are in place
- [ ] Tested session security
- [ ] Verified CORS configuration

### Code Preparation
- [ ] Removed all test files (`test_*.php`, `test_*.html`)
- [ ] Removed debug console.log statements
- [ ] Verified no hardcoded localhost URLs remain
- [ ] Built frontend (`npm run build`)
- [ ] Tested production build locally
- [ ] Verified all API endpoints work
- [ ] Checked for PHP errors in logs

---

## 🔍 Deployment Verification

### After Upload
- [ ] Ran `setup_production.php` to verify setup
- [ ] All checks passed (green checkmarks)
- [ ] Deleted `setup_production.php` file
- [ ] Tested homepage loads
- [ ] Tested HTTPS redirect works
- [ ] Verified SSL certificate is valid

### Functionality Testing
- [ ] User registration works
- [ ] User login works
- [ ] Password reset works (if implemented)
- [ ] Land listings display correctly
- [ ] Images load properly
- [ ] Land detail pages work
- [ ] Application submission works
- [ ] Contact form works
- [ ] WhatsApp integration works

### Admin Testing
- [ ] Admin login works
- [ ] Admin dashboard loads
- [ ] Can add new lands
- [ ] Can edit existing lands
- [ ] Can delete lands
- [ ] Can upload images
- [ ] Can approve applications
- [ ] Can reject applications
- [ ] Can reply to messages
- [ ] User management works (Super Admin)
- [ ] Notifications display correctly

### Security Testing
- [ ] HTTPS is enforced
- [ ] Session cookies are secure
- [ ] Cannot access `.env` file via browser
- [ ] Cannot access config files via browser
- [ ] Cannot execute PHP in uploads directory
- [ ] SQL injection tests pass
- [ ] XSS protection works
- [ ] File upload validation works

### Performance Testing
- [ ] Homepage loads in < 3 seconds
- [ ] API responses in < 1 second
- [ ] Images are optimized
- [ ] No console errors
- [ ] No network errors
- [ ] Mobile performance is good

### Mobile Testing
- [ ] Tested on iPhone/iOS
- [ ] Tested on Android
- [ ] Tested on tablet
- [ ] Navigation works on mobile
- [ ] Forms work on mobile
- [ ] Images display correctly
- [ ] Touch interactions work

---

## 🗄️ Backup Setup

- [ ] Configured automatic database backups
- [ ] Configured file backups
- [ ] Tested backup restoration
- [ ] Documented backup procedure
- [ ] Set backup retention policy

### Backup Commands
```bash
# Database backup
mysqldump -u user -p eaglonhytes > backup_$(date +%Y%m%d).sql

# File backup
tar -czf backup_files_$(date +%Y%m%d).tar.gz /path/to/eaglonhytes
```

---

## 📊 Monitoring Setup

- [ ] Configured error logging
- [ ] Set up log rotation
- [ ] Configured uptime monitoring
- [ ] Set up email alerts for errors
- [ ] Configured analytics (optional)
- [ ] Set up performance monitoring

### Log Locations
- PHP Errors: `api/error_log.txt`
- Apache Errors: `/var/log/apache2/error.log`
- Access Logs: `/var/log/apache2/access.log`

---

## 📝 Post-Deployment Tasks

### Immediate (Day 1)
- [ ] Monitor error logs for issues
- [ ] Test all critical features
- [ ] Verify email notifications work
- [ ] Check database connections
- [ ] Monitor server resources

### Week 1
- [ ] Review error logs daily
- [ ] Monitor user registrations
- [ ] Check application submissions
- [ ] Verify backup system
- [ ] Test recovery procedures

### Month 1
- [ ] Review security logs
- [ ] Update dependencies
- [ ] Performance optimization
- [ ] User feedback review
- [ ] Feature enhancement planning

---

## 🆘 Emergency Contacts

### Technical Issues
- **Server Admin:** [Your contact]
- **Database Admin:** [Your contact]
- **Developer:** [Your contact]

### Service Providers
- **Hosting:** [Provider name & support]
- **Domain:** [Registrar & support]
- **SSL:** [Certificate provider]

---

## 📞 Support Information

### For Users
- **Email:** support@eaglonhytes.com
- **WhatsApp:** +2347038779189
- **Hours:** Monday-Friday, 9AM-5PM WAT

### For Admins
- **Documentation:** See `/docs` folder
- **API Docs:** See `API_DOCUMENTATION.md`
- **Troubleshooting:** See `DEPLOYMENT_GUIDE.md`

---

## ✅ Final Verification

Before marking as complete:

1. **All checkboxes above are checked** ✓
2. **No errors in logs** ✓
3. **All features tested** ✓
4. **Security verified** ✓
5. **Backups configured** ✓
6. **Monitoring active** ✓

---

## 🎉 Deployment Complete!

Once all items are checked:

1. Mark deployment date: _______________
2. Document any issues encountered
3. Share access credentials with team
4. Schedule first maintenance window
5. Celebrate! 🎊

---

**Deployed By:** _______________  
**Date:** _______________  
**Version:** 1.0.0  
**Status:** ✅ Live in Production
