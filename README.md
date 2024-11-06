
# NeoDB 数据自动同步工具

这是一个用于自动获取 NeoDB 数据并同步到 GitHub 仓库的工具。它会每天自动运行，获取你在 NeoDB 上的观影、读书等记录。

## 功能特点

- 🔄 每天自动同步 NeoDB 数据
- 📁 数据保存在 public/neodb_data 目录
- 🤖 使用 GitHub Actions 自动运行
- 🔒 安全存储 NeoDB Token

## 使用方法

1. Fork 这个仓库到你的 GitHub 账号

2. 设置 NeoDB Token
   - 获取你的 NeoDB access token
   - 在仓库中进入 Settings > Secrets and variables > Actions
   - 点击 "New repository secret"
   - 名称填写：`NEODB_TOKEN`
   - 值填写你的 token

3. 启用 GitHub Actions
   - 进入仓库的 Actions 标签页
   - 确认工作流已启用

## 自动运行

工作流程会：
- 每天 UTC 00:00 自动运行
- 获取最新数据
- 自动提交更改到仓库

## 手动运行

如果需要立即更新数据：
1. 进入仓库的 Actions 标签页
2. 点击 "Fetch NeoDB Data" 工作流
3. 点击 "Run workflow"

## 目录结构

```
.
├── .github/workflows/   # GitHub Actions 配置
├── scripts/            # Python 脚本
└── public/neodb_data/  # 数据存储目录
```

## 注意事项

- 确保仓库的 Actions 权限设置为 "Read and write"
- 请勿泄露你的 NeoDB Token
- 确保 public/neodb_data 目录存在

## 问题反馈

如果遇到问题，欢迎在 Issues 中反馈