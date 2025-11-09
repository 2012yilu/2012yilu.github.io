// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 1. 导航栏滚动效果 - 滚动时改变导航栏背景透明度
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(44, 82, 130, 0.95)';
        } else {
            navbar.style.backgroundColor = '#2c5282';
        }
    });

    // 2. 平滑滚动 - 点击导航链接跳转时平滑滚动到页面顶部
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // 只有跳转到当前网站内页面时才执行平滑滚动
            if (this.href.includes(window.location.hostname)) {
                e.preventDefault();
                const targetUrl = this.getAttribute('href');
                // 跳转到目标页面并滚动到顶部
                window.location.href = targetUrl;
                // 页面加载后滚动到顶部（针对同一页面内跳转）
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });

    // 3. 图片区域hover效果 - 首页画廊图片item交互
    const imageItems = document.querySelectorAll('.image-item');
    imageItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#e6f7ff';
            this.style.borderColor = '#91d5ff';
            this.style.color = '#1890ff';
            this.style.transform = 'scale(1.02)';
            this.style.transition = 'all 0.3s ease';
        });

        item.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '#f7fafc';
            this.style.borderColor = '#e2e8f0';
            this.style.color = '#718096';
            this.style.transform = 'scale(1)';
        });
    });

    // 4. 内容区域渐入效果 - 页面加载时内容从下往上渐入
    const contentSections = document.querySelectorAll('.content > section');
    contentSections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        // 延迟执行，营造依次出现的效果
        setTimeout(() => {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, 100 * index);
    });

    // 5. 页面加载完成提示（可选，可删除）
    console.log('網站加載完成 - 鞋盒裏的博物館');
});
