# Database Backup Setup Guide

## Overview
Automated backup system for Connecta NeonDB database.

## Backup Strategy

### 1. NeonDB Built-in Backups (Recommended)
- Automatic daily backups
- Point-in-time recovery
- 7-day retention (free tier)
- 30-day retention (Pro plan)

**Setup**:
1. Go to NeonDB Console
2. Select your project
3. Enable automatic backups
4. Set retention period

**Cost**: $19/month (Pro plan)

### 2. Manual Backup Script (Free)

Run backup:
```bash
cd admin/lib
node database-backup.js backup
```

Schedule with cron (Linux/Mac):
```bash
0 2 * * * cd /path/to/admin/lib && node database-backup.js backup
```

### 3. Verification

Check database health:
```bash
node database-backup.js verify
```

## Disaster Recovery

1. Stop write operations
2. Restore from latest backup
3. Verify data integrity
4. Resume operations

## Best Practices

- Test restores monthly
- Keep multiple backup copies
- Store backups in different locations
- Monitor backup success
- Automate everything

## Quick Commands

```bash
# Backup
npm run backup

# Verify
npm run verify-db

# List backups
ls -lh admin/backups/
```

## Next Steps

1. Choose backup method
2. Set up automated backups
3. Test restore procedure
4. Set up monitoring alerts
