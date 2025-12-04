/**
 * Database Backup Utility for Connecta
 *
 * This script handles automated backups of the NeonDB database
 * Run manually or set up as a cron job
 */

import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL || process.env.VITE_DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL not configured');
}

const sql = neon(DATABASE_URL);

/**
 * Export all users to JSON
 */
export async function backupUsers() {
  try {
    const users = await sql`SELECT * FROM users ORDER BY created_at DESC`;
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `backup_users_${timestamp}.json`;

    console.log(`Backing up ${users.length} users to ${filename}`);

    // In production, save to cloud storage (S3, Google Cloud Storage)
    // For now, return the data
    return {
      filename,
      data: users,
      count: users.length,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('User backup failed:', error);
    throw error;
  }
}

/**
 * Export all bookings to JSON
 */
export async function backupBookings() {
  try {
    const bookings = await sql`SELECT * FROM bookings ORDER BY created_at DESC`;
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `backup_bookings_${timestamp}.json`;

    console.log(`Backing up ${bookings.length} bookings to ${filename}`);

    return {
      filename,
      data: bookings,
      count: bookings.length,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Booking backup failed:', error);
    throw error;
  }
}

/**
 * Full database backup
 */
export async function fullBackup() {
  try {
    console.log('Starting full database backup...');

    const [users, bookings] = await Promise.all([
      backupUsers(),
      backupBookings(),
    ]);

    const timestamp = new Date().toISOString().split('T')[0];
    const fullBackup = {
      timestamp: new Date().toISOString(),
      database: 'connecta_production',
      tables: {
        users: users.data,
        bookings: bookings.data,
      },
      stats: {
        total_users: users.count,
        total_bookings: bookings.count,
      },
    };

    console.log('Full backup completed successfully');
    console.log(`Users: ${users.count}, Bookings: ${bookings.count}`);

    return fullBackup;
  } catch (error) {
    console.error('Full backup failed:', error);
    throw error;
  }
}

/**
 * Verify database integrity
 */
export async function verifyDatabase() {
  try {
    console.log('Verifying database integrity...');

    // Check users table
    const userCount = await sql`SELECT COUNT(*) as count FROM users`;
    console.log(`✓ Users table: ${userCount[0].count} records`);

    // Check bookings table
    const bookingCount = await sql`SELECT COUNT(*) as count FROM bookings`;
    console.log(`✓ Bookings table: ${bookingCount[0].count} records`);

    // Check for orphaned bookings (bookings without users)
    const orphanedBookings = await sql`
      SELECT COUNT(*) as count
      FROM bookings b
      LEFT JOIN users u ON b.user_id = u.id
      WHERE u.id IS NULL
    `;

    if (orphanedBookings[0].count > 0) {
      console.warn(`⚠ Found ${orphanedBookings[0].count} orphaned bookings`);
    } else {
      console.log('✓ No orphaned bookings found');
    }

    // Check for recent activity
    const recentBookings = await sql`
      SELECT COUNT(*) as count
      FROM bookings
      WHERE created_at > NOW() - INTERVAL '7 days'
    `;
    console.log(`✓ Bookings in last 7 days: ${recentBookings[0].count}`);

    return {
      healthy: true,
      users: userCount[0].count,
      bookings: bookingCount[0].count,
      orphaned: orphanedBookings[0].count,
      recent_bookings: recentBookings[0].count,
    };
  } catch (error) {
    console.error('Database verification failed:', error);
    return {
      healthy: false,
      error: error.message,
    };
  }
}

/**
 * Restore from backup (use with caution!)
 */
export async function restoreFromBackup(backupData: any) {
  console.warn('⚠️  RESTORE OPERATION - USE WITH CAUTION');
  console.log('This will overwrite existing data!');

  // In production, implement proper restore logic with confirmations
  throw new Error('Restore not implemented - manual restore required for safety');
}

// CLI usage
if (require.main === module) {
  const command = process.argv[2];

  switch (command) {
    case 'backup':
      fullBackup()
        .then(() => console.log('Backup completed'))
        .catch(err => console.error('Backup failed:', err));
      break;

    case 'verify':
      verifyDatabase()
        .then(result => console.log('Verification result:', result))
        .catch(err => console.error('Verification failed:', err));
      break;

    default:
      console.log('Usage: node database-backup.js [backup|verify]');
  }
}
