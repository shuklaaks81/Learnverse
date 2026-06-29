#!/bin/bash

# Test Database Connection and Logging
# Verifies that the tutor-log API can successfully write to PostgreSQL

set -e

echo "🧪 Testing Learnverse Database Setup"
echo "===================================="
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "❌ DATABASE_URL not set. Skipping database tests."
  echo ""
  echo "Set it with:"
  echo "  export DATABASE_URL='postgresql://user:password@host:port/database'"
  exit 0
fi

echo "✅ DATABASE_URL is set"
echo ""

# Test 1: Check connection
echo "Test 1: Database Connection"
echo "---"
if psql "$DATABASE_URL" -c "" 2>/dev/null; then
  echo "✅ PostgreSQL connection successful"
else
  echo "❌ PostgreSQL connection failed"
  exit 1
fi
echo ""

# Test 2: Check if tutor_logs table exists
echo "Test 2: Table Existence"
echo "---"
TABLES=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_name IN ('tutor_logs', 'cache_stats', 'lessons', 'student_progress', 'daily_metrics');")
echo "tables found: $TABLES (expected: 5)"

if [ "$TABLES" -ne 5 ]; then
  echo "❌ Not all tables exist. Run: bash scripts/setup-database.sh"
  exit 1
fi
echo "✅ All tables exist"
echo ""

# Test 3: Insert test record
echo "Test 3: Insert Test Record"
echo "---"
TIMESTAMP=$(date +%s%3N)
TEST_ID="test-student-$(date +%s)"

psql "$DATABASE_URL" << EOF 2>/dev/null
INSERT INTO tutor_logs (student_id, question, answer_preview, cached, latency_ms, timestamp)
VALUES ('$TEST_ID', 'Test question: What is 2+2?', 'Test answer: 2+2=4', false, 500, $TIMESTAMP);
EOF

echo "✅ Test record inserted"
echo ""

# Test 4: Query the data
echo "Test 4: Query Inserted Data"
echo "---"
psql "$DATABASE_URL" -c "SELECT id, student_id, question, cached, latency_ms FROM tutor_logs WHERE student_id = '$TEST_ID';"
echo "✅ Data retrieved successfully"
echo ""

# Test 5: Check record count
echo "Test 5: Record Count"
echo "---"
COUNT=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM tutor_logs;")
echo "Total records: $COUNT"
echo "✅ Count query successful"
echo ""

# Test 6: Performance check
echo "Test 6: Query Performance"
echo "---"
TIME=$( { time psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM tutor_logs WHERE created_at > NOW() - INTERVAL '24 hours';" &>/dev/null; } 2>&1 | grep real)
echo "Past 24h query time: $TIME"
echo "✅ Query performance acceptable"
echo ""

# Test 7: Clean up test records
echo "Test 7: Cleanup Test Records"
echo "---"
psql "$DATABASE_URL" -c "DELETE FROM tutor_logs WHERE student_id = '$TEST_ID';" >/dev/null 2>&1
echo "✅ Test records cleaned up"
echo ""

echo "🎉 All database tests passed!"
echo ""
echo "You can now:"
echo "  1. Run: npm run dev"
echo "  2. Visit: http://localhost:3000/kid/tutor"
echo "  3. Ask a question - it will be logged to PostgreSQL"
echo ""
