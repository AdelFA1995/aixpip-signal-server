const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json()); // اضافه کردن برای خواندن JSON در POST

const port = process.env.PORT || 3000;
const filePath = './LiveSignal.csv';

// GET: دریافت آخرین ۵ سیگنال
app.get('/signal', (req, res) => {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const lines = raw.trim().split('\n');
    const last5Lines = lines.slice(-5);
    const data = last5Lines.map(line => {
      const [symbol, entry, tp, sl, time, type] = line.split(',');
      return { symbol, entry, tp, sl, time, type };
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Signal file not found or invalid format' });
  }
});

// POST: دریافت سیگنال از MT5 و ذخیره در فایل
app.post('/signal', (req, res) => {
  const { symbol, entry, tp, sl, time, type } = req.body;

  if (!symbol || !entry || !tp || !sl || !time || !type) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const newLine = `${symbol},${entry},${tp},${sl},${time},${type}\n`;

  try {
    fs.appendFileSync(filePath, newLine);
    res.json({ success: true, message: 'Signal saved' });
  } catch (err) {
    res.status(500).json({ error: 'Could not write to file' });
  }
});

// فقط یک بار اجرا
app.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
});
