require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

// 允许跨域请求（仅限你的前端域名）
app.use(cors({
  origin: 'https://2012yilu.github.io' // 替换为你的前端域名
}));

// 解析 JSON 请求体
app.use(express.json());

// 处理 GitHub OAuth 回调的 code
app.post('/api/github-oauth', async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: '缺少授权码 (code)' });
  }

  try {
    // 向 GitHub 请求 access_token
    const response = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID || 'YOUR_CLIENT_ID',      // 从环境变量读取
        client_secret: process.env.GITHUB_CLIENT_SECRET || 'YOUR_CLIENT_SECRET', // 从环境变量读取
        code,
        redirect_uri: process.env.GITHUB_REDIRECT_URI || 'YOUR_REDIRECT_URI'
      },
      {
        headers: { Accept: 'application/json' }
      }
    );

    const { access_token, error } = response.data;

    if (error) {
      throw new Error(error);
    }

    // 返回 token 给前端（实际项目中可能还需要验证用户信息）
    res.json({ token: access_token });

  } catch (error) {
    console.error('GitHub OAuth 错误:', error.message);
    res.status(500).json({ error: '获取 GitHub Token 失败', details: error.message });
  }
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`后端服务运行在 http://localhost:${PORT}`);
});
