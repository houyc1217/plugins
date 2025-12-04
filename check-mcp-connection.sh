#!/bin/bash

# MCP Connection Checker
# Checks why MCP tools are not available in Claude Code

echo "🔍 MCP Connection Diagnostic"
echo "============================"
echo ""

# Check if MCP config exists
MCP_CONFIG="$HOME/.claude/.mcp.json"

echo "1. Checking MCP configuration file..."
if [ -f "$MCP_CONFIG" ]; then
    echo "   ✅ Found: $MCP_CONFIG"
    echo ""
    echo "   Current configuration:"
    cat "$MCP_CONFIG"
    echo ""
else
    echo "   ❌ NOT FOUND: $MCP_CONFIG"
    echo ""
    echo "   This is the problem! Claude Code doesn't know about your MCP server."
    echo ""
fi

# Check if dist/index.js exists
echo "2. Checking MCP server build..."
if [ -f "dist/index.js" ]; then
    echo "   ✅ MCP server built: dist/index.js"
else
    echo "   ❌ MCP server not built"
    echo "   Run: npm run build"
fi
echo ""

# Get current directory
CURRENT_DIR="$(pwd)"
echo "3. Project location:"
echo "   $CURRENT_DIR"
echo ""

# Check if server can start
echo "4. Testing if MCP server can start..."
if timeout 2 node dist/index.js 2>&1 | grep -q "Lead Generation MCP Server running"; then
    echo "   ✅ MCP server starts successfully"
else
    echo "   ⚠️  Server output:"
    timeout 2 node dist/index.js 2>&1 | head -5
fi
echo ""

echo "=========================================="
echo "📋 Summary"
echo "=========================================="
echo ""

if [ ! -f "$MCP_CONFIG" ]; then
    echo "❌ PROBLEM FOUND: No MCP configuration"
    echo ""
    echo "Claude Code cannot see your MCP server because ~/.claude/.mcp.json"
    echo "doesn't exist or doesn't include this server."
    echo ""
    echo "🔧 FIX: Create or update ~/.claude/.mcp.json with:"
    echo ""
    cat << EOF
{
  "mcpServers": {
    "lead-generation-apollo": {
      "command": "node",
      "args": ["$CURRENT_DIR/dist/index.js"],
      "env": {
        "APOLLO_API_KEY": "$(grep APOLLO_API_KEY .env | cut -d'=' -f2)"
      }
    }
  }
}
EOF
    echo ""
    echo "Then COMPLETELY RESTART Claude Code (Cmd+Q, not just close window)"
    echo ""
else
    # Check if path is correct
    CONFIGURED_PATH=$(grep -o '"args": *\["[^"]*"' "$MCP_CONFIG" | cut -d'"' -f4)
    EXPECTED_PATH="$CURRENT_DIR/dist/index.js"

    if [ "$CONFIGURED_PATH" = "$EXPECTED_PATH" ]; then
        echo "✅ Configuration looks correct"
        echo ""
        echo "If MCP tools still don't work:"
        echo "1. Completely quit Claude Code (Cmd+Q)"
        echo "2. Wait 5 seconds"
        echo "3. Reopen Claude Code"
        echo "4. Check if tools are available: Ask 'What MCP tools do you have?'"
    else
        echo "❌ PROBLEM: Path mismatch"
        echo ""
        echo "Configured: $CONFIGURED_PATH"
        echo "Expected:   $EXPECTED_PATH"
        echo ""
        echo "Update ~/.claude/.mcp.json with the correct path and restart Claude Code"
    fi
fi

echo ""
echo "=========================================="
echo ""
