document.addEventListener('DOMContentLoaded', function() {
    // 从URL获取文章slug
    const pathParts = window.location.pathname.split('/');
    const articleSlug = pathParts[pathParts.length - 1].replace('.html', '');
    
    // 加载文章数据
    fetch('/data/articles.json')
        .then(response => response.json())
        .then(articles => {
            const article = articles.find(a => a.slug === articleSlug);
            if (article) {
                displayArticle(article);
            } else {
                document.querySelector('.article-container').innerHTML = `
                    <div class="error">文章未找到</div>
                    <a href="/search.html">返回搜索页</a>
                `;
            }
        });
});

function displayArticle(article) {
    // 更新页面标题
    document.title = `${article.title} - 简易搜索`;
    
    // 更新文章内容
    document.querySelector('h1').textContent = article.title;
    document.querySelector('.date').textContent = `发布日期: ${article.date}`;
    document.querySelector('.article-content').innerHTML = article.content;
    
    // 更新搜索框的值（如果有搜索词）
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    if (query) {
        document.querySelector('.search-box').value = query;
    }
}
