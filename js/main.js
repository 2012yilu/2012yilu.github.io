document.addEventListener('DOMContentLoaded', function() {
    // 加载最新一期和往期题目
    loadLatestIssue();
    loadPreviousIssues();
    
    // 搜索功能
    document.getElementById('search-btn').addEventListener('click', function() {
        const searchTerm = document.getElementById('search-input').value.trim();
        if (searchTerm) {
            searchIssues(searchTerm);
        }
    });
    
    // 点击卡片跳转到详细页
    document.querySelectorAll('.issue-card').forEach(card => {
        card.addEventListener('click', function() {
            const issueNumber = this.querySelector('span').textContent;
            window.location.href = `detail.html?issue=${issueNumber}`;
        });
    });
});

// 加载最新一期
function loadLatestIssue() {
    fetch('database/latest.json')
        .then(response => response.json())
        .then(data => {
            document.getElementById('issue-number').textContent = data.number;
            document.getElementById('issue-intro').textContent = data.intro;
            
            // 设置点击事件
            document.getElementById('latest-issue').addEventListener('click', function() {
                window.location.href = `detail.html?issue=${data.number}`;
            });
        })
        .catch(error => {
            console.error('加载最新一期失败:', error);
            document.getElementById('issue-intro').textContent = '加载失败，请刷新重试';
        });
}

// 加载往期题目
function loadPreviousIssues() {
    fetch('database/all_issues.json')
        .then(response => response.json())
        .then(data => {
            // 获取最新两期以外的往期题目
            const previousIssues = data.slice(1, 3); // 获取第2和第3期
            
            // 更新第一个往期卡片
            if (previousIssues[0]) {
                const card1 = document.getElementById('prev-issue-1');
                card1.querySelector('.prev-issue-number').textContent = previousIssues[0].number;
                card1.querySelector('.prev-issue-intro').textContent = previousIssues[0].intro;
                
                card1.addEventListener('click', function() {
                    window.location.href = `detail.html?issue=${previousIssues[0].number}`;
                });
            }
            
            // 更新第二个往期卡片
            if (previousIssues[1]) {
                const card2 = document.getElementById('prev-issue-2');
                card2.querySelector('.prev-issue-number').textContent = previousIssues[1].number;
                card2.querySelector('.prev-issue-intro').textContent = previousIssues[1].intro;
                
                card2.addEventListener('click', function() {
                    window.location.href = `detail.html?issue=${previousIssues[1].number}`;
                });
            }
        })
        .catch(error => {
            console.error('加载往期题目失败:', error);
        });
}

// 搜索题目
function searchIssues(term) {
    fetch('database/all_issues.json')
        .then(response => response.json())
        .then(data => {
            const results = data.filter(issue => 
                issue.intro.includes(term) || 
                issue.number.includes(term) ||
                issue.tags.some(tag => tag.includes(term))
                .slice(0, 5); // 最多显示5个结果
            
            if (results.length > 0) {
                alert(`找到以下匹配的期数:\n${results.map(issue => `第${issue.number}期: ${issue.intro}`).join('\n')}`);
            } else {
                alert('没有找到匹配的题目');
            }
        })
        .catch(error => {
            console.error('搜索失败:', error);
            alert('搜索失败，请重试');
        });
}
