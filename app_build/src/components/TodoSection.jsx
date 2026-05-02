import { useState, useEffect } from 'react'
import { Plus, Trash2, CheckCircle2, Circle, Flag, Clock, CalendarDays, Filter, ArrowUpDown } from 'lucide-react'

const PRIORITY_CONFIG = {
  urgent: { label: 'Urgent', class: 'priority-urgent' },
  high: { label: 'High', class: 'priority-high' },
  medium: { label: 'Medium', class: 'priority-medium' },
  low: { label: 'Low', class: 'priority-low' },
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

  const activeTodos = todos.filter(t => !t.completed)
  const completedTodos = todos.filter(t => t.completed)

  return (
    <div className="todo-section">
      <div className="todo-header">
        <h2 className="section-title"><ListTodo size={24} className="section-icon" /> Dashboard Notes</h2>
      </div>

      <form className="todo-form" onSubmit={addTodo}>
        <div className="todo-form-row">
          <input className="todo-input" type="text" placeholder="Write a new sticky note..." value={title} onChange={e => setTitle(e.target.value)} required />
          <button className="todo-add-btn" type="submit"><Plus size={18} /> Stick It</button>
        </div>
        <div className="todo-form-meta">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Flag size={16} color="var(--text-muted)" />
            <select value={priority} onChange={e => setPriority(e.target.value)} className="meta-select">
              {Object.entries(PRIORITY_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label} Color</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CalendarDays size={16} color="var(--text-muted)" />
            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="meta-input" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={16} color="var(--text-muted)" />
            <input type="time" value={dueTime} onChange={e => setDueTime(e.target.value)} className="meta-input" />
          </div>
        </div>
      </form>

      <div className="todo-list">
        {activeTodos.map(todo => (
          <div key={todo.id} className={`todo-item ${PRIORITY_CONFIG[todo.priority].class}`}>
            <span className="todo-title">{todo.title}</span>
            
            <div className="todo-meta-row">
              {todo.dueDate && <div><CalendarDays size={14} /> {todo.dueDate}</div>}
              {todo.dueTime && <div><Clock size={14} /> {todo.dueTime}</div>}
            </div>

            <div className="todo-actions">
              <button className="todo-check" onClick={() => toggleTodo(todo.id)} title="Mark as done">
                <Circle size={20} />
              </button>
              <button className="todo-delete" onClick={() => deleteTodo(todo.id)} title="Throw away">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
        
        {completedTodos.map(todo => (
          <div key={todo.id} className={`todo-item completed ${PRIORITY_CONFIG[todo.priority].class}`}>
            <span className="todo-title">{todo.title}</span>
            <div className="todo-actions">
              <button className="todo-check" onClick={() => toggleTodo(todo.id)} title="Restore">
                <CheckCircle2 size={20} color="var(--accent-mint)" />
              </button>
              <button className="todo-delete" onClick={() => deleteTodo(todo.id)} title="Throw away">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ListTodo(props) {
  return <svg xmlns="http://www.w3.org/2000/svg" width={props.size||24} height={props.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth||2} strokeLinecap="round" strokeLinejoin="round" className={props.className}><rect x="3" y="5" width="6" height="6" rx="1"/><path d="m3 17 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/></svg>
}
