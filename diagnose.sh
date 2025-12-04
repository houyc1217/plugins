#!/bin/bash

# Lead Generation Apollo - Diagnosis and Fix Script
# This script diagnoses and fixes MCP server connection issues

set -e

echo "🔍 Lead Generation Apollo - Diagnostic Tool"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Get current directory
CURRENT_DIR="$(pwd)"
echo -e "${BLUE}Current directory:${NC} $CURRENT_DIR"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found${NC}"
    echo "Please run this script from the lead-generation-apollo directory"
    exit 1
fi

# Check if dist/index.js exists
if [ ! -f "dist/index.js" ]; then
    echo -e "${YELLOW}⚠️  dist/index.js not found. Building project...${NC}"
    npm run build
    echo ""
fi

# Verify dist/index.js exists now
if [ ! -f "dist/index.js" ]; then
    echo -e "${RED}❌ Build failed: dist/index.js still not found${NC}"
    exit 1
fi

echo -e "${GREEN}✅ dist/index.js found${NC}"
FULL_PATH="$CURRENT_DIR/dist/index.js"
echo -e "${BLUE}Full path:${NC} $FULL_PATH"
echo ""

# Test the MCP server
echo -e "${BLUE}Testing MCP server...${NC}"
if node dist/index.js 2>&1 | head -1 | grep -q "Lead Generation MCP Server running"; then
    echo -e "${GREEN}✅ MCP server starts successfully${NC}"
else
    echo -e "${YELLOW}⚠️  MCP server output:${NC}"
    timeout 2 node dist/index.js 2>&1 || true
fi
echo ""

# Check .env file
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  .env file not found${NC}"
    echo "Creating from .env.example..."
    cp .env.example .env
fi

source .env
if [ -z "$APOLLO_API_KEY" ] || [ "$APOLLO_API_KEY" = "your_apollo_api_key_here" ]; then
    echo -e "${RED}❌ APOLLO_API_KEY not configured in .env${NC}"
    echo "Please edit .env and add your Apollo API key"
else
    echo -e "${GREEN}✅ APOLLO_API_KEY configured${NC}"
fi
echo ""

# Check MCP configuration
MCP_CONFIG="$HOME/.claude/.mcp.json"
echo -e "${BLUE}Checking MCP configuration...${NC}"

if [ ! -f "$MCP_CONFIG" ]; then
    echo -e "${YELLOW}⚠️  MCP config not found at: $MCP_CONFIG${NC}"
    echo ""
    echo "Creating MCP configuration..."
    mkdir -p "$HOME/.claude"
    cat > "$MCP_CONFIG" << EOF
{
  "mcpServers": {
    "lead-generation-apollo": {
      "command": "node",
      "args": ["$FULL_PATH"],
      "env": {
        "APOLLO_API_KEY": "$APOLLO_API_KEY"
      }
    }
  }
}
EOF
    echo -e "${GREEN}✅ Created $MCP_CONFIG${NC}"
else
    echo -e "${GREEN}✅ MCP config exists${NC}"

    # Check if the path is correct
    CONFIGURED_PATH=$(cat "$MCP_CONFIG" | grep -o '"args": *\["[^"]*"' | cut -d'"' -f4)
    echo -e "${BLUE}Configured path:${NC} $CONFIGURED_PATH"

    if [ "$CONFIGURED_PATH" != "$FULL_PATH" ]; then
        echo -e "${RED}❌ Path mismatch!${NC}"
        echo -e "${YELLOW}Expected:${NC} $FULL_PATH"
        echo -e "${YELLOW}Found:${NC} $CONFIGURED_PATH"
        echo ""
        echo "Do you want to fix this? (y/n)"
        read -r response
        if [[ "$response" =~ ^[Yy]$ ]]; then
            cat > "$MCP_CONFIG" << EOF
{
  "mcpServers": {
    "lead-generation-apollo": {
      "command": "node",
      "args": ["$FULL_PATH"],
      "env": {
        "APOLLO_API_KEY": "$APOLLO_API_KEY"
      }
    }
  }
}
EOF
            echo -e "${GREEN}✅ Fixed MCP configuration${NC}"
        fi
    else
        echo -e "${GREEN}✅ Path is correct${NC}"
    fi
fi
echo ""

# Check slash commands
echo -e "${BLUE}Checking slash commands...${NC}"
if [ -d ".claude/commands" ]; then
    COMMAND_COUNT=$(ls .claude/commands/*.md 2>/dev/null | wc -l)
    echo -e "${GREEN}✅ Found $COMMAND_COUNT commands in .claude/commands/${NC}"

    # Ask if user wants to install globally
    echo ""
    echo "Commands are currently local to this project."
    echo "Install to ~/.claude/commands for global access? (y/n)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        mkdir -p "$HOME/.claude/commands"
        cp .claude/commands/*.md "$HOME/.claude/commands/"
        echo -e "${GREEN}✅ Installed commands globally${NC}"
    fi
else
    echo -e "${RED}❌ .claude/commands directory not found${NC}"
fi
echo ""

# Summary
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Diagnosis Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Make sure your .env file has the correct APOLLO_API_KEY"
echo "2. Restart Claude Code completely (quit and reopen)"
echo "3. Try running /search-leads again"
echo ""
echo -e "${BLUE}Your MCP configuration:${NC}"
echo "File: $MCP_CONFIG"
echo ""
cat "$MCP_CONFIG"
echo ""
echo -e "${YELLOW}Important:${NC} You MUST restart Claude Code for changes to take effect!"
echo ""
