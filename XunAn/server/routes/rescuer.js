const express = require('express');
const router = express.Router();
const pool = require('../db');

// 获取救援人员列表（含实时位置和状态）
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.id, u.name, u.phone, IFNULL(ri.status, '空闲') AS status,
              IFNULL(ri.latitude, 0) AS latitude, IFNULL(ri.longitude, 0) AS longitude
       FROM users u
       INNER JOIN user_roles ur ON u.id = ur.user_id AND ur.role_code = 'rescuer'
       LEFT JOIN rescuer_info ri ON u.id = ri.user_id
       WHERE u.is_active = 1`
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('获取救援人员列表失败:', err);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 指派救援人员（将救援人员派往 SOS）
router.post('/assign', async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { sosId, rescuerId } = req.body;
    if (!sosId || !rescuerId) {
      return res.status(400).json({ success: false, message: '参数不完整' });
    }

    await conn.beginTransaction();

    // 更新 SOS 状态为"救援中"，记录指派救援人员
    await conn.query(
      'UPDATE sos_records SET status = ?, assigned_rescuer_id = ? WHERE id = ?',
      ['救援中', rescuerId, sosId]
    );

    // 更新救援人员状态为"任务中"
    await conn.query('UPDATE rescuer_info SET status = ? WHERE user_id = ?', ['任务中', rescuerId]);

    // 创建任务记录
    await conn.query(
      'INSERT INTO rescue_tasks (sos_id, rescuer_id, assign_time, task_status) VALUES (?, ?, NOW(), ?)',
      [sosId, rescuerId, '进行中']
    );

    await conn.commit();
    res.json({ success: true, message: '指派成功' });
  } catch (err) {
    await conn.rollback();
    console.error('指派失败:', err);
    res.status(500).json({ success: false, message: '服务器错误' });
  } finally {
    conn.release();
  }
});

// 完成任务
router.post('/complete', async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { sosId } = req.body;
    if (!sosId) {
      return res.status(400).json({ success: false, message: '参数不完整' });
    }

    await conn.beginTransaction();

    // 获取当前 SOS 信息
    const [sosRows] = await conn.query(
      'SELECT assigned_rescuer_id FROM sos_records WHERE id = ?', [sosId]
    );

    if (sosRows.length === 0) {
      await conn.rollback();
      return res.status(404).json({ success: false, message: 'SOS记录不存在' });
    }

    const rescuerId = sosRows[0].assigned_rescuer_id;

    // 更新 SOS 状态为"已完成"
    await conn.query('UPDATE sos_records SET status = ? WHERE id = ?', ['已完成', sosId]);

    // 恢复救援人员状态为"空闲"
    if (rescuerId) {
      await conn.query('UPDATE rescuer_info SET status = ? WHERE user_id = ?', ['空闲', rescuerId]);
    }

    // 更新任务记录
    await conn.query(
      'UPDATE rescue_tasks SET complete_time = NOW(), task_status = ? WHERE sos_id = ? AND task_status = ?',
      ['已完成', sosId, '进行中']
    );

    await conn.commit();
    res.json({ success: true, message: '任务完成' });
  } catch (err) {
    await conn.rollback();
    console.error('完成任务失败:', err);
    res.status(500).json({ success: false, message: '服务器错误' });
  } finally {
    conn.release();
  }
});

module.exports = router;
