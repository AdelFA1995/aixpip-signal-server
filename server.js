const cors = require('cors');
app.use(cors());
const express = require('express');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

// مسیر فایل CSV
const filePath = './LiveSignal.csv';

app.get('/signal', (req, res) => {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const lines = raw.trim().split('\n');

    // فقط ۵ خط آخر
    const last5Lines = lines.slice(-5);

    // تبدیل هر خط به یک آبجکت JSON
    const data = last5Lines.map(line => {
      const [symbol, entry, tp, sl, time] = line.split(',');
      return { symbol, entry, tp, sl, time };
    });

    res.json(data); // خروجی نهایی JSON
  } catch (err) {
    res.status(500).json({ error: 'Signal file not found or invalid format' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
