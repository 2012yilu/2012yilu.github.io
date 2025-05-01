// Firebase 配置
const firebaseConfig = {
  apiKey: "AIzaSyBSoEWyffAmwAf_QACrSMzmA3o3Ekja5VE",
  authDomain: "my-chat-66148.firebaseapp.com",
  projectId: "my-chat-66148",
  storageBucket: "my-chat-66148.firebasestorage.app",
  messagingSenderId: "545613708614",
  appId: "1:545613708614:web:06425354932c6fcc853947",
  measurementId: "G-W8EQRN8YEP"
};

// 初始化 Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();
const storage = firebase.storage();

// 全局变量
let currentUser = null;
let currentChat = null;
let currentView = 'friends';
let previousView = 'friends';

// DOM 加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 检查用户登录状态
    auth.onAuthStateChanged(user => {
        if (user) {
            // 用户已登录
            currentUser = user;
            setupUser(user.uid);
            $('#authModal').modal('hide');
            $('#mainApp').removeClass('d-none');
            showView('friends');
        } else {
            // 用户未登录
            $('#authModal').modal({backdrop: 'static', keyboard: false});
            $('#mainApp').addClass('d-none');
        }
    });
    
    // 头像上传处理
    document.getElementById('avatarUpload').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            uploadAvatar(file);
        }
    });
});

// 登录函数
function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // 登录成功
            console.log("登录成功");
        })
        .catch((error) => {
            alert("登录失败: " + error.message);
        });
}

// 注册函数
function register() {
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const bio = document.getElementById('registerBio').value;
    
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // 注册成功，保存用户信息
            const user = userCredential.user;
            return database.ref('users/' + user.uid).set({
                name: name,
                email: email,
                bio: bio,
                createdAt: firebase.database.ServerValue.TIMESTAMP
            });
        })
        .then(() => {
            console.log("注册成功");
        })
        .catch((error) => {
            alert("注册失败: " + error.message);
        });
}

// 退出登录
function logout() {
    auth.signOut().then(() => {
        currentUser = null;
        currentChat = null;
        $('#mainApp').addClass('d-none');
        $('#authModal').modal({backdrop: 'static', keyboard: false});
    });
}

// 设置用户信息
function setupUser(uid) {
    // 加载用户信息
    database.ref('users/' + uid).on('value', (snapshot) => {
        const userData = snapshot.val();
        if (userData) {
            // 更新侧边栏信息
            document.getElementById('sidebarUsername').textContent = userData.name;
            if (userData.avatar) {
                document.getElementById('sidebarAvatar').src = userData.avatar;
                document.getElementById('profileAvatar').src = userData.avatar;
            }
            
            // 更新个人中心表单
            document.getElementById('profileName').value = userData.name || '';
            document.getElementById('profileBio').value = userData.bio || '';
        }
    });
    
    // 加载好友列表
    loadFriendsList(uid);
    
    // 加载聊天室列表
    loadChatRoomsList(uid);
    
    // 加载好友请求
    loadFriendRequests(uid);
}

// 加载好友列表
function loadFriendsList(uid) {
    database.ref('friends/' + uid).on('value', (snapshot) => {
        const friendsList = document.getElementById('friendsList');
        friendsList.innerHTML = '';
        
        const friends = snapshot.val();
        if (friends) {
            Object.keys(friends).forEach(friendId => {
                database.ref('users/' + friendId).once('value').then(friendSnapshot => {
                    const friendData = friendSnapshot.val();
                    if (friendData) {
                        const friendItem = document.createElement('button');
                        friendItem.className = 'list-group-item list-group-item-action d-flex align-items-center';
                        friendItem.innerHTML = `
                            <img src="${friendData.avatar || 'images/default-avatar.jpg'}" class="rounded-circle me-3 avatar">
                            <div>
                                <h6 class="mb-0">${friendData.name}</h6>
                                <small class="text-muted">${friendData.bio || '暂无简介'}</small>
                            </div>
                        `;
                        friendItem.onclick = () => startPrivateChat(friendId, friendData.name, friendData.avatar);
                        friendsList.appendChild(friendItem);
                    }
                });
            });
        } else {
            friendsList.innerHTML = '<div class="p-3 text-center text-muted">暂无好友</div>';
        }
    });
}

// 加载聊天室列表
function loadChatRoomsList(uid) {
    database.ref('chatRooms').orderByChild('members/' + uid).equalTo(true).on('value', (snapshot) => {
        const chatRoomsList = document.getElementById('chatRoomsList');
        chatRoomsList.innerHTML = '';
        
        const rooms = snapshot.val();
        if (rooms) {
            Object.keys(rooms).forEach(roomId => {
                const room = rooms[roomId];
                const roomItem = document.createElement('button');
                roomItem.className = 'list-group-item list-group-item-action d-flex align-items-center';
                roomItem.innerHTML = `
                    <div class="rounded-circle me-3 bg-primary text-white d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                        <i class="fas fa-users"></i>
                    </div>
                    <div>
                        <h6 class="mb-0">${room.name}</h6>
                        <small class="text-muted">${Object.keys(room.members || {}).length} 成员</small>
                    </div>
                `;
                roomItem.onclick = () => startRoomChat(roomId, room.name);
                chatRoomsList.appendChild(roomItem);
            });
        } else {
            chatRoomsList.innerHTML = '<div class="p-3 text-center text-muted">暂无聊天室</div>';
        }
    });
}

// 加载好友请求
function loadFriendRequests(uid) {
    // 收到的好友请求
    database.ref('friendRequests').orderByChild('to').equalTo(uid).on('value', (snapshot) => {
        const receivedRequestsList = document.getElementById('receivedRequestsList');
        receivedRequestsList.innerHTML = '';
        
        const requests = snapshot.val();
        if (requests) {
            Object.keys(requests).forEach(requestId => {
                const request = requests[requestId];
                if (request.status === 'pending') {
                    database.ref('users/' + request.from).once('value').then(userSnapshot => {
                        const userData = userSnapshot.val();
                        if (userData) {
                            const requestItem = document.createElement('div');
                            requestItem.className = 'list-group-item d-flex justify-content-between align-items-center';
                            requestItem.innerHTML = `
                                <div class="d-flex align-items-center">
                                    <img src="${userData.avatar || 'images/default-avatar.jpg'}" class="rounded-circle me-3 avatar">
                                    <div>
                                        <h6 class="mb-0">${userData.name}</h6>
                                        <small class="text-muted">${userData.bio || '暂无简介'}</small>
                                    </div>
                                </div>
                                <div>
                                    <button class="btn btn-sm btn-success me-2" onclick="acceptFriendRequest('${requestId}', '${request.from}')">接受</button>
                                    <button class="btn btn-sm btn-danger" onclick="rejectFriendRequest('${requestId}')">拒绝</button>
                                </div>
                            `;
                            receivedRequestsList.appendChild(requestItem);
                        }
                    });
                }
            });
        }
        
        if (receivedRequestsList.innerHTML === '') {
            receivedRequestsList.innerHTML = '<div class="text-center text-muted p-2">暂无收到的好友请求</div>';
        }
    });
    
    // 发送的好友请求
    database.ref('friendRequests').orderByChild('from').equalTo(uid).on('value', (snapshot) => {
        const sentRequestsList = document.getElementById('sentRequestsList');
        sentRequestsList.innerHTML = '';
        
        const requests = snapshot.val();
        if (requests) {
            Object.keys(requests).forEach(requestId => {
                const request = requests[requestId];
                database.ref('users/' + request.to).once('value').then(userSnapshot => {
                    const userData = userSnapshot.val();
                    if (userData) {
                        const requestItem = document.createElement('div');
                        requestItem.className = 'list-group-item d-flex justify-content-between align-items-center';
                        requestItem.innerHTML = `
                            <div class="d-flex align-items-center">
                                <img src="${userData.avatar || 'images/default-avatar.jpg'}" class="rounded-circle me-3 avatar">
                                <div>
                                    <h6 class="mb-0">${userData.name}</h6>
                                    <small class="text-muted">${userData.bio || '暂无简介'}</small>
                                </div>
                            </div>
                            <div>
                                <span class="badge bg-${request.status === 'pending' ? 'warning' : request.status === 'accepted' ? 'success' : 'danger'}">
                                    ${request.status === 'pending' ? '等待中' : request.status === 'accepted' ? '已接受' : '已拒绝'}
                                </span>
                            </div>
                        `;
                        sentRequestsList.appendChild(requestItem);
                    }
                });
            });
        }
        
        if (sentRequestsList.innerHTML === '') {
            sentRequestsList.innerHTML = '<div class="text-center text-muted p-2">暂无发送的好友请求</div>';
        }
    });
}

// 显示添加好友模态框
function showAddFriendModal() {
    document.getElementById('searchUser').value = '';
    document.getElementById('searchResults').innerHTML = '';
    $('#addFriendModal').modal('show');
    
    // 搜索用户
    document.getElementById('searchUser').addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        if (searchTerm.length < 2) {
            document.getElementById('searchResults').innerHTML = '';
            return;
        }
        
        database.ref('users').once('value').then(snapshot => {
            const users = snapshot.val();
            const searchResults = document.getElementById('searchResults');
            searchResults.innerHTML = '';
            
            if (users) {
                Object.keys(users).forEach(uid => {
                    const user = users[uid];
                    if (uid !== currentUser.uid && 
                        (user.name.toLowerCase().includes(searchTerm) || 
                        user.email.toLowerCase().includes(searchTerm)) {
                        
                        // 检查是否已经是好友
                        database.ref('friends/' + currentUser.uid + '/' + uid).once('value').then(friendSnapshot => {
                            const isFriend = friendSnapshot.exists();
                            
                            // 检查是否已经发送过请求
                            database.ref('friendRequests').orderByChild('from').equalTo(currentUser.uid).once('value').then(requestsSnapshot => {
                                let hasSentRequest = false;
                                const requests = requestsSnapshot.val();
                                if (requests) {
                                    Object.values(requests).forEach(request => {
                                        if (request.to === uid) {
                                            hasSentRequest = true;
                                        }
                                    });
                                }
                                
                                if (!isFriend && !hasSentRequest) {
                                    const userItem = document.createElement('button');
                                    userItem.className = 'list-group-item list-group-item-action d-flex justify-content-between align-items-center';
                                    userItem.innerHTML = `
                                        <div class="d-flex align-items-center">
                                            <img src="${user.avatar || 'images/default-avatar.jpg'}" class="rounded-circle me-3 avatar">
                                            <div>
                                                <h6 class="mb-0">${user.name}</h6>
                                                <small class="text-muted">${user.bio || '暂无简介'}</small>
                                            </div>
                                        </div>
                                        <button class="btn btn-sm btn-primary" onclick="sendFriendRequest('${uid}')">添加</button>
                                    `;
                                    searchResults.appendChild(userItem);
                                }
                            });
                        });
                    }
                });
            }
            
            if (searchResults.innerHTML === '') {
                searchResults.innerHTML = '<div class="text-center text-muted p-2">未找到匹配的用户</div>';
            }
        });
    });
}

// 发送好友请求
function sendFriendRequest(toUid) {
    const requestRef = database.ref('friendRequests').push();
    requestRef.set({
        from: currentUser.uid,
        to: toUid,
        status: 'pending',
        timestamp: firebase.database.ServerValue.TIMESTAMP
    }).then(() => {
        alert('好友请求已发送');
        $('#addFriendModal').modal('hide');
    });
}

// 接受好友请求
function acceptFriendRequest(requestId, fromUid) {
    // 更新请求状态
    database.ref('friendRequests/' + requestId).update({
        status: 'accepted'
    }).then(() => {
        // 互相添加为好友
        const updates = {};
        updates['friends/' + currentUser.uid + '/' + fromUid] = true;
        updates['friends/' + fromUid + '/' + currentUser.uid] = true;
        
        return database.ref().update(updates);
    }).then(() => {
        alert('已添加好友');
    });
}

// 拒绝好友请求
function rejectFriendRequest(requestId) {
    database.ref('friendRequests/' + requestId).update({
        status: 'rejected'
    }).then(() => {
        alert('已拒绝好友请求');
    });
}

// 显示创建聊天室模态框
function showCreateRoomModal() {
    document.getElementById('roomName').value = '';
    const friendsToInvite = document.getElementById('friendsToInvite');
    friendsToInvite.innerHTML = '';
    
    // 加载好友列表
    database.ref('friends/' + currentUser.uid).once('value').then(snapshot => {
        const friends = snapshot.val();
        if (friends) {
            Object.keys(friends).forEach(friendId => {
                database.ref('users/' + friendId).once('value').then(friendSnapshot => {
                    const friendData = friendSnapshot.val();
                    if (friendData) {
                        const friendItem = document.createElement('div');
                        friendItem.className = 'form-check mb-2';
                        friendItem.innerHTML = `
                            <input class="form-check-input" type="checkbox" value="${friendId}" id="invite-${friendId}">
                            <label class="form-check-label d-flex align-items-center" for="invite-${friendId}">
                                <img src="${friendData.avatar || 'images/default-avatar.jpg'}" class="rounded-circle me-2 avatar-sm">
                                ${friendData.name}
                            </label>
                        `;
                        friendsToInvite.appendChild(friendItem);
                    }
                });
            });
        } else {
            friendsToInvite.innerHTML = '<div class="text-muted p-2">暂无好友可以邀请</div>';
        }
    });
    
    $('#createRoomModal').modal('show');
}

// 创建聊天室
function createChatRoom() {
    const roomName = document.getElementById('roomName').value;
    if (!roomName) {
        alert('请输入聊天室名称');
        return;
    }
    
    // 获取选中的好友
    const checkboxes = document.querySelectorAll('#friendsToInvite input[type="checkbox"]:checked');
    const members = {};
    members[currentUser.uid] = true; // 添加自己
    
    checkboxes.forEach(checkbox => {
        members[checkbox.value] = true;
    });
    
    // 创建聊天室
    const roomRef = database.ref('chatRooms').push();
    roomRef.set({
        name: roomName,
        owner: currentUser.uid,
