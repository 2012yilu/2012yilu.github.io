document.addEventListener('DOMContentLoaded', function() {
    // 从URL获取期号
    const urlParams = new URLSearchParams(window.location.search);
    const issueNumber = urlParams.get('issue');
    
    if (!issueNumber) {
        window.location.href = 'index.html';
        return;
    }
    
    // 加载题目数据
    loadIssueData(issueNumber);
    
    // 提交按钮事件
    document.getElementById('submit-btn').addEventListener('click', submitAnswers);
    
    // 重置按钮事件
    document.getElementById('reset-btn').addEventListener('click', resetAnswers);
});

// 加载题目数据
function loadIssueData(issueNumber) {
    // 更新标题
    document.getElementById('detail-issue-title').textContent = `第${issueNumber}期`;
    
    // 从数据库加载题目
    fetch(`database/issues/${issueNumber.padStart(3, '0')}.json`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('detail-issue-intro').textContent = data.intro;
            renderQuestions(data.questions);
        })
        .catch(error => {
            console.error('加载题目失败:', error);
            document.getElementById('detail-issue-intro').textContent = '加载题目失败，请返回首页重试';
            document.getElementById('questions-container').innerHTML = '<div class="error">加载题目失败</div>';
        });
}

// 渲染题目
function renderQuestions(questions) {
    const container = document.getElementById('questions-container');
    container.innerHTML = '';
    
    questions.forEach((question, index) => {
        const questionElement = document.createElement('div');
        questionElement.className = 'question';
        questionElement.dataset.questionId = index;
        questionElement.dataset.correctAnswer = question.answer;
        
        questionElement.innerHTML = `
            <h3>${index + 1}. ${question.question}</h3>
            <div class="options">
                ${renderQuestionOptions(question, index)}
            </div>
        `;
        
        container.appendChild(questionElement);
    });
}

// 渲染题目选项
function renderQuestionOptions(question, questionIndex) {
    if (question.type === 'choice') {
        return question.options.map((option, optionIndex) => `
            <div class="option">
                <input type="radio" 
                       id="q${questionIndex}-o${optionIndex}" 
                       name="q${questionIndex}" 
                       value="${optionIndex}">
                <label for="q${questionIndex}-o${optionIndex}">${option}</label>
            </div>
        `).join('');
    } else if (question.type === 'fill') {
        return `
            <div class="option">
                <input type="text" 
                       id="q${questionIndex}-answer" 
                       name="q${questionIndex}" 
                       placeholder="请输入答案...">
            </div>
        `;
    }
}

// 提交答案
function submitAnswers() {
    const questions = document.querySelectorAll('.question');
    let correctCount = 0;
    const resultElement = document.getElementById('result');
    resultElement.innerHTML = '<h3>答题结果</h3>';
    resultElement.style.display = 'block';
    
    questions.forEach(question => {
        const questionId = question.dataset.questionId;
        const correctAnswer = question.dataset.correctAnswer;
        let userAnswer;
        
        if (question.querySelector('input[type="radio"]')) {
            // 选择题
            const selectedOption = question.querySelector('input[type="radio"]:checked');
            userAnswer = selectedOption ? selectedOption.value : null;
        } else {
            // 填空题
            userAnswer = question.querySelector('input[type="text"]').value.trim().toLowerCase();
        }
        
        const isCorrect = userAnswer !== null && userAnswer.toString() === correctAnswer.toString();
        
        if (isCorrect) {
            correctCount++;
        }
        
        // 显示结果
        const resultItem = document.createElement('div');
        resultItem.innerHTML = `
            <p>第${parseInt(questionId) + 1}题: 
                <span class="${isCorrect ? 'correct' : 'incorrect'}">
                    ${isCorrect ? '正确' : '错误'}
                </span>
            </p>
            ${!isCorrect ? `<p class="correct-answer">正确答案: ${correctAnswer}</p>` : ''}
        `;
        resultElement.appendChild(resultItem);
    });
    
    // 显示总分
    const totalScore = document.createElement('div');
    totalScore.className = 'total-score';
    totalScore.innerHTML = `<p>你的得分: ${correctCount}/${questions.length}</p>`;
    resultElement.appendChild(totalScore);
    
    // 滚动到结果
    resultElement.scrollIntoView({ behavior: 'smooth' });
}

// 重置答案
function resetAnswers() {
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.checked = false;
    });
    
    document.querySelectorAll('input[type="text"]').forEach(input => {
        input.value = '';
    });
    
    document.getElementById('result').style.display = 'none';
}
