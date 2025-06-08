const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// 确保数据目录存在
const POSTS_FILE = process.cwd() + '/data/posts.json';

// 确保数据文件存在（已提交到Git仓库）
if (!fs.existsSync(POSTS_FILE)) {
    throw new Error('data/posts.json 文件不存在，请确保已提交到Git仓库');
}

// 获取所有文章，支持搜索和分类过滤
app.get('/api/posts', (req, res) => {
    try {
        const { search, category } = req.query;
        let posts = JSON.parse(fs.readFileSync(POSTS_FILE));

        // 如果提供了搜索关键词
        if (search) {
            const searchLower = search.toLowerCase();
            posts = posts.filter(post => 
                post.title.toLowerCase().includes(searchLower) ||
                post.content.toLowerCase().includes(searchLower)
            );
        }

        // 如果提供了分类
        if (category) {
            posts = posts.filter(post => post.category === category);
        }

        // 添加预估阅读时间（如果尚未添加）
        posts = posts.map(post => ({
            ...post,
            readTime: post.readTime || Math.ceil(post.content.length / 500) // 假设每分钟阅读500个字符
        }));

        res.json(posts);
    } catch (error) {
        console.error('读取文章失败:', error);
        res.status(500).json({ success: false, message: '读取文章失败' });
    }
});

// 获取所有分类
app.get('/api/categories', (req, res) => {
    try {
        const posts = JSON.parse(fs.readFileSync(POSTS_FILE));
        const categories = [...new Set(posts.map(post => post.category).filter(Boolean))];
        res.json(categories);
    } catch (error) {
        console.error('读取分类失败:', error);
        res.status(500).json({ success: false, message: '读取分类失败' });
    }
});

// 获取单篇文章
app.get('/api/posts/:id', (req, res) => {
    try {
        const posts = JSON.parse(fs.readFileSync(POSTS_FILE));
        const post = posts.find(p => p.id === req.params.id);
        
        if (!post) {
            return res.status(404).json({ success: false, message: '文章不存在' });
        }
        
        res.json(post);
    } catch (error) {
        console.error('读取文章失败:', error);
        res.status(500).json({ success: false, message: '读取文章失败' });
    }
});

// 创建新文章
app.post('/api/posts', (req, res) => {
    try {
        const { title, content, htmlContent, category, date, readTime } = req.body;
        
        if (!title || !content) {
            return res.status(400).json({ success: false, message: '标题和内容不能为空' });
        }
        
        const posts = JSON.parse(fs.readFileSync(POSTS_FILE));
        
        // 生成唯一ID
        const id = Date.now().toString();
        
        // 创建新文章
        const newPost = {
            id,
            title,
            content,
            htmlContent,
            category,
            date: date || new Date().toISOString(),
            readTime: readTime || Math.ceil(content.length / 500) // 预估阅读时间
        };
        
        // 添加到文章列表
        posts.unshift(newPost);
        
        // 保存到文件
        fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2));
        
        // 创建单独的文章页面
        createPostPage(newPost);
        
        res.json({ 
            success: true, 
            message: '文章发布成功',
            path: `/post/${id}`
        });
    } catch (error) {
        console.error('保存文章失败:', error);
        res.status(500).json({ success: false, message: '保存文章失败' });
    }
});

// 创建文章页面（Vercel环境下禁用）
function createPostPage(post) {
    console.log('Vercel环境：文章页面应预先生成并提交到Git仓库');
    /* 禁用文件写入
    const postDir = process.cwd() + '/post';
    
    if (!fs.existsSync(postDir)) {
        fs.mkdirSync(postDir);
    }
    
    const postPath = path.join(postDir, post.id);
    
    if (!fs.existsSync(postPath)) {
        fs.mkdirSync(postPath);
    }
    
    const htmlContent = `<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${post.title} - 我的博客</title>
    <link rel="stylesheet" href="/styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        .post-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .post-header {
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid #eee;
        }
        .post-title {
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
        }
        .post-meta {
            color: #666;
            font-size: 0.9rem;
            display: flex;
            gap: 1rem;
            align-items: center;
        }
        .post-meta span {
            display: flex;
            align-items: center;
            gap: 0.3rem;
        }
        .post-content {
            line-height: 1.8;
        }
        .post-content h1, .post-content h2, .post-content h3 {
            margin-top: 1.5rem;
            margin-bottom: 1rem;
        }
        .post-content p {
            margin-bottom: 1rem;
        }
        .post-content img {
            max-width: 100%;
            height: auto;
            margin: 1rem 0;
        }
        .post-content pre {
            background-color: #f5f5f5;
            padding: 1rem;
            border-radius: 4px;
            overflow-x: auto;
        }
        .post-content blockquote {
            border-left: 4px solid #3498db;
            padding-left: 1rem;
            color: #666;
            font-style: italic;
        }
        .category-tag {
            display: inline-flex;
            align-items: center;
            gap: 0.3rem;
            background-color: #e1f0fa;
            color: #3498db;
            padding: 0.3rem 0.8rem;
            border-radius: 16px;
            font-size: 0.9rem;
        }
    </style>
</head>
<body>
    <header>
        <nav>
            <div class="container">
                <h1><i class="fas fa-book-reader"></i> 我的博客</h1>
                <ul>
                    <li><a href="/"><i class="fas fa-home"></i> 首页</a></li>
                    <li><a href="/admin/new-post.html" class="publish-btn"><i class="fas fa-pen"></i> 发布文章</a></li>
                </ul>
            </div>
        </nav>
    </header>

    <main class="container">
        <article class="post-container">
            <header class="post-header">
                <h1 class="post-title">${post.title}</h1>
                <div class="post-meta">
                    <span><i class="far fa-calendar"></i> ${new Date(post.date).toLocaleDateString()}</span>
                    <span><i class="far fa-clock"></i> ${post.readTime}分钟阅读</span>
                    ${post.category ? `<span class="category-tag"><i class="fas fa-tag"></i> ${post.category}</span>` : ''}
                </div>
            </header>
            <div class="post-content">
                ${post.htmlContent}
            </div>
        </article>
    </main>

    <footer>
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h4><i class="fas fa-info-circle"></i> 关于博客</h4>
                    <p>分享技术、生活和有趣的故事</p>
                </div>
                <div class="footer-section">
                    <h4><i class="fas fa-envelope"></i> 联系方式</h4>
                    <p>Email: your.email@example.com</p>
                </div>
                <div class="footer-section">
                    <h4><i class="fas fa-share-alt"></i> 社交媒体</h4>
                    <div class="social-links">
                        <a href="#" title="GitHub"><i class="fab fa-github"></i></a>
                        <a href="#" title="Twitter"><i class="fab fa-twitter"></i></a>
                        <a href="#" title="LinkedIn"><i class="fab fa-linkedin"></i></a>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2024 我的博客. All rights reserved.</p>
            </div>
        </div>
    </footer>
</body>
</html>`;
    
    fs.writeFileSync(path.join(postPath, 'index.html'), htmlContent);
}

// 处理单篇文章的路由
app.get('/post/:id', (req, res) => {
    const postPath = process.cwd() + '/post/' + req.params.id + '/index.html';
    const notFoundPath = process.cwd() + '/404.html';
    
    if (fs.existsSync(postPath)) {
        res.sendFile(postPath);
    } else {
        res.status(404).sendFile(notFoundPath);
    }
});

// 处理404页面
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '404.html'));
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`博客服务器运行在 http://localhost:${PORT}`);
});