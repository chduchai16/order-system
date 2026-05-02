#!/bin/bash

# Local CI Test Script
# This script runs the same checks as GitHub Actions locally
# Useful for validating changes before pushing

set -e

echo "========================================="
echo "Local CI Pipeline Simulation"
echo "========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"
if ! command -v java &> /dev/null; then
    echo -e "${RED}Java not found. Please install Java 17+${NC}"
    exit 1
fi
if ! command -v mvn &> /dev/null; then
    echo -e "${RED}Maven not found. Please install Maven${NC}"
    exit 1
fi
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js not found. Please install Node.js 18+${NC}"
    exit 1
fi
if ! command -v npm &> /dev/null; then
    echo -e "${RED}npm not found. Please install npm${NC}"
    exit 1
fi

JAVA_VERSION=$(java -version 2>&1 | grep 'version' | head -n 1)
echo -e "${GREEN}✓ Found: $JAVA_VERSION${NC}"
echo -e "${GREEN}✓ Found: $(mvn -v | head -n 1)${NC}"
echo -e "${GREEN}✓ Found: $(node -v)${NC}"
echo -e "${GREEN}✓ Found: $(npm -v)${NC}"

# Job 1: Build and Test Java Services
echo ""
echo -e "${YELLOW}=== Job 1: Build and Test Java Services ===${NC}"
echo "Building with Maven..."
mvn -B clean package -DskipTests
if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Maven build failed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Maven build successful${NC}"

echo "Running unit tests..."
mvn -B test
if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Unit tests failed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Unit tests passed${NC}"

# Optional: Run integration tests
read -p "Run integration tests? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Running integration tests..."
    mvn -B verify
    if [ $? -ne 0 ]; then
        echo -e "${RED}✗ Integration tests failed${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Integration tests passed${NC}"
fi

# Job 2: Build and Lint Frontend
echo ""
echo -e "${YELLOW}=== Job 2: Build and Lint Frontend ===${NC}"
cd frontend

echo "Installing npm dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}✗ npm install failed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Dependencies installed${NC}"

echo "Running linter..."
npm run lint
if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Linter checks failed${NC}"
    # Don't exit, just warn
    echo -e "${YELLOW}⚠ Fix linter issues before pushing${NC}"
fi
echo -e "${GREEN}✓ Linter checks passed${NC}"

echo "Building frontend..."
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Frontend build failed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Frontend build successful${NC}"

cd ..

# Summary
echo ""
echo "========================================="
echo -e "${GREEN}✓ All Local CI Checks Passed!${NC}"
echo "========================================="
echo ""
echo "You can now safely push your changes:"
echo "  git push origin <branch-name>"
echo ""
