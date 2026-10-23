const express = require('express');
const router = express.Router();
const pool = require('../db');

// 获取全部 SOS 列表
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT s.id, s.user_id, s.name, s.phone, s.blood_type AS bloodType,
              s.latitude, s.longitude,
              s.address, s.description, s.emergency_level AS level,
              s.status, s.assigned_rescuer_id AS assignedRescuerId,
              u.name AS assignedRescuerName,
              s.emergency_category AS category, s.notes, s.image_url AS imageUrl,
              DATE_FORMAT(s.created_at, '%Y-%m-%d %H:%i:%s') AS time
       FROM sos_records s
       LEFT JOIN users u ON s.assigned_rescuer_id = u.id
       ORDER BY s.created_at DESC`
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('获取SOS列表失败:', err);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 发布求救
router.post('/', async (req, res) => {
  try {
    const { name, phone, bloodType, latitude, longitude, address, description, level, category, notes, imageUrl } = req.body;

    // 根据手机号查找真实用户ID
    let userId = null;
    if (phone && phone !== '无') {
      const [userRows] = await pool.query('SELECT id FROM users WHERE phone = ?', [phone]);
      if (userRows.length > 0) {
        userId = userRows[0].id;
      }
    }
    // 如果找不到用户，默认使用管理员 ID = 1
    if (!userId) {
      userId = 1;
    }

    const [result] = await pool.query(
      `INSERT INTO sos_records (user_id, name, phone, blood_type, latitude, longitude, address, description,
        emergency_level, emergency_category, status, notes, image_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '待救援', ?, ?)`,
      [userId, name, phone, bloodType || '未知', latitude, longitude, address || '', description || '',
        level || '一般', category || '受困', notes || '', imageUrl || null]
    );

    const [rows] = await pool.query(
      `SELECT s.id, s.user_id, s.name, s.phone, s.blood_type AS bloodType,
              s.latitude, s.longitude,
              s.address, s.description, s.emergency_level AS level,
              s.status, s.assigned_rescuer_id AS assignedRescuerId,
              s.emergency_category AS category, s.notes, s.image_url AS imageUrl,
              DATE_FORMAT(s.created_at, '%Y-%m-%d %H:%i:%s') AS time
       FROM sos_records s WHERE s.id = ?`,
      [result.insertId]
    );

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('发布求救失败:', err);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 更新求救（指派救援人员、更新状态等）
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assignedRescuerId, notes } = req.body;

    const updates = [];
    const params = [];

    if (status) {
      updates.push('status = ?');
      params.push(status);
    }
    if (assignedRescuerId !== undefined) {
      updates.push('assigned_rescuer_id = ?');
      params.push(assignedRescuerId || null);
    }
    if (notes !== undefined) {
      updates.push('notes = ?');
      params.push(notes);
    }

    if (updates.length > 0) {
      params.push(id);
      await pool.query(`UPDATE sos_records SET ${updates.join(', ')} WHERE id = ?`, params);
    }

    res.json({ success: true });
  } catch (err) {
    console.error('更新求救失败:', err);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

module.exports = router;