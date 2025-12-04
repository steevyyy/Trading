# Connecta Admin System

## Overview
Admin tools for managing drivers, users, bookings, and system operations.

## Structure

```
admin/
├── pages/
│   ├── AdminDashboard.tsx       # Main admin dashboard
│   └── DriverOnboardingPage.tsx # Driver recruitment page
├── components/
│   └── DriverOnboardingForm.tsx # Driver application form
├── lib/
│   └── database-backup.ts       # Backup utilities
├── DRIVER_RECRUITMENT_STRATEGY.md
├── DATABASE_BACKUP_GUIDE.md
└── README.md
```

## Features Completed

### 1. Driver Onboarding Form ✅
- Multi-step form (4 steps)
- Personal information collection
- License verification
- Vehicle details
- Document upload
- **Location**: `admin/components/DriverOnboardingForm.tsx`

### 2. Driver Recruitment Strategy ✅
- 6-month recruitment plan
- Target: 500 drivers
- Budget: KSh 575K-1.3M
- Marketing channels defined
- KPIs and metrics
- **Location**: `admin/DRIVER_RECRUITMENT_STRATEGY.md`

### 3. Database Backup System ✅
- Automated backup script
- Manual backup option
- Database verification
- Restore procedures
- **Location**: `admin/lib/database-backup.ts`

### 4. Admin Dashboard ✅
- Real-time statistics
- User/driver metrics
- Revenue tracking
- Recent bookings view
- Quick actions
- **Location**: `admin/pages/AdminDashboard.tsx`

## Quick Start

### Access Driver Onboarding
```bash
# Run the app
npm run dev

# Navigate to driver onboarding
# Create route in main app or access directly
```

### Run Database Backup
```bash
cd admin/lib
node database-backup.js backup
```

### View Admin Dashboard
```bash
# Import and add route in main App.tsx
import AdminDashboard from './admin/pages/AdminDashboard'
```

## Integration Steps

### 1. Add Driver Onboarding Route
```typescript
// In App.tsx
import DriverOnboardingPage from './admin/pages/DriverOnboardingPage';

// Add route
case 'DriverOnboarding':
  return <DriverOnboardingPage />;
```

### 2. Add Admin Dashboard Route
```typescript
// In App.tsx
import AdminDashboard from './admin/pages/AdminDashboard';

// Add protected admin route
case 'Admin':
  return <ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>;
```

### 3. Setup Database Backups
```bash
# Test backup
cd admin/lib
node database-backup.js backup

# Schedule with cron
crontab -e
# Add: 0 2 * * * cd /path/to/admin/lib && node database-backup.js backup
```

## Next Steps

### Immediate (This Week):
1. Add driver onboarding link to website
2. Test backup script
3. Create admin user authentication
4. Deploy driver onboarding page

### Short-term (This Month):
1. Implement driver verification workflow
2. Add email notifications
3. Create driver management panel
4. Set up automated backups

### Long-term (Next 3 Months):
1. Build driver mobile app
2. Implement real-time tracking
3. Add analytics dashboard
4. Create reporting system

## API Endpoints Needed

### Driver Management:
- POST /api/drivers/apply - Submit driver application
- GET /api/drivers - List all drivers
- PUT /api/drivers/:id/verify - Verify driver
- DELETE /api/drivers/:id - Remove driver

### Admin:
- GET /api/admin/stats - Dashboard statistics
- GET /api/admin/bookings - Recent bookings
- GET /api/admin/users - User list
- POST /api/admin/backup - Trigger backup

## Security Notes

- Admin routes must be protected
- Driver documents should be encrypted
- Backup files should be secured
- API endpoints need authentication
- Sensitive data must be masked

## Cost Summary

**Current Setup**: $0/month (all free)

**When Scaling**:
- Database backups: $0-19/month
- Cloud storage: $1-5/month
- Admin hosting: $0-20/month

## Support

**Questions?**
- Email: admin@connecta.co.ke
- Phone: +254 712 345 678

## Documentation

- Driver Recruitment: `DRIVER_RECRUITMENT_STRATEGY.md`
- Database Backups: `DATABASE_BACKUP_GUIDE.md`
- Main App: `../README.md`
