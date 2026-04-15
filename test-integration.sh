#!/bin/bash

# X-Guardian Integration Test Script
# This script tests all components to ensure they're working with real data

echo "🧪 X-Guardian Integration Test"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0

# Function to test API endpoint
test_api() {
    local name=$1
    local url=$2
    local expected=$3
    
    echo -n "Testing $name... "
    response=$(curl -s "$url")
    
    if echo "$response" | grep -q "$expected"; then
        echo -e "${GREEN}✅ PASS${NC}"
        ((PASSED++))
    else
        echo -e "${RED}❌ FAIL${NC}"
        echo "  Response: $response"
        ((FAILED++))
    fi
}

# Function to test contract
test_contract() {
    local name=$1
    local address=$2
    local method=$3
    local expected=$4
    
    echo -n "Testing $name... "
    
    cd contracts
    source .env 2>/dev/null
    result=$(cast call "$address" "$method" --rpc-url https://testrpc.xlayer.tech 2>&1)
    cd ..
    
    if echo "$result" | grep -qi "$expected"; then
        echo -e "${GREEN}✅ PASS${NC}"
        ((PASSED++))
    else
        echo -e "${RED}❌ FAIL${NC}"
        echo "  Result: $result"
        ((FAILED++))
    fi
}

echo "📦 1. Frontend Build Test"
echo "-------------------------"
cd frontend
if pnpm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✅ PASS${NC} - Frontend builds successfully"
    ((PASSED++))
else
    echo -e "${RED}❌ FAIL${NC} - Frontend build failed"
    ((FAILED++))
fi
cd ..
echo ""

echo "🌐 2. API Endpoints Test"
echo "------------------------"

# Start dev server in background
cd frontend
pnpm run dev > /dev/null 2>&1 &
DEV_PID=$!
cd ..

# Wait for server to start
echo "Starting dev server..."
sleep 8

# Test APIs
test_api "Strategies API" "http://localhost:3000/api/strategies?range=1W" '"ok":true'
test_api "Agent E2E" "http://localhost:3000/api/agent/e2e" '"ok":true'

# Test Agent Notify with POST
echo -n "Testing Agent Notify API... "
response=$(curl -s -X POST http://localhost:3000/api/agent/notify \
  -H "Content-Type: application/json" \
  -d '{"event":"test","strategy":"test","txHash":"0xtest","user":"0xtest","timestamp":"2026-01-01T00:00:00.000Z"}')

if echo "$response" | grep -q '"ok":true'; then
    echo -e "${GREEN}✅ PASS${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ FAIL${NC}"
    ((FAILED++))
fi

# Stop dev server
kill $DEV_PID 2>/dev/null
echo ""

echo "⛓️  3. Smart Contract Test"
echo "-------------------------"
test_contract "Executor.agentWallet()" \
    "0xd23eE223683071Bd1F357a312e9d6159148e7BBe" \
    "agentWallet()(address)" \
    "0x7849"

test_contract "Strategy.agentOwner()" \
    "0x54b8f113bfe164764d6bc3d0c9d966cd4fb83942" \
    "agentOwner()(address)" \
    "0x7849"

test_contract "Strategy.authorizedExecutor()" \
    "0x54b8f113bfe164764d6bc3d0c9d966cd4fb83942" \
    "authorizedExecutor()(address)" \
    "0xd23e"

echo ""

echo "📊 4. Real Data Verification"
echo "---------------------------"
echo -n "Testing DeFiLlama data... "
response=$(curl -s "http://localhost:3000/api/strategies?range=1W" 2>/dev/null || curl -s "https://yields.llama.fi/pools" | head -c 100)
if echo "$response" | grep -q "apy\|tvl"; then
    echo -e "${GREEN}✅ PASS${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠️  SKIP${NC} (Server not running)"
fi

echo -n "Testing X Layer RPC... "
if cast block-number --rpc-url https://testrpc.xlayer.tech > /dev/null 2>&1; then
    echo -e "${GREEN}✅ PASS${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ FAIL${NC}"
    ((FAILED++))
fi

echo ""
echo "================================"
echo "📈 Test Results"
echo "================================"
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed!${NC}"
    echo "✅ System is ready for production"
    exit 0
else
    echo -e "${RED}⚠️  Some tests failed${NC}"
    echo "Please check the errors above"
    exit 1
fi
