// 游戏数据
const gameData = {
    currentPhase: 1,
    currentLevel: 1,
    unlockedPhase: 1,
    unlockedLevel: 1,
    hasAcceptedAgreement: false,
    phases: [
        // 第一期
        {
            levels: [
                {
                    questions: [
                        {
                            question: "1. 如果所有的猫都会飞，而咪咪是一只猫，那么咪咪会飞吗？",
                            options: ["A. 会", "B. 不会", "C. 不确定", "D. 看情况"],
                            answer: "A"
                        },
                        {
                            question: "2. 一个人从10楼摔下来却没有受伤，为什么？",
                            options: ["A. 他有降落伞", "B. 他是超人", "C. 他从一楼摔下来", "D. 下面是水池"],
                            answer: "C"
                        },
                        {
                            question: "3. 什么东西越洗越脏？",
                            options: ["A. 衣服", "B. 水", "C. 抹布", "D. 碗"],
                            answer: "B"
                        }
                    ]
                },
                // 更多关卡...
            ]
        },
        // 更多期数...
    ]
};

// 初始化游戏
function initGame() {
    // 检查是否已接受协议
    const accepted = localStorage.getItem('agreementAccepted');
    if (accepted !== 'true') {
        showAgreement();
    } else {
        gameData.hasAcceptedAgreement = true;
    }
    
    // 加载游戏进度
    loadProgress();
    
    // 渲染期数选择界面
    renderPhases();
}

// 显示用户协议
function showAgreement() {
    fetch('agreement.html')
        .then(response => response.text())
        .then(text => {
            document.getElementById('agreementText').innerHTML = text;
            document.getElementById('agreementModal').style.display = 'block';
        });
}

// 接受协议
function acceptAgreement() {
    localStorage.setItem('agreementAccepted', 'true');
    gameData.hasAcceptedAgreement = true;
    document.getElementById('agreementModal').style.display = 'none';
    initGame();
}

// 加载游戏进度
function loadProgress() {
    const progress = localStorage.getItem('gameProgress');
    if (progress) {
        const data = JSON.parse(progress);
        gameData.unlockedPhase = data.unlockedPhase || 1;
        gameData.unlockedLevel = data.unlockedLevel || 1;
    }
}

// 保存游戏进度
function saveProgress() {
    localStorage.setItem('gameProgress', JSON.stringify({
        unlockedPhase: gameData.unlockedPhase,
        unlockedLevel: gameData.unlockedLevel
    }));
}

// 渲染期数选择界面
function renderPhases() {
    const phaseContainer = document.getElementById('phaseContainer');
    phaseContainer.innerHTML = '';
    
    for (let i = 1; i <= 5; i++) {
        const phaseDiv = document.createElement('div');
        phaseDiv.className = 'phase';
        phaseDiv.innerHTML = `<span>第${i}期</span>`;
        
        if (i < gameData.unlockedPhase) {
            phaseDiv.classList.add('unlocked');
        } else if (i === gameData.unlockedPhase) {
            phaseDiv.classList.add('current');
        } else {
            phaseDiv.classList.add('locked');
        }
        
        phaseDiv.onclick = function() {
            if (i <= gameData.unlockedPhase) {
                gameData.currentPhase = i;
                renderLevels();
            }
        };
        
        phaseContainer.appendChild(phaseDiv);
    }
    
    document.getElementById('phaseContainer').style.display = 'flex';
    document.getElementById('levelContainer').style.display = 'none';
    document.getElementById('questionContainer').style.display = 'none';
}

// 渲染关卡选择界面
function renderLevels() {
    const levelContainer = document.getElementById('levelContainer');
    levelContainer.innerHTML = '';
    
    for (let i = 1; i <= 5; i++) {
        const levelDiv = document.createElement('div');
        levelDiv.className = 'level';
        levelDiv.textContent = i;
        
        if (i < (gameData.currentPhase === gameData.unlockedPhase ? gameData.unlockedLevel : 6)) {
            levelDiv.classList.add('unlocked');
        } else if (i === (gameData.currentPhase === gameData.unlockedPhase ? gameData.unlockedLevel : 6)) {
            levelDiv.classList.add('current');
        } else {
            levelDiv.classList.add('locked');
        }
        
        levelDiv.onclick = function() {
            if (i <= (gameData.currentPhase === gameData.unlockedPhase ? gameData.unlockedLevel : 6)) {
                gameData.currentLevel = i;
                showQuestions();
            }
        };
        
        levelContainer.appendChild(levelDiv);
    }
    
    document.getElementById('phaseContainer').style.display = 'none';
    document.getElementById('levelContainer').style.display = 'flex';
    document.getElementById('questionContainer').style.display = 'none';
}

// 显示问题
function showQuestions() {
    const questionsDiv = document.getElementById('questions');
    questionsDiv.innerHTML = '';
    
    const currentQuestions = gameData.phases[gameData.currentPhase - 1].levels[gameData.currentLevel - 1].questions;
    
    currentQuestions.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question';
        questionDiv.innerHTML = `
            <p>${q.question}</p>
            <div class="options" id="options${index}">
                ${q.options.map(opt => `
                    <div class="option">
                        <input type="radio" name="q${index}" value="${opt.charAt(0)}" id="q${index}${opt.charAt(0)}">
                        <label for="q${index}${opt.charAt(0)}">${opt}</label>
                    </div>
                `).join('')}
            </div>
        `;
        questionsDiv.appendChild(questionDiv);
    });
    
    document.getElementById('phaseContainer').style.display = 'none';
    document.getElementById('levelContainer').style.display = 'none';
    document.getElementById('questionContainer').style.display = 'block';
}

// 返回关卡选择
function backToLevels() {
    renderLevels();
}

// 检查答案
function checkAnswers() {
    const currentQuestions = gameData.phases[gameData.currentPhase - 1].levels[gameData.currentLevel - 1].questions;
    let allCorrect = true;
    
    for (let i = 0; i < currentQuestions.length; i++) {
        const selectedOption = document.querySelector(`input[name="q${i}"]:checked`);
        if (!selectedOption || selectedOption.value !== currentQuestions[i].answer) {
            allCorrect = false;
            break;
        }
    }
    
    if (allCorrect) {
        // 检查是否是当前期的最后一关
        if (gameData.currentLevel === 5) {
            // 检查是否是最后一期
            if (gameData.currentPhase === 5) {
                alert('恭喜你！你已成功通关所有期数和关卡！\n\n你是真正的推理大师！');
            } else {
                if (gameData.currentPhase === gameData.unlockedPhase) {
                    gameData.unlockedPhase++;
                    gameData.unlockedLevel = 1;
                    saveProgress();
                    alert('恭喜你完成本期所有关卡！下一期已解锁！');
                } else {
                    alert('回答正确！');
                }
            }
        } else {
            if (gameData.currentPhase === gameData.unlockedPhase && 
                gameData.currentLevel === gameData.unlockedLevel) {
                gameData.unlockedLevel++;
                saveProgress();
                alert('恭喜你答对了所有题目！下一关已解锁！');
            } else {
                alert('回答正确！');
            }
        }
        renderLevels();
    } else {
        alert('有些题目回答错误，请再检查一下！');
    }
}

// 显示帮助
function showHelp() {
    alert(`新手使用说明：

1. 游戏共有5期，每期5个关卡，需要依次解锁
2. 必须完成前一期的所有关卡才能解锁下一期
3. 每个关卡有3道推理题，必须全部答对才能解锁下一关
4. 选择你认为正确的答案后点击"提交答案"按钮
5. 如果想返回关卡选择界面，点击"返回"按钮
6. 游戏进度会自动保存，下次打开可以继续

祝您游戏愉快！`);
}

// 显示关于信息
function showAbout() {
    window.location.href = 'about.html';
}

// 初始化游戏
window.onload = initGame;
