const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');
const sosRoutes = require('./routes/sos');
const rescuerRoutes = require('./routes/rescuer');
const profileRoutes = require('./routes/profile');
const uploadRoutes = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 静态文件托管（上传的图片可以直接访问）
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/sos', sosRoutes);
app.use('/api/rescuers', rescuerRoutes);
app.use('/api/user', profileRoutes);
app.use('/api/upload', uploadRoutes);

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`汛安后端服务已启动: http://localhost:${PORT}`);
});
