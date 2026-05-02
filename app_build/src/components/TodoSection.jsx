import { useState, useEffect } from 'react'
import { Plus, Trash2, CheckCircle2, Circle, Flag, Clock, CalendarDays, Filter, ArrowUpDown } from 'lucide-react'

const PRIORITY_CONFIG = {
  urgent: { label: 'Urgent', color: '#DC2626', bg: '#FEE2E2' },
  high: { label: 'High', color: '#EA580C', bg: '#FFEDD5' },
  medium: { label: 'Medium', color: '#D97706', bg: '#FEF3C7' },
  low: { label: 'Low', color: '#16A34A', bg: '#DCFCE7' },
}

function loadTodos() {
  try { return JSON.parse(localStorage.getItem('daypilot_todos') || '[]') }
  catch { return [] }
}

export default function TodoSection() {
  const [todos, setTodos] = useState(loadTodos)
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('medium')
  const [dueDate, setDueDate] = useState('')
  const [dueTime, setDueTime] = useState('')
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')

  useEffect(() => { localStorage.setItem('daypilot_todos', JSON.stringify(todos)) }, [todos])

  const addTodo = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    setTodos(prev => [...prev, {
      id: Date.now(),
      title: title.trim(),
      priority,
      dueDate: dueDate || null,
      dueTime: dueTime || null,
      completed: false,
      createdAt: new Date().toISOString()
    }])
    setTitle(''); setDueDate(''); setDueTime('')
  }

  const toggleTodo = (id) => setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  const deleteTodo = (id) => setTodos(prev => prev.filter(t => t.id !== id))

  const filtered = todos
    .filter(t => filter === 'all' ? true : filter === 'active' ? !t.completed : t.completed)
    .sort((a, b) => {
      if (sortBy === 'priority') {
        const order = { urgent: 0, high: 1, medium: 2, low: 3 }
        return order[a.priority] - order[b.priority]
      }
      return (a.dueDate || '9999') < (b.dueDate || '9999') ? -1 : 1
    })

  const counts = { all: todos.length, active: todos.filter(t => !t.completed).length, completed: todos.filter(t => t.completed).length }

  return (
    <div className="todo-section">
      <div className="todo-header">
        <h2 className="section-title"><ListTodo size={22} strokeWidth={1.8} className="section-icon" /> My Tasks</h2>
        <span className="task-count">{counts.active} active</span>
      </div>

      <form className="todo-form" onSubmit={addTodo}>
        <div className="todo-form-row">
          <input className="todo-input" type="text" placeholder="Add a new task..." value={title} onChange={e => setTitle(e.target.value)} required />
          <button className="todo-add-btn" type="submit"><Plus size={18} /> Add</button>
        </div>
        <div className="todo-form-meta">
          <div className="meta-group">
            <Flag size={14} />
            <select value={priority} onChange={e => setPriority(e.target.value)} className="meta-select">
              {Object.entries(PRIORITY_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
          <div className="meta-group">
            <CalendarDays size={14} />
            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="meta-input" />
          </div>
          <div className="meta-group">
            <Clock size={14} />
            <input type="time" value={dueTime} onChange={e => setDueTime(e.target.value)} className="meta-input" />
          </div>
        </div>
      </form>

      <div className="todo-toolbar">
        <div className="filter-group">
          <Filter size={14} />
          {['all', 'active', 'completed'].map(f => (
            <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})
            </button>
          ))}
        </div>
        <button className="sort-btn" onClick={() => setSortBy(s => s === 'date' ? 'priority' : 'date')}>
          <ArrowUpDown size={14} /> {sortBy === 'date' ? 'By Date' : 'By Priority'}
        </button>
      </div>

      <div className="todo-list">
        {filtered.length === 0 && (
          <div className="todo-empty">
            <CheckCircle2 size={40} strokeWidth={1} />
            <p>{filter === 'completed' ? 'No completed tasks yet' : filter === 'active' ? 'All tasks completed!' : 'No tasks yet. Add one above!'}</p>
          </div>
        )}
        {filtered.map(todo => {
          const p = PRIORITY_CONFIG[todo.priority]
          const isOverdue = todo.dueDate && !todo.completed && new Date(todo.dueDate) < new Date(new Date().toDateString())
          return (
            <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`}>
              <button className="todo-check" onClick={() => toggleTodo(todo.id)}>
                {todo.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
              </button>
              <div className="todo-content">
                <span className="todo-title">{todo.title}</span>
                <div className="todo-meta-row">
                  <span className="priority-pill" style={{ background: p.bg, color: p.color }}>{p.label}</span>
                  {todo.dueDate && <span className={`due-pill ${isOverdue ? 'overdue' : ''}`}><CalendarDays size={12} /> {todo.dueDate}</span>}
                  {todo.dueTime && <span className="time-pill"><Clock size={12} /> {todo.dueTime}</span>}
                </div>
              </div>
              <button className="todo-delete" onClick={() => deleteTodo(todo.id)}><Trash2 size={16} /></button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ListTodo(props) {
  return <svg xmlns="http://www.w3.org/2000/svg" width={props.size||24} height={props.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth||2} strokeLinecap="round" strokeLinejoin="round" className={props.className}><rect x="3" y="5" width="6" height="6" rx="1"/><path d="m3 17 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/></svg>
}
