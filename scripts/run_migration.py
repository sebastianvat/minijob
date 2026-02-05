#!/usr/bin/env python3
"""
Run SQL migration on Supabase using direct PostgreSQL connection
"""

import psycopg2
import sys

# Supabase Database credentials
# Direct connection to Supabase PostgreSQL
DB_HOST = "db.lhuwdzgchwspnewnagyy.supabase.co"
DB_PORT = 5432
DB_NAME = "postgres"
DB_USER = "postgres"
DB_PASSWORD = "YOUR_DB_PASSWORD"  # Set via environment variable in production

def run_migration():
    print("🚀 Connecting to Supabase PostgreSQL...")
    
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
            sslmode='require'
        )
        conn.autocommit = True
        cursor = conn.cursor()
        
        print("✅ Connected successfully!")
        print("=" * 50)
        
        # Read migration file
        with open("supabase/migrations/002_projects_skills.sql", "r") as f:
            migration_sql = f.read()
        
        print("📝 Running migration: 002_projects_skills.sql")
        
        # Execute the entire migration
        cursor.execute(migration_sql)
        
        print("✅ Migration completed successfully!")
        
        # Verify tables were created
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name IN ('skills', 'provider_skills', 'skill_portfolio', 'projects', 'project_offers', 'skill_reviews')
            ORDER BY table_name;
        """)
        
        tables = cursor.fetchall()
        print("\n📊 New tables created:")
        for table in tables:
            print(f"   ✓ {table[0]}")
        
        # Count skills inserted
        cursor.execute("SELECT COUNT(*) FROM skills;")
        skills_count = cursor.fetchone()[0]
        print(f"\n📊 Skills seeded: {skills_count}")
        
        # Count categories
        cursor.execute("SELECT slug, name FROM categories ORDER BY sort_order;")
        categories = cursor.fetchall()
        print(f"\n📊 Categories ({len(categories)}):")
        for cat in categories:
            print(f"   ✓ {cat[0]}: {cat[1]}")
        
        cursor.close()
        conn.close()
        
        print("\n" + "=" * 50)
        print("🎉 Migration successful!")
        
    except psycopg2.Error as e:
        print(f"❌ Database error: {e}")
        sys.exit(1)
    except FileNotFoundError:
        print("❌ Migration file not found!")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    run_migration()
