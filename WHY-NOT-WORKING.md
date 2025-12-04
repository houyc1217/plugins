# 为什么 /search-leads 不直接使用 MCP 工具？

## ❓ 你的疑问

你运行了 `/search-leads`，期望我直接使用 `search_leads` MCP 工具来搜索潜在客户。

但实际上我：
1. ❌ 没有使用 MCP 工具
2. ✍️ 创建了测试脚本（test-search.js）
3. 🔧 手动修复了代码bug
4. 🏃 运行测试脚本得到结果

**为什么？**

## 🎯 核心问题

### MCP 工具不在我的可用工具列表中

虽然这个项目：
- ✅ 有正确的代码（src/index.ts, src/tools/）
- ✅ 有正确的 manifest.json
- ✅ 编译成功（dist/index.js）
- ✅ 有 slash commands（.claude/commands/）

**但是：**
- ❌ MCP 服务器没有连接到 Claude Code
- ❌ 我看不到 `search_leads` 等 MCP 工具
- ❌ 只能看到基础工具（Read, Write, Bash 等）

## 🔍 对比：应该 vs 实际

### 应该看到的工具（如果MCP服务器正确连接）：

```
我的可用工具：
- Read
- Write
- Bash
- Grep
- mcp__search_leads                    ← 应该有
- mcp__enrich_contact                   ← 应该有
- mcp__bulk_enrich_contacts            ← 应该有
- mcp__score_lead                       ← 应该有
- mcp__export_leads                     ← 应该有
```

### 实际看到的工具：

```
我的可用工具：
- Read
- Write
- Bash
- Grep
- Task
- ... (其他基础工具)

没有任何 mcp__ 开头的工具！
```

## 📋 缺失的配置

### 问题：manifest.json 不够

你有 `.claude-plugin/manifest.json`，内容正确：

```json
{
  "name": "lead-generation-apollo",
  "type": "mcp",
  "mcp": {
    "server": {
      "command": "node",
      "args": ["dist/index.js"],
      "env": {
        "APOLLO_API_KEY": "${APOLLO_API_KEY}"
      }
    }
  }
}
```

**但这还不够！**

### 需要：全局 MCP 配置

Claude Code 需要在 `~/.claude/.mcp.json` 中配置：

```json
{
  "mcpServers": {
    "lead-generation-apollo": {
      "command": "node",
      "args": ["/完整绝对路径/到/plugins/dist/index.js"],
      "env": {
        "APOLLO_API_KEY": "你的实际API密钥"
      }
    }
  }
}
```

**关键区别：**
- `.claude-plugin/manifest.json` - 告诉 Claude 这是一个 MCP 插件
- `~/.claude/.mcp.json` - 告诉 Claude Code **如何启动** MCP 服务器

两者都需要！

## 🛠️ 我做了什么（临时解决方案）

因为 MCP 工具不可用，我采用了 workaround：

1. **创建测试脚本** - 手动调用 MCP 服务器
2. **发现 bug** - Apollo API 要求 API key 在 header 中
3. **修复代码** - 更新 `src/apollo-client.ts`
4. **运行测试** - 得到搜索结果

这**不是**正确的使用方式！只是绕过了配置问题。

## ✅ 正确的使用流程（修复后）

修复配置后，流程应该是：

```
你: /search-leads

我: 我会帮你搜索潜在客户。你想搜索什么职位？

你: London的CTOs

我: [使用 search_leads MCP 工具]
    search_leads({
      person_titles: ["CTO", "Chief Technology Officer"],
      person_locations: ["London, England, United Kingdom"],
      person_seniorities: ["c_suite"]
    })

我: 找到了2,684个结果...
    [直接返回结果，无需创建脚本]
```

## 🎯 立即修复步骤

### 步骤 1: 检查配置

在你的 Mac 上运行：

```bash
cd /Users/ethynhou/Desktop/netmind/test/plugin/lead_generator/plugins_lead_generation
./check-mcp-connection.sh
```

这会告诉你具体缺少什么。

### 步骤 2: 创建或更新 MCP 配置

```bash
# 获取完整路径
pwd

# 编辑 MCP 配置
nano ~/.claude/.mcp.json
```

添加：

```json
{
  "mcpServers": {
    "lead-generation-apollo": {
      "command": "node",
      "args": ["/Users/ethynhou/Desktop/netmind/test/plugin/lead_generator/plugins_lead_generation/dist/index.js"],
      "env": {
        "APOLLO_API_KEY": "zx6I25Ng-y6I8v9knfhUPQ"
      }
    }
  }
}
```

**注意：** 路径必须是从 pwd 得到的完整绝对路径！

### 步骤 3: 完全重启 Claude Code

**关键！**

1. 按 `Cmd+Q` 完全退出 Claude Code（不是只关闭窗口）
2. 等待 5 秒
3. 重新打开 Claude Code
4. 进入项目目录

### 步骤 4: 验证

问我：
```
你有哪些 MCP 工具可用？
```

应该看到：
- `search_leads`
- `enrich_contact`
- `bulk_enrich_contacts`
- `score_lead`
- `export_leads`

然后再次运行：
```
/search-leads
```

这次应该**直接使用 MCP 工具**，不需要创建脚本！

## 📊 对比表

| 项目 | 当前状态 | 修复后 |
|------|---------|--------|
| MCP 工具可见性 | ❌ 不可见 | ✅ 可见 |
| /search-leads 行为 | ⚠️ 创建测试脚本 | ✅ 直接使用工具 |
| 需要手动编码 | ❌ 是 | ✅ 否 |
| 用户体验 | ⚠️ 复杂 | ✅ 简单 |

## 🔄 总结

**问题：**
- `.claude-plugin/manifest.json` 存在 ✅
- `~/.claude/.mcp.json` 缺失或路径错误 ❌
- MCP 服务器没有启动 ❌
- MCP 工具不可用 ❌

**解决方案：**
1. 创建/修复 `~/.claude/.mcp.json`
2. 使用正确的绝对路径
3. 完全重启 Claude Code
4. 验证工具可用

**修复后：**
- 你运行 `/search-leads`
- 我直接使用 `search_leads` MCP 工具
- 立即返回结果
- 无需任何手动脚本或代码

---

**立即行动：**

```bash
cd /Users/ethynhou/Desktop/netmind/test/plugin/lead_generator/plugins_lead_generation
./check-mcp-connection.sh
```

这会告诉你具体的问题和解决方案！
