import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const headers = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/tasks', headers);
      setTasks(data);
    } catch (err) {
      console.error(err);
    }
  };

  const addTask = async () => {
    if (!title.trim()) return alert('Please enter a task title!');
    try {
      await axios.post('http://localhost:5000/api/tasks',
        { title, description, priority, dueDate },
        headers
      );
      setTitle(''); setDescription(''); setPriority('medium'); setDueDate('');
      setShowForm(false);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${id}`, { status }, headers);
      fetchTasks();
    } catch (err) { console.error(err); }
  };

  const deleteTask = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, headers);
      fetchTasks();
    } catch (err) { console.error(err); }
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const priorityColor = (p) => {
    if (p === 'high') return { bg: '#fff0f0', color: '#c0392b', border: '#e74c3c' };
    if (p === 'medium') return { bg: '#fffbf0', color: '#e67e22', border: '#f39c12' };
    return { bg: '#f0fff4', color: '#27ae60', border: '#2ecc71' };
  };

  const statusColor = (s) => {
    if (s === 'done') return { bg: '#f0fff4', color: '#27ae60' };
    if (s === 'in-progress') return { bg: '#f0f4ff', color: '#2980b9' };
    return { bg: '#f8f9fa', color: '#7f8c8d' };
  };

  const isOverdue = (dueDate, status) => {
    if (!dueDate || status === 'done') return false;
    return new Date(dueDate) < new Date();
  };

  const filteredTasks = tasks.filter(task => {
    const matchFilter = filter === 'all' || task.status === filter;
    const matchSearch = task.title.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const counts = {
    all: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    'in-progress': tasks.filter(t => t.status === 'in-progress').length,
    done: tasks.filter(t => t.status === 'done').length,
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
        padding: '16px 32px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.15)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36, background: 'rgba(255,255,255,0.2)',
            borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20
          }}>✓</div>
          <div>
            <h1 style={{ color: 'white', fontSize: 20, margin: 0 }}>Task Manager</h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, margin: 0 }}>
              {counts.all} total · {counts.done} completed
            </p>
          </div>
        </div>
        <button onClick={logout} style={{
          background: 'rgba(255,255,255,0.15)', color: 'white',
          border: '1px solid rgba(255,255,255,0.3)', borderRadius: 8,
          padding: '8px 18px', cursor: 'pointer', fontSize: 14
        }}>Logout</button>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 16px' }}>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'Total', count: counts.all, color: '#4f46e5', bg: '#eef2ff' },
            { label: 'To Do', count: counts.todo, color: '#7f8c8d', bg: '#f8f9fa' },
            { label: 'In Progress', count: counts['in-progress'], color: '#2980b9', bg: '#f0f4ff' },
            { label: 'Done', count: counts.done, color: '#27ae60', bg: '#f0fff4' },
          ].map(s => (
            <div key={s.label} style={{
              background: s.bg, borderRadius: 12, padding: '16px',
              textAlign: 'center', border: `1px solid ${s.color}22`
            }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{s.count}</div>
              <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Search and Filter */}
        <div style={{
          background: 'white', borderRadius: 12, padding: 16,
          marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
        }}>
          <input
            placeholder="Search tasks..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '10px 14px', borderRadius: 8,
              border: '1px solid #e0e0e0', fontSize: 14, marginBottom: 12,
              boxSizing: 'border-box'
            }}
          />
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['all', 'todo', 'in-progress', 'done'].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: '6px 16px', borderRadius: 20, fontSize: 13, cursor: 'pointer',
                background: filter === f ? '#4f46e5' : '#f0f2f5',
                color: filter === f ? 'white' : '#555',
                border: 'none', fontWeight: filter === f ? 600 : 400
              }}>
                {f === 'all' ? 'All' : f === 'todo' ? 'To Do' : f === 'in-progress' ? 'In Progress' : 'Done'}
                <span style={{
                  marginLeft: 6, background: filter === f ? 'rgba(255,255,255,0.3)' : '#ddd',
                  borderRadius: 10, padding: '1px 7px', fontSize: 11
                }}>{counts[f]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Add Task Button */}
        <button onClick={() => setShowForm(!showForm)} style={{
          width: '100%', padding: '12px', borderRadius: 12, fontSize: 15,
          background: showForm ? '#f0f2f5' : '#4f46e5', color: showForm ? '#555' : 'white',
          border: 'none', cursor: 'pointer', marginBottom: 16, fontWeight: 600
        }}>
          {showForm ? '✕ Cancel' : '+ Add New Task'}
        </button>

        {/* Add Task Form */}
        {showForm && (
          <div style={{
            background: 'white', borderRadius: 12, padding: 20,
            marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{ margin: '0 0 16px', color: '#333' }}>New Task</h3>
            <input
              placeholder="Task title *"
              value={title}
              onChange={e => setTitle(e.target.value)}
              style={{
                width: '100%', padding: '10px 14px', borderRadius: 8,
                border: '1px solid #e0e0e0', fontSize: 14, marginBottom: 10,
                boxSizing: 'border-box'
              }}
            />
            <textarea
              placeholder="Description (optional)"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              style={{
                width: '100%', padding: '10px 14px', borderRadius: 8,
                border: '1px solid #e0e0e0', fontSize: 14, marginBottom: 10,
                boxSizing: 'border-box', resize: 'vertical'
              }}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
              <div>
                <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 4 }}>Priority</label>
                <select value={priority} onChange={e => setPriority(e.target.value)} style={{
                  width: '100%', padding: '10px', borderRadius: 8,
                  border: '1px solid #e0e0e0', fontSize: 14
                }}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 4 }}>Due Date</label>
                <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} style={{
                  width: '100%', padding: '10px', borderRadius: 8,
                  border: '1px solid #e0e0e0', fontSize: 14, boxSizing: 'border-box'
                }} />
              </div>
            </div>
            <button onClick={addTask} style={{
              width: '100%', padding: '12px', background: '#4f46e5', color: 'white',
              border: 'none', borderRadius: 8, fontSize: 15, cursor: 'pointer', fontWeight: 600
            }}>Add Task</button>
          </div>
        )}

        {/* Task List */}
        {filteredTasks.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '48px 0', color: '#aaa',
            background: 'white', borderRadius: 12
          }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
            <p style={{ fontSize: 16 }}>No tasks found</p>
          </div>
        ) : (
          filteredTasks.map(task => {
            const pc = priorityColor(task.priority);
            const sc = statusColor(task.status);
            const overdue = isOverdue(task.dueDate, task.status);
            return (
              <div key={task._id} style={{
                background: 'white', borderRadius: 12, padding: '16px 20px',
                marginBottom: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                borderLeft: `4px solid ${pc.border}`,
                opacity: task.status === 'done' ? 0.75 : 1
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                      <span style={{
                        fontSize: 15, fontWeight: 600, color: '#222',
                        textDecoration: task.status === 'done' ? 'line-through' : 'none'
                      }}>{task.title}</span>
                      <span style={{
                        fontSize: 11, padding: '2px 8px', borderRadius: 20,
                        background: pc.bg, color: pc.color, fontWeight: 600, textTransform: 'uppercase'
                      }}>{task.priority}</span>
                      {overdue && (
                        <span style={{
                          fontSize: 11, padding: '2px 8px', borderRadius: 20,
                          background: '#fff0f0', color: '#e74c3c', fontWeight: 600
                        }}>OVERDUE</span>
                      )}
                    </div>
                    {task.description && (
                      <p style={{ fontSize: 13, color: '#666', margin: '4px 0' }}>{task.description}</p>
                    )}
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 8, flexWrap: 'wrap' }}>
                      {task.dueDate && (
                        <span style={{ fontSize: 12, color: overdue ? '#e74c3c' : '#888' }}>
                          📅 {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                      <span style={{ fontSize: 12, color: '#888' }}>
                        🕐 {new Date(task.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginLeft: 12 }}>
                    <select
                      value={task.status}
                      onChange={e => updateStatus(task._id, e.target.value)}
                      style={{
                        padding: '6px 10px', borderRadius: 8, fontSize: 12,
                        border: `1px solid ${sc.color}44`,
                        background: sc.bg, color: sc.color, cursor: 'pointer', fontWeight: 600
                      }}>
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                    <button onClick={() => deleteTask(task._id)} style={{
                      background: '#fff0f0', color: '#e74c3c', border: '1px solid #fcc',
                      borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 13
                    }}>Delete</button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}