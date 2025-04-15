// 修改getUsers和saveUsers方法
window.auth = {
    async getUsers() {
        const response = await fetch(`https://api.github.com/gists/${GIST_ID}`);
        const data = await response.json();
        const content = JSON.parse(data.files['users.json'].content);
        return {
            users: content.users,
            timestamp: new Date(data.updated_at).getTime()
        };
    },

    async saveUsers(users, localTimestamp) {
        const remoteData = await this.getUsers();
        
        // 冲突检测
        if (localTimestamp < remoteData.timestamp) {
            throw new Error('检测到数据冲突，请重新同步');
        }

        const response = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `token ${GH_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                files: {
                    'users.json': {
                        content: JSON.stringify({
                            users,
                            timestamp: Date.now()
                        })
                    }
                }
            })
        });
        
        if (!response.ok) throw new Error('保存失败');
        return response.json();
    }
};
