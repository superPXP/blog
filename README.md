# 我的个人博客

这是一个使用HTML和CSS构建的简单个人博客，可以部署到GitHub Pages。

## 特点

- 响应式设计，适配各种设备
- 简洁现代的界面
- 易于定制和扩展

## 目录结构

```
blog/
├── index.html          # 博客主页
├── styles.css          # 全局样式表
├── posts/              # 博客文章目录
│   └── hello-world.html # 示例博客文章
└── README.md           # 项目说明文件
```

## 如何使用

1. 克隆此仓库到本地
2. 修改 `index.html` 中的个人信息
3. 在 `posts` 目录中添加新的博客文章
4. 在 `index.html` 中更新文章列表
5. 推送到GitHub，并启用GitHub Pages

## 如何部署到GitHub Pages

1. 在GitHub上创建一个新仓库
2. 将本地代码推送到该仓库
3. 在仓库设置中，找到GitHub Pages部分
4. 选择主分支(main或master)作为源
5. 保存设置，等待几分钟后，你的博客将在`https://你的用户名.github.io/仓库名`上线

## 自定义域名（可选）

如果你有自己的域名，可以在GitHub Pages设置中添加自定义域名，并在你的域名提供商处添加相应的DNS记录。

## 许可

MIT