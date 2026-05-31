import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '' });
  const [editId, setEditId] = useState(null);

  const API_URL = 'http://localhost:5000/users';

  // โหลดข้อมูลเมื่อ Component ถูกสร้าง
  useEffect(() => {
    fetchUsers();
  }, []);

  // ดึงข้อมูล
  async function fetchUsers() {
    try {
      const response = await axios.get(API_URL);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // จัดการเมื่อพิมพ์ในฟอร์ม
  // ...form คือเอาค่าเดิมมา
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // บันทึกข้อมูล (เพิ่ม/แก้ไข)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        // Update
        await axios.put(`${API_URL}/${editId}`, form);
        setEditId(null);
      } else {
        // Create
        await axios.post(`${API_URL}/add`, form);
      }
      setForm({ name: '', email: '' });
      fetchUsers(); // รีเฟรชข้อมูลหลังบันทึก
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  // ลบข้อมูล
  const handleDelete = async (id) => {
    if (window.confirm("คุณต้องการลบข้อมูลนี้หรือไม่?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchUsers();
      } catch (error) {
        console.error("Error deleting data:", error);
      }
    }
  };

  // เตรียมข้อมูลสำหรับแก้ไข
  const handleEdit = (user) => {
    setForm({ name: user.name, email: user.email });
    setEditId(user.id);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>React + Node.js CRUD System</h2>

      {/* ฟอร์มกรอกข้อมูล */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          name="name"
          placeholder="ชื่อ-นามสกุล"
          value={form.name}
          onChange={handleChange}
          required
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <input
          type="email"
          name="email"
          placeholder="อีเมล"
          value={form.email}
          onChange={handleChange}
          required
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <button type="submit">{editId ? 'อัปเดตข้อมูล' : 'เพิ่มข้อมูล'}</button>
      </form>

      {/* ตารางแสดงข้อมูล */}
      <table border="1" cellPadding="10" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <button onClick={() => handleEdit(user)} style={{ marginRight: '5px' }}>แก้ไข</button>
                <button onClick={() => handleDelete(user.id)}>ลบ</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;