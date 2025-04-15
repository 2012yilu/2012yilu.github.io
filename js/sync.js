class SyncManager {
    constructor() {
        this.syncInterval = 300000; // 5分钟
        this.lastSyncTime = 0;
        this.isSyncing = false;
    }

    async autoSync() {
        if (this.isSyncing) return;
        
        this.isSyncing = true;
        try {
            const currentUser = localStorage.getItem('currentUser');
            if (!currentUser) return;

            // 获取本地数据
            const localData = JSON.parse(localStorage.getItem('userData') || '{}');
            
            // 获取远程数据
            const remoteData = await window.auth.getUsers();
            
            // 合并策略：保留最新修改
            if (remoteData.timestamp > (localData.timestamp || 0)) {
                this.applyRemoteData(remoteData.users);
                console.log('数据已从服务器更新');
            } else if (localData.timestamp > remoteData.timestamp) {
                await window.auth.saveUsers(localData.users, localData.timestamp);
                console.log('本地数据已同步到服务器');
            }
            
            this.lastSyncTime = Date.now();
            this.updateSyncStatus();
        } catch (error) {
            console.error('同步失败:', error);
            this.showSyncError(error.message);
        } finally {
            this.isSyncing = false;
        }
    }

    applyRemoteData(users) {
        const currentUser = localStorage.getItem('currentUser');
        const remoteUser = users.find(u => u.username === currentUser);
        
        if (remoteUser) {
            localStorage.setItem('userData', JSON.stringify({
                ...remoteUser.data,
                timestamp: Date.now()
            }));
        }
    }

    updateSyncStatus() {
        const statusEl = document.getElementById('sync-status');
        if (statusEl) {
            statusEl.innerHTML = `
                最后同步：${new Date(this.lastSyncTime).toLocaleTimeString()}
                ${this.isSyncing ? '🔄 同步中...' : '✅'}
            `;
        }
    }

    showSyncError(msg) {
        const errorEl = document.getElementById('sync-error');
        if (errorEl) {
            errorEl.textContent = `同步错误: ${msg}`;
            setTimeout(() => errorEl.textContent = '', 5000);
        }
    }

    start() {
        setInterval(() => this.autoSync(), this.syncInterval);
        window.addEventListener('beforeunload', () => this.autoSync());
        this.autoSync(); // 初始立即同步
    }
}

// 初始化
const syncManager = new SyncManager();
document.addEventListener('DOMContentLoaded', () => syncManager.start());
