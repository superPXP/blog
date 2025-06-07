# 部署指南：将博客部署到GitHub Pages

本指南将帮助你将这个博客部署到GitHub Pages，让它在互联网上可访问。

## 前提条件

1. 拥有一个GitHub账号
2. 安装了Git（如果你想在本地进行更改）

## 部署步骤

### 1. 创建GitHub仓库

1. 登录你的GitHub账号
2. 点击右上角的"+"图标，选择"New repository"
3. 填写仓库名称（例如：`my-blog`或`username.github.io`）
   - 如果你使用`username.github.io`作为仓库名（其中username是你的GitHub用户名），你的博客将直接在`https://username.github.io`上可用
   - 如果使用其他名称，如`my-blog`，你的博客将在`https://username.github.io/my-blog`上可用
4. 选择"Public"（公开）
5. 点击"Create repository"

### 2. 上传博客文件到GitHub

#### 方法一：使用Git命令行（推荐）

1. 打开命令行终端
2. 导航到你的博客目录：
   ```bash
   cd 你的博客目录路径
   ```
3. 初始化Git仓库：
   ```bash
   git init
   ```
4. 添加所有文件到暂存区：
   ```bash
   git add .
   ```
5. 提交更改：
   ```bash
   git commit -m "Initial commit"
   ```
6. 添加远程仓库：
   ```bash
   git remote add origin https://github.com/你的用户名/仓库名.git
   ```
7. 推送到GitHub：
   ```bash
   git push -u origin main
   ```
   注意：如果你的默认分支是`master`而不是`main`，请使用`git push -u origin master`

#### 方法二：直接在GitHub上传文件

1. 在你创建的GitHub仓库页面，点击"Add file"下拉菜单，选择"Upload files"
2. 拖拽你的博客文件到上传区域，或点击"choose your files"选择文件
3. 添加提交信息，如"Initial commit"
4. 点击"Commit changes"

### 3. 启用GitHub Pages

1. 在你的GitHub仓库页面，点击"Settings"
2. 在左侧菜单中，找到并点击"Pages"
3. 在"Source"部分，选择"Deploy from a branch"
4. 在"Branch"下拉菜单中，选择"main"（或"master"）和"/(root)"
5. 点击"Save"
6. 等待几分钟，GitHub会自动构建和部署你的网站
7. 部署完成后，你会在页面顶部看到一个绿色的成功消息，其中包含你的网站URL

### 4. 访问你的博客

部署完成后，你可以通过以下URL访问你的博客：
- 如果仓库名是`username.github.io`：https://username.github.io
- 如果仓库名是其他名称，如`my-blog`：https://username.github.io/my-blog

## 更新博客

每当你想更新博客内容时，只需：

1. 在本地修改文件
2. 提交更改：
   ```bash
   git add .
   git commit -m "更新描述"
   git push
   ```
3. GitHub会自动重新部署你的网站

## 添加新文章

1. 在`posts`目录中创建一个新的HTML文件，如`my-new-post.html`
2. 复制`hello-world.html`的内容作为模板，修改标题、日期和内容
3. 在`index.html`的文章列表部分添加新文章的链接
4. 提交并推送更改

## 自定义域名（可选）

如果你想使用自己的域名：

1. 在你的域名提供商的DNS设置中，添加一个CNAME记录，指向`username.github.io`
2. 在你的GitHub仓库中，创建一个名为`CNAME`的文件（无扩展名），内容为你的域名
3. 或者在GitHub Pages设置中，在"Custom domain"字段中输入你的域名，然后点击"Save"

完成这些步骤后，你的博客将通过你的自定义域名访问。