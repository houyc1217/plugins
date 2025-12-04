#!/bin/bash

# Lead Generation Apollo Plugin - Installation Script for MacOS
# This script installs and configures the plugin for Claude Code

set -e

echo "🚀 Lead Generation Apollo Plugin - Installation"
echo "================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js first:"
    echo "  brew install node"
    exit 1
fi

echo -e "${GREEN}✅ Node.js found:${NC} $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ npm found:${NC} $(npm --version)"
echo ""

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Step 1: Install dependencies
echo -e "${BLUE}📦 Step 1: Installing dependencies...${NC}"
npm install
echo ""

# Step 2: Build the project
echo -e "${BLUE}🔨 Step 2: Building TypeScript project...${NC}"
npm run build
echo ""

# Step 3: Check if .env exists, if not create from example
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  .env file not found${NC}"
    echo -e "${BLUE}Creating .env from .env.example...${NC}"
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Please edit .env and add your API keys:${NC}"
    echo "   APOLLO_API_KEY=your_apollo_api_key_here"
    echo "   NETMIND_API_TOKEN=your_netmind_api_token_here"
    echo ""
else
    echo -e "${GREEN}✅ .env file exists${NC}"
fi

# Step 4: Get API key from .env
source .env
if [ -z "$APOLLO_API_KEY" ] || [ "$APOLLO_API_KEY" = "your_apollo_api_key_here" ]; then
    echo -e "${YELLOW}⚠️  APOLLO_API_KEY not configured${NC}"
    echo "Please edit .env and add your Apollo API key"
    API_KEY_CONFIGURED=false
else
    echo -e "${GREEN}✅ Apollo API key configured${NC}"
    API_KEY_CONFIGURED=true
fi
echo ""

# Step 5: Setup MCP server configuration
echo -e "${BLUE}🔧 Step 3: Configuring MCP server...${NC}"

# Determine Claude Code config location
CLAUDE_CONFIG_DIR="$HOME/.claude"
MCP_CONFIG_FILE="$CLAUDE_CONFIG_DIR/.mcp.json"

# Create .claude directory if it doesn't exist
mkdir -p "$CLAUDE_CONFIG_DIR"

# Check if .mcp.json exists
if [ -f "$MCP_CONFIG_FILE" ]; then
    echo -e "${YELLOW}⚠️  MCP config file already exists at: $MCP_CONFIG_FILE${NC}"
    echo "Please manually add the following to your .mcp.json:"
else
    echo -e "${BLUE}Creating new MCP config file...${NC}"
    echo "{}" > "$MCP_CONFIG_FILE"
fi

echo ""
echo -e "${GREEN}Add this configuration to $MCP_CONFIG_FILE:${NC}"
echo ""
cat << EOF
{
  "mcpServers": {
    "lead-generation-apollo": {
      "command": "node",
      "args": ["$SCRIPT_DIR/dist/index.js"],
      "env": {
        "APOLLO_API_KEY": "$APOLLO_API_KEY"
      }
    }
  }
}
EOF
echo ""

# Step 6: Setup commands (optional)
echo -e "${BLUE}📋 Step 4: Setting up slash commands...${NC}"

# Ask user if they want to copy commands to global or local
echo "Where would you like to install the slash commands?"
echo "  1) Global (~/.claude/commands) - Available in all Claude Code sessions"
echo "  2) Local (.claude/commands) - Only in this project"
echo "  3) Skip - I'll set them up manually"
read -p "Choose [1/2/3]: " COMMAND_CHOICE

case $COMMAND_CHOICE in
    1)
        COMMAND_DIR="$HOME/.claude/commands"
        mkdir -p "$COMMAND_DIR"
        cp -r .claude/commands/* "$COMMAND_DIR/"
        echo -e "${GREEN}✅ Commands installed globally to $COMMAND_DIR${NC}"
        ;;
    2)
        echo -e "${GREEN}✅ Commands already in .claude/commands${NC}"
        ;;
    3)
        echo -e "${YELLOW}⚠️  Skipped command installation${NC}"
        ;;
esac
echo ""

# Installation complete
echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}✅ Installation Complete!${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""

if [ "$API_KEY_CONFIGURED" = false ]; then
    echo -e "${YELLOW}⚠️  Next Steps:${NC}"
    echo "1. Edit .env and add your Apollo API key"
    echo "2. Manually add the MCP server config to $MCP_CONFIG_FILE (see above)"
    echo "3. Restart Claude Code"
else
    echo -e "${GREEN}Next Steps:${NC}"
    echo "1. Manually add the MCP server config to $MCP_CONFIG_FILE (see above)"
    echo "2. Restart Claude Code"
fi

echo ""
echo -e "${BLUE}Available Commands:${NC}"
echo "  /search-leads       - Search for potential leads"
echo "  /enrich-contact     - Enrich contact information"
echo "  /score-leads        - Score leads by quality"
echo "  /export-leads       - Export leads to CSV/JSON"
echo "  /lead-workflow      - Complete lead generation workflow"
echo ""

echo -e "${BLUE}Available MCP Tools:${NC}"
echo "  - search_leads"
echo "  - enrich_contact"
echo "  - bulk_enrich_contacts"
echo "  - score_lead"
echo "  - export_leads"
echo ""

echo "📚 For more information, see README.md"
echo ""
