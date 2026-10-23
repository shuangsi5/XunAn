const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 确保 uploads 目录存在
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 限制 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('只允许上传图片文件'));
    }
  }
});

// 单张图片上传（multipart 方式）
router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: '没有上传文件' });
  }
  const url = `http://42.121.114.11:3000/uploads/${req.file.filename}`;
  res.json({ success: true, url, filename: req.file.filename });
});

// Base64 图片上传（供 HarmonyOS 前端使用）
router.post('/base64', express.json({ limit: '15mb' }), (req, res) => {
  try {
    const { image, filename } = req.body;
    if (!image || typeof image !== 'string') {
      return res.status(400).json({ success: false, message: '缺少图片 Base64 数据' });
    }

    const buffer = Buffer.from(image, 'base64');
    if (buffer.length === 0) {
      return res.status(400).json({ success: false, message: '图片数据无效' });
    }

    const ext = path.extname(filename || '') || '.jpg';
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
    const filePath = path.join(uploadDir, uniqueName);
    fs.writeFileSync(filePath, buffer);

    const url = `http://42.121.114.11:3000/uploads/${uniqueName}`;
    res.json({ success: true, url, filename: uniqueName });
  } catch (err) {
    console.error('Base64 上传失败:', err);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

module.exports = router;
