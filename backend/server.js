const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors()); // อนุญาตให้ React ดึงข้อมูลข้าม Port ได้
app.use(express.json()); // ให้ API รับข้อมูลเป็น JSON ได้

// ตั้งค่าการเชื่อมต่อฐานข้อมูล (ค่า Default ของ XAMPP)
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // ถ้า XAMPP ไม่ได้ตั้งรหัสผ่าน ให้เว้นว่างไว้
    database: 'react_crud_db'
});

db.connect((err) => {
    if (err) throw err;
    console.log('✅ Connected to MySQL Database');
});

// ================= API ROUTES =================

// READ: ดึงข้อมูลทั้งหมด
app.get('/users', (req, res) => {
    db.query("SELECT * FROM users", (err, results) => {
        if (err)
            return res.status(500).json(err);
        res.json(results);
    });
});

// CREATE: เพิ่มข้อมูลใหม่
app.post('/users/add', (req, res) => {
    const { name, email } = req.body;
    db.query("INSERT INTO users (name, email) VALUES (?, ?)", [name, email], (err, results) => {
        if (err)
            return res.status(500).json(err);
        res.json({ message: "เพิ่มข้อมูลสำเร็จ", id: results.insertId });
    });
});

// UPDATE: แก้ไขข้อมูล
app.put('/users/:id', (req, res) => {
    const { name, email } = req.body;
    const { id } = req.params;
    db.query("UPDATE users SET name = ?, email = ? WHERE id = ?", [name, email, id], (err, results) => {
        if (err)
            return res.status(500).json(err);
        res.json({ message: "อัปเดตข้อมูลสำเร็จ" });
    });
});

// DELETE: ลบข้อมูล
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM users WHERE id = ?", [id], (err, results) => {
        if (err)
            return res.status(500).json(err);
        res.json({ message: "ลบข้อมูลสำเร็จ" });
    });
});

// สตาร์ท Server ที่ Port 5000
app.listen(5000, () => {
    console.log('🚀 Server is running on port 5000');
});