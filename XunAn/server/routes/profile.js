const express = require('express');
const router = express.Router();
const pool = require('../db');

// 数据库角色编码到前端角色编码的映射
const DB_TO_FRONTEND = {
  'user': 'citizen',
  'admin': 'command',
  'rescuer': 'rescuer'
};

function dbRoleToFrontend(role) {
  return DB_TO_FRONTEND[role] || role;
}

// 根据手机号获取用户信息
router.get('/:phone', async (req, res) => {
  try {
    const { phone } = req.params;

    const [rows] = await pool.query(
      'SELECT id, phone, name, password, unit, avatar_url FROM users WHERE phone = ? AND is_active = 1',
      [phone]
    );

    if (rows.length === 0) {
      return res.json({ success: false, message: '用户不存在' });
    }

    const user = rows[0];
    const [roles] = await pool.query(
      'SELECT role_code FROM user_roles WHERE user_id = ?',
      [user.id]
    );

    res.json({
      success: true,
      user: {
        phone: user.phone,
        name: user.name,
        password: user.password,
        unit: user.unit,
        avatarUrl: user.avatar_url,
        roles: roles.map(r => dbRoleToFrontend(r.role_code))
      }
    });
  } catch (err) {
    console.error('获取用户信息失败:', err);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 修改个人信息
router.put('/:phone', async (req, res) => {
  try {
    const { phone } = req.params;
    const { name, password, unit, newPhone, avatarUrl } = req.body;

    // 检查用户是否存在
    const [existing] = await pool.query('SELECT id FROM users WHERE phone = ?', [phone]);
    if (existing.length === 0) {
      return res.json({ success: false, message: '用户不存在' });
    }

    const updates = [];
    const params = [];

    // 修改手机号
    if (newPhone) {
      const [phoneExists] = await pool.query('SELECT id FROM users WHERE phone = ? AND phone != ?', [newPhone, phone]);
      if (phoneExists.length > 0) {
        return res.json({ success: false, message: '该手机号已被注册' });
      }
      updates.push('phone = ?');
      params.push(newPhone);
    }

    if (name) { updates.push('name = ?'); params.push(name); }
    if (password) { updates.push('password = ?'); params.push(password); }
    if (unit !== undefined) { updates.push('unit = ?'); params.push(unit); }
    if (avatarUrl !== undefined) { updates.push('avatar_url = ?'); params.push(avatarUrl); }

    if (updates.length > 0) {
      params.push(phone);
      await pool.query(`UPDATE users SET ${updates.join(', ')} WHERE phone = ?`, params);
    }

    res.json({ success: true, message: '修改成功', newPhone: newPhone || phone });
  } catch (err) {
    console.error('修改个人信息失败:', err);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

module.exports = router;
