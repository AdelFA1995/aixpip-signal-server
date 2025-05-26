const express = require('express');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

// مسیر فایل سیگنال خروجی از MT5
const filePath = './LiveSignal.csv';

app.get('/signal', (req, res) => {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const lines = raw.trim().split('\n');
    const lastLine = lines[lines.length - 1];
    const [symbol, entry, tp, sl, time] = lastLine.split(',');

    res.json({ symbol, entry, tp, sl, time });
  } catch (err) {
    res.status(500).json({ error: 'Signal file not found or invalid format' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
