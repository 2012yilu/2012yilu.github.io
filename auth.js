// Supabase 配置（替换为你的项目密钥）
const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_KEY = 'YOUR_ANON_KEY';

// 初始化 Supabase 客户端
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 切换表单显示
function showRegister() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
}
function showLogin() {
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
}

// 注册用户
async function register() {
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    // 密码加密（简单示例，实际应用应使用 bcrypt）
    const encryptedPassword = btoa(password); 

    const { data, error } = await supabase
        .from('users')
        .insert([{ email, password: encryptedPassword }]);

    if (error) {
        alert('注册失败: ' + error.message);
    } else {
        alert('注册成功！请登录');
        showLogin();
    }
}

// 登录用户
async function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const encryptedPassword = btoa(password);

    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password', encryptedPassword);

    if (error || data.length === 0) {
        alert('登录失败: 邮箱或密码错误');
    } else {
        localStorage.setItem('user_email', email);
        window.location.href = 'success.html';
    }
}
