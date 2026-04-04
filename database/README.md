# IBMP Platform - Database Setup

Production-ready PostgreSQL database setup for the IBMP Medical Education Platform.

## Prerequisites

- PostgreSQL 14 or higher
- psql command-line tool
- Superuser access to PostgreSQL

## Quick Setup

### 1. Connect to PostgreSQL as superuser

```bash
psql -U postgres
```

### 2. Run the setup scripts in order

```bash
# Create database and user
psql -U postgres -f 001_create_database.sql

# Create schema (connect to ibmp_production first)
psql -U postgres -d ibmp_production -f 002_create_schema.sql

# Create foreign keys
psql -U postgres -d ibmp_production -f 003_create_foreign_keys.sql
```

### 3. Or run all at once

```bash
psql -U postgres -f 001_create_database.sql && \
psql -U postgres -d ibmp_production -f 002_create_schema.sql && \
psql -U postgres -d ibmp_production -f 003_create_foreign_keys.sql
```

## File Structure

| File | Description |
|------|-------------|
| `001_create_database.sql` | Creates database, user, and grants permissions |
| `002_create_schema.sql` | Creates all tables with indexes |
| `003_create_foreign_keys.sql` | Adds foreign key constraints |

## Configuration

### Update credentials in `001_create_database.sql`:

```sql
-- Change this line with your secure password
CREATE USER ibmp_app WITH ENCRYPTED PASSWORD 'your_secure_password_here';
```

### Environment variable for the application:

```bash
DATABASE_URL="postgresql://ibmp_app:your_secure_password_here@localhost:5432/ibmp_production?schema=public"
```

## Database Schema Overview

### Core Tables

| Table | Description |
|-------|-------------|
| `User` | User accounts with medical profiles |
| `Course` | Educational courses |
| `Module` | Course modules |
| `Lesson` | Individual lessons within modules |
| `Enrollment` | User course enrollments |
| `LessonProgress` | Learning progress tracking |

### Gamification Tables

| Table | Description |
|-------|-------------|
| `Achievement` | Available achievements |
| `UserAchievement` | User achievement progress |
| `DailyChallenge` | Daily learning challenges |
| `Certificate` | Earned certificates |

### AI & Learning Tables

| Table | Description |
|-------|-------------|
| `AIConversation` | Dr. Nexus AI tutor conversations |
| `AIMessage` | Individual AI chat messages |
| `VRScenario` | VR surgery scenarios |
| `VRSession` | User VR session records |
| `Quiz` | Assessment quizzes |
| `Question` | Quiz questions |

### Social & Community Tables

| Table | Description |
|-------|-------------|
| `SocialPost` | User posts |
| `Comment` | Post comments |
| `Like` | Post likes |
| `Proposal` | Community governance proposals |
| `Vote` | Proposal votes |

### Knowledge & Research Tables

| Table | Description |
|-------|-------------|
| `KnowledgeNode` | Knowledge graph nodes |
| `UserKnowledgeNode` | User mastery of topics |
| `ResearchProject` | Research collaborations |
| `Mentorship` | Mentor-mentee relationships |

## Backup & Restore

### Create backup

```bash
pg_dump -U ibmp_app -h localhost ibmp_production > backup_$(date +%Y%m%d).sql
```

### Restore from backup

```bash
psql -U ibmp_app -h localhost -d ibmp_production < backup_20240101.sql
```

## Maintenance

### Analyze tables for query optimization

```sql
ANALYZE;
```

### Vacuum to reclaim space

```sql
VACUUM ANALYZE;
```

### Check table sizes

```sql
SELECT 
    relname as table_name,
    pg_size_pretty(pg_total_relation_size(relid)) as total_size
FROM pg_catalog.pg_statio_user_tables
ORDER BY pg_total_relation_size(relid) DESC;
```

## Security Recommendations

1. **Change default password** in `001_create_database.sql`
2. **Enable SSL** for database connections in production
3. **Restrict network access** using pg_hba.conf
4. **Regular backups** with point-in-time recovery
5. **Monitor with pg_stat_statements**

## Using with Prisma

After running the SQL scripts, sync Prisma:

```bash
cd apps/web
npx prisma db pull  # Pull schema from database
npx prisma generate # Generate Prisma client
```

Or if you prefer to use Prisma migrations:

```bash
cd apps/web
npx prisma migrate deploy  # Run migrations
npx prisma db seed         # Run seed script
```

