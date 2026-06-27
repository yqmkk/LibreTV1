const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
const dbPath = path.join(__dirname, '../data/progress.db');
const db = new sqlite3.Database(dbPath);

// 初始化数据表：播放进度、历史记录、收藏
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT UNIQUE,
    title TEXT,
    position REAL,
    duration REAL,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT,
    title TEXT,
    cover TEXT,
    watch_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS star (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT UNIQUE,
    title TEXT,
    cover TEXT
  )`);
});

// 1. 保存播放进度接口
app.post('/api/saveProgress', (req, res) => {
  const { url, title, position, duration } = req.body;
  db.run(`INSERT OR REPLACE INTO progress (url, title, position, duration) VALUES (?,?,?,?)`,
    [url, title, position, duration], err => {
      if(err) return res.status(500).json({err});
      res.json({code:0});
    })
});

// 2. 获取单条进度
app.get('/api/getProgress', (req, res) => {
  const url = req.query.url;
  db.get(`SELECT * FROM progress WHERE url=?`, [url], (err, row) => {
    res.json(row || {position:0});
  })
});

// 3. 写入观看历史
app.post('/api/addHistory', (req, res) => {
  const {url, title, cover} = req.body;
  db.run(`INSERT INTO history (url,title,cover) VALUES (?,?,?)`,[url,title,cover],err=>{
    res.json({code:0});
  })
});

// 4. 获取全部历史
app.get('/api/getHistory', (req,res)=>{
  db.all(`SELECT * FROM history ORDER BY watch_time DESC LIMIT 100`,(err,rows)=>{
    res.json(rows);
  })
});

// 5. 收藏/取消收藏
app.post('/api/star', (req,res)=>{
  const {url,title,cover,status} = req.body;
  if(status){
    db.run(`INSERT OR REPLACE INTO star (url,title,cover) VALUES (?,?,?)`,[url,title,cover]);
  }else{
    db.run(`DELETE FROM star WHERE url=?`,[url]);
  }
  res.json({code:0});
});

// 6. 获取收藏列表
app.get('/api/getStar',(req,res)=>{
  db.all(`SELECT * FROM star`,(err,rows)=>res.json(rows));
});

// 静态前端页面托管（原LibreTV打包产物）
app.use('/', express.static(path.join(__dirname, '../dist')));

const PORT = 8080;
app.listen(PORT, ()=>{
  console.log(`后端服务运行端口${PORT}`);
})
