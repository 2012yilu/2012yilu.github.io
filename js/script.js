// 游戏数据 - 包含5期x5关卡
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
                // 第1关
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
                // 第2关
                {
                    questions: [
                        {
                            question: "1. 什么东西不能吃？",
                            options: ["A. 亏", "B. 饭", "C. 药", "D. 糖"],
                            answer: "A"
                        },
                        {
                            question: "2. 什么东西越生气，它就越小？",
                            options: ["A. 气球", "B. 脾气", "C. 火", "D. 年龄"],
                            answer: "A"
                        },
                        {
                            question: "3. 什么书在书店买不到？",
                            options: ["A. 禁书", "B. 秘书", "C. 遗书", "D. 天书"],
                            answer: "C"
                        }
                    ]
                },
                // 第3关
                {
                    questions: [
                        {
                            question: "1. 小明的妈妈有三个孩子，老大叫大毛，老二叫二毛，老三叫什么？",
                            options: ["A. 三毛", "B. 小明", "C. 小毛", "D. 毛毛"],
                            answer: "B"
                        },
                        {
                            question: "2. 什么东西明明是你的，别人却用得比你多得多？",
                            options: ["A. 钱", "B. 名字", "C. 衣服", "D. 房子"],
                            answer: "B"
                        },
                        {
                            question: "3. 什么东西不能吃？",
                            options: ["A. 亏", "B. 饭", "C. 药", "D. 糖"],
                            answer: "A"
                        }
                    ]
                },
                // 第4关
                {
                    questions: [
                        {
                            question: "1. 什么东西越生气，它就越小？",
                            options: ["A. 气球", "B. 脾气", "C. 火", "D. 年龄"],
                            answer: "A"
                        },
                        {
                            question: "2. 什么书在书店买不到？",
                            options: ["A. 禁书", "B. 秘书", "C. 遗书", "D. 天书"],
                            answer: "C"
                        },
                        {
                            question: "3. 小明的妈妈有三个孩子，老大叫大毛，老二叫二毛，老三叫什么？",
                            options: ["A. 三毛", "B. 小明", "C. 小毛", "D. 毛毛"],
                            answer: "B"
                        }
                    ]
                },
                // 第5关
                {
                    questions: [
                        {
                            question: "1. 什么东西明明是你的，别人却用得比你多得多？",
                            options: ["A. 钱", "B. 名字", "C. 衣服", "D. 房子"],
                            answer: "B"
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
                }
            ]
        },
        // 第二期
        {
            levels: [
                // 第1关
                {
                    questions: [
                        {
                            question: "1. 什么东西越热越爱出来？",
                            options: ["A. 汗", "B. 火", "C. 冰", "D. 影子"],
                            answer: "A"
                        },
                        {
                            question: "2. 什么门永远关不上？",
                            options: ["A. 球门", "B. 冰箱门", "C. 电梯门", "D. 心门"],
                            answer: "A"
                        },
                        {
                            question: "3. 什么车子寸步难行？",
                            options: ["A. 风车", "B. 汽车", "C. 自行车", "D. 火车"],
                            answer: "A"
                        }
                    ]
                },
                // 第2-5关（结构相同，题目不同）
                // 您可以复制上面的结构并修改题目
            ]
        },
        // 第三期、第四期、第五期（结构相同）
    ]
};

// 其余JavaScript代码保持不变（初始化、渲染、检查答案等功能）
// 完整JS代码请参考之前的回复
