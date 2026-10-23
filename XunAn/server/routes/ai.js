const express = require('express');
const router = express.Router();

// ===================== DeepSeek AI 对话代理 =====================
// 密钥应优先从环境变量读取，未配置时回退到默认值（生产环境建议改为环境变量）
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || 'sk-21d2ae417a8949438e2236de1b2af7d2';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';
const DEEPSEEK_MODEL = 'deepseek-chat';
// 仅回传最近 N 条上下文，避免请求体过大
const MAX_HISTORY = 20;

const SYSTEM_PROMPT = '你是「汛安」智慧防汛应急救援系统的智能助手，专注于防汛救灾、应急救援、安全避险等场景。' +
  '请用简洁、专业、易懂的中文回答用户问题，帮助群众和救援人员更好地应对洪涝灾害。' +
  '遇到紧急险情时，优先引导用户拨打 110/119/120，或使用系统内的一键求救功能。';

// POST /api/ai/chat
// body: { messages: [{ role: 'user' | 'assistant', content: string }, ...] }
router.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ success: false, message: '消息不能为空' });
    }

    // 只保留 user / assistant 角色，并限制历史长度
    const history = messages
      .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .slice(-MAX_HISTORY)
      .map(m => ({ role: m.role, content: m.content }));

    if (history.length === 0) {
      return res.status(400).json({ success: false, message: '消息内容无效' });
    }

    const payload = {
      model: DEEPSEEK_MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...history
      ],
      temperature: 0.7,
      max_tokens: 2000,
      stream: false
    };

    const resp = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    if (!resp.ok) {
      const errText = await resp.text();
      console.error('DeepSeek API 调用失败:', resp.status, errText);
      return res.status(502).json({ success: false, message: 'AI 服务暂时不可用' });
    }

    const data = await resp.json();
    const content = data && data.choices && data.choices[0] && data.choices[0].message
      ? data.choices[0].message.content
      : '';

    res.json({ success: true, data: { content } });
  } catch (err) {
    console.error('AI 对话异常:', err);
    res.status(500).json({ success: false, message: 'AI 服务异常' });
  }
});

module.exports = router;
