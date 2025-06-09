# 部署指南

本指南提供两种部署方式：Vercel（推荐）和GitHub Pages。

## 一、部署到Vercel（推荐）

### 前提条件

1. 拥有一个GitHub账号
2. 拥有一个Vercel账号（可以使用GitHub账号直接注册）

### 部署步骤

1. **准备代码仓库**
   - 将代码推送到GitHub仓库
   - 确保代码根目录包含以下文件：
     - `server.js`
     - `vercel.json`
     - `package.json`
     - `data/posts.json`

2. **连接Vercel**
   - 登录[Vercel](https://vercel.com)
   - 点击"New Project"
   - 选择你的GitHub仓库
   - 点击"Import"

3. **配置部署设置**
   - 项目名称：可以保持默认或自定义
   - 构建设置：保持默认即可，Vercel会自动检测配置
   - 环境变量：不需要额外配置
   - 点击"Deploy"

4. **验证部署**
   - 等待部署完成
   - 点击生成的域名链接访问你的博客
   - 检查API endpoints是否正常工作

### 重要说明

1. **文件系统限制**
   - Vercel是无服务器环境，不支持文件系统写入操作
   - 所有文章数据必须预先存在于`data/posts.json`文件中
   - 新文章需要在本地环境添加，然后提交到Git仓库

2. **数据更新流程**
   - 在本地开发环境添加新文章
   - 更新`data/posts.json`文件
   - 提交更改到Git仓库
   - Vercel会自动重新部署

3. **注意事项**
   - API的POST请求在Vercel环境中被禁用
   - 所有静态资源都会被正确处理
   - 确保所有路径使用正斜杠(/)，不要使用反斜杠(\)

### 本地开发

1. **安装依赖**
   ```bash
   npm install
   ```

2. **启动开发服务器**
   ```bash
   npm run dev
   ```

3. **添加新文章**
   - 在本地环境使用管理界面添加文章
   - 或直接编辑`data/posts.json`文件
   - 提交更改并推送到GitHub
   - Vercel会自动重新部署

## 二、部署到GitHub Pages

### 前提条件

1. 拥有一个GitHub账号
2. 安装了Git（如果你想在本地进行更改）

### 部署步骤

1. **创建GitHub仓库**
   - 登录GitHub账号
   - 创建新仓库（可以使用`username.github.io`作为仓库名）
   - 选择"Public"（公开）

2. **上传博客文件**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/你的用户名/仓库名.git
   git push -u origin main
   ```

3. **启用GitHub Pages**
   - 进入仓库设置
   - 找到"Pages"设置
   - 选择部署分支和目录
   - 等待部署完成

### 注意事项

1. GitHub Pages只支持静态文件
2. 需要预先生成所有文章的HTML文件
3. 不支持服务器端功能

## 更新博客内容

1. **本地修改**
   ```bash
   git add .
   git commit -m "更新描述"
   git push
   ```

2. **自动部署**
   - Vercel或GitHub Pages会自动检测更改
   - 自动重新部署网站

## 自定义域名

### Vercel自定义域名
1. 在Vercel仪表板中选择你的项目
2. 点击"Settings" -> "Domains"
3. 添加你的域名
4. 按照Vercel提供的说明配置DNS记录

### GitHub Pages自定义域名
1. 在DNS设置中添加CNAME记录
2. 在仓库中创建CNAME文件
3. 或在GitHub Pages设置中配置自定义域名

## 故障排除

1. **Vercel部署失败**
   - 检查`vercel.json`配置
   - 查看构建日志
   - 确保所有依赖都正确列在`package.json`中

2. **API请求失败**
   - 确认路由配置正确
   - 检查请求URL格式
   - 验证数据文件存在且格式正确

3. **静态资源404**
   - 检查文件路径是否正确
   - 确认文件已提交到仓库
   - 验证`vercel.json`中的路由配置

如需更多帮助，请查看：
- [Vercel文档](https://vercel.com/docs)
- [GitHub Pages文档](https://docs.github.com/pages)