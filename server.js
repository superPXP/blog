const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// 数据文件路径 - 仅用于读取
const POSTS_FILE = path.join(process.cwd(), 'data', 'posts.json');

// 初始化文章数据 - 在Vercel环境中只读取，不写入
let postsData = [];
try {
    // 尝试读取文章数据
    if (fs.existsSync(POSTS_FILE)) {
        postsData = JSON.parse(fs.readFileSync(POSTS_FILE, 'utf8'));
        console.log(`成功加载${postsData.length}篇文章`);
    } else {
        console.log('警告: posts.json文件不存在，使用空数组初始化');
    }
} catch (error) {
    console.error('初始化文章数据失败:', error);
}

// 获取所有文章，支持搜索和分类过滤
app.get('/api/posts', (req, res) => {
    try {
        const { search, category } = req.query;
        let posts = [...postsData]; // 使用内存中的数据，不再每次都读取文件

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
        const categories = [...new Set(postsData.map(post => post.category).filter(Boolean))];
        res.json(categories);
    } catch (error) {
        console.error('读取分类失败:', error);
        res.status(500).json({ success: false, message: '读取分类失败' });
    }
});

// 获取单篇文章
app.get('/api/posts/:id', (req, res) => {
    try {
        const post = postsData.find(p => p.id === req.params.id);
        
        if (!post) {
            return res.status(404).json({ success: false, message: '文章不存在' });
        }
        
        res.json(post);
    } catch (error) {
        console.error('读取文章失败:', error);
        res.status(500).json({ success: false, message: '读取文章失败' });
    }
});

// 创建新文章 - 在Vercel环境中禁用写入操作
app.post('/api/posts', (req, res) => {
    // 检查是否在Vercel环境中
    if (process.env.VERCEL) {
        return res.status(403).json({ 
            success: false, 
            message: '在Vercel环境中不支持创建新文章，请在本地开发环境中添加文章并提交到Git仓库' 
        });
    }
    
    try {
        const { title, content, htmlContent, category, date, readTime } = req.body;
        
        if (!title || !content) {
            return res.status(400).json({ success: false, message: '标题和内容不能为空' });
        }
        
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
        
        // 添加到内存中的文章列表
        postsData.unshift(newPost);
        
        // 仅在本地环境中保存到文件
        if (!process.env.VERCEL) {
            fs.writeFileSync(POSTS_FILE, JSON.stringify(postsData, null, 2));
        }
        
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

// 处理单篇文章的路由 - 改为使用SPA方式处理
app.get('/post/:id', (req, res) => {
    // 在Vercel环境中，我们返回index.html，让前端路由处理
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 处理404页面
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '404.html'));
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`博客服务器运行在 http://localhost:${PORT}`);
});