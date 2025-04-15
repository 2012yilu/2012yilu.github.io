const GIST_ID = '0ca20d1df94a48cb89adec80ec98e81c'; // 替换为你的Gist ID
const GH_TOKEN = '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'; // 替换为你的GitHub Token

window.auth = {
    async getUsers() {
        const response = await fetch(`https://api.github.com/gists/${GIST_ID}`);
        const data = await response.json();
        return JSON.parse(data.files['users.json'].content).users;
    },

    async saveUsers(users) {
        const response = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `token ${GH_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                files: {
                    'users.json': {
                        content: JSON.stringify({ users })
                    }
                }
            })
        });
        
        if (!response.ok) throw new Error('保存失败');
    }
};
