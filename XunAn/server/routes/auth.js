const express = require('express');
const router = express.Router();
const pool = require('../db');

// 前端角色与数据库角色编码映射
const FRONTEND_TO_DB = {
  'citizen': 'user',
  'command': 'admin',
  'rescuer': 'rescuer'
};

const DB_TO_FRONTEND = {
  'user': 'citizen',
  'admin': 'command',
  'rescuer': 'rescuer'
};

function frontendRoleToDb(role) {
  return FRONTEND_TO_DB[role] || role;
}

function dbRoleToFrontend(role) {
  return DB_TO_FRONTEND[role] || role;
}

// 登录
router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password) {
      return res.status(400).json({ success: false, message: '手机号和密码不能为空' });
    }

    const [rows] = await pool.query(
      'SELECT u.id, u.phone, u.name, u.password, u.unit FROM users u WHERE u.phone = ? AND u.is_active = 1',
      [phone]
    );

    if (rows.length === 0) {
      return res.json({ success: false, message: '手机号或密码错误' });
    }

    const user = rows[0];
    if (user.password !== password) {
      return res.json({ success: false, message: '手机号或密码错误' });
    }

    // 查询用户角色并做编码映射
    const [roles] = await pool.query(
      'SELECT role_code FROM user_roles WHERE user_id = ?',
      [user.id]
    );

    return res.json({
      success: true,
      user: {
        phone: user.phone,
        name: user.name,
        password: user.password,
        unit: user.unit,
        roles: roles.map(r => dbRoleToFrontend(r.role_code))
      }
    });
  } catch (err) {
    console.error('登录失败:', err);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 注册
router.post('/register', async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { phone, name, password, roles, unit } = req.body;
    if (!phone || !name || !password || !roles) {
      return res.status(400).json({ success: false, message: '参数不完整' });
    }

    // roles 必须是数组
    let roleList = Array.isArray(roles) ? roles : [roles];
    if (roleList.length === 0) {
      return res.status(400).json({ success: false, message: '至少选择一个身份' });
    }

    await conn.beginTransaction();

    // 查找或创建用户
    const [existing] = await conn.query('SELECT id FROM users WHERE phone = ?', [phone]);

    let userId;
    if (existing.length > 0) {
      userId = existing[0].id;
      // 更新已有用户信息
      await conn.query('UPDATE users SET name = ?, password = ?, unit = ? WHERE id = ?',
        [name, password, unit || '', userId]);
    } else {
      const [result] = await conn.query(
        'INSERT INTO users (phone, name, password, unit) VALUES (?, ?, ?, ?)',
        [phone, name, password, unit || '']
      );
      userId = result.insertId;
    }

    // 批量添加角色（如已存在则忽略）
    for (const role of roleList) {
      const dbRole = frontendRoleToDb(role);
      try {
        await conn.query('INSERT INTO user_roles (user_id, role_code) VALUES (?, ?)', [userId, dbRole]);
      } catch (e) {
        // 角色已存在，忽略
        if (e.code !== 'ER_DUP_ENTRY') throw e;
      }
    }

    // 如果包含救援人员角色，初始化 rescuer_info
    const dbRoles = roleList.map(r => frontendRoleToDb(r));
    if (dbRoles.includes('rescuer')) {
      try {
        await conn.query(
          'INSERT INTO rescuer_info (user_id, status, latitude, longitude) VALUES (?, ?, ?, ?)',
          [userId, '空闲', 0, 0]
        );
      } catch (e) {
        if (e.code !== 'ER_DUP_ENTRY') throw e;
      }
    }

    await conn.commit();
    res.json({ success: true, message: '注册成功' });
  } catch (err) {
    await conn.rollback();
    console.error('注册失败:', err);
    res.status(500).json({ success: false, message: '服务器错误' });
  } finally {
    conn.release();
  }
});

module.exports = router;
