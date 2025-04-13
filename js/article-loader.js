document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('article-container');
    const slug = new URLSearchParams(window.location.search).get('id');
    
    if (!slug) {
        container.innerHTML = `
            <div class="error">
                <h2>文章参数错误</h2>
                <p>缺少文章ID参数</p>
                <a href="/index.html">返回搜索页</a>
            </div>
        `;
        return;
    }
    
    fetch('/data/articles.json')
        .then(response => {
            if (!response.ok) throw new Error('网络响应错误');
            return response.json();
        })
        .then(articles => {
            const article = articles.find(a => a.slug === slug);
            if (!article) throw new Error('文章不存在');
            
            document.title = `${article.title} - 清浅资源搜索`;
            container.innerHTML = `
                <h1>${article.title}</h1>
                <div class="article-meta">发布日期: ${article.date}</div>
                <div class="article-content">${article.content}</div>
                <a href="/index.html" class="back-link">← 返回搜索结果</a>
            `;
            
            // 设置搜索框的值（如果有）
            const query = new URLSearchParams(window.location.search).get('q');
            if (query) document.querySelector('.search-box').value = query;
        })
        .catch(error => {
            container.innerHTML = `
                <div class="error">
                    <h2>加载文章失败</h2>
                    <p>${error.message}</p>
                    <a href="/index.html">返回搜索页</a>
                </div>
            `;
        });
});
