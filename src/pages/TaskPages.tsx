import { useState, useEffect, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Check, AlertCircle, Trash2, Calendar, Inbox, ChevronLeft, Clock, X, MoreVertical } from 'lucide-react';

import Header from '../Component/Header';

type DueDate = 'overdue' | 'today' | 'tomorrow' | 'upcoming' | 'inbox' | null;

interface Task {
  id: number;
  text: string;
  done: boolean;
  due: DueDate;
  priority: 'high' | null;
  createdAt: string;
  scheduledTime?: string;
  duration?: number;
}

interface TaskGroup {
  key: DueDate | 'done';
  title: string;
  icon: React.ReactNode;
  tasks: Task[];
  showWhenEmpty?: boolean;
}

const TaskPages: React.FC = () => {
  const [showScheduleModal, setShowScheduleModal] = useState<boolean>(false);
  const [scheduleDate, setScheduleDate] = useState<DueDate>('today');
  const [scheduleTime, setScheduleTime] = useState<string>('14:00');
  const [scheduleDuration, setScheduleDuration] = useState<number>(30);
  const [activeTaskMenu, setActiveTaskMenu] = useState<number | null>(null);

  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [quickAddText, setQuickAddText] = useState<string>('');
  const [quickAddSection, setQuickAddSection] = useState<DueDate>('inbox');

  const createTask = (
    text: string,
    due: DueDate,
    time?: string,
    duration?: number
  ): void => {
    const newTask: Task = {
      id: Date.now(),
      text: text.replace(/\bat\s*(\d{1,2}:?\d{0,2})\s*(am|pm)?\b/i, '').trim(),
      done: false,
      due: due,
      priority: text.includes('!high')? 'high' : null,
      createdAt: new Date().toISOString(),
      scheduledTime: time,
      duration: duration,
    };
    setTasks(prev => [newTask,...prev]);
  };

  useEffect(() => {
    const saved = localStorage.getItem('tasks');
    if (saved) {
      const parsed: Task[] = JSON.parse(saved);
      const updated = parsed.map(t => {
        if (!t.done && t.due === 'today' && new Date(t.createdAt).toDateString()!== new Date().toDateString()) {
          return {...t, due: 'overdue' as DueDate };
        }
        return t;
      });
      setTasks(updated);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleQuickAdd = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && quickAddText.trim()) {
      const timeRegex = /\bat\s*(\d{1,2}:?\d{0,2})\s*(am|pm)?\b/i;
      if (timeRegex.test(quickAddText)) {
        setShowScheduleModal(true);
        return;
      }
      createTask(quickAddText.trim(), quickAddSection);
      setQuickAddText('');
    }
  };

  const handleScheduleSubmit = (): void => {
    if (quickAddText.trim()) {
      createTask(quickAddText.trim(), scheduleDate, scheduleTime, scheduleDuration);
      setQuickAddText('');
      setShowScheduleModal(false);
      setScheduleTime('14:00');
      setScheduleDuration(30);
    }
  };

  const toggleTask = (id: number): void => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id? {...task, done:!task.done } : task
      )
    );
  };

  const deleteTask = (id: number): void => {
    setTasks(prev => prev.filter(task => task.id!== id));
  };

  const moveTask = (id: number, newDue: DueDate): void => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id? {...task, due: newDue } : task
      )
    );
    setActiveTaskMenu(null);
  };

  const taskGroups: TaskGroup[] = [
    {
      key: 'overdue',
      title: 'Overdue',
      icon: <AlertCircle className="w-4 h-4 text-red-500" />,
      tasks: tasks.filter(t =>!t.done && t.due === 'overdue'),
    },
    {
      key: 'today',
      title: 'Today',
      icon: <Clock className="w-4 h-4 text-yellow-500" />,
      tasks: tasks.filter(t =>!t.done && t.due === 'today'),
      showWhenEmpty: true,
    },
    {
      key: 'tomorrow',
      title: 'Tomorrow',
      icon: <Calendar className="w-4 h-4 text-blue-500" />,
      tasks: tasks.filter(t =>!t.done && t.due === 'tomorrow'),
    },
    {
      key: 'upcoming',
      title: 'Upcoming',
      icon: <Calendar className="w-4 h-4 text-zinc-500" />,
      tasks: tasks.filter(t =>!t.done && t.due === 'upcoming'),
    },
    {
      key: 'inbox',
      title: 'Inbox',
      icon: <Inbox className="w-4 h-4 text-zinc-500" />,
      tasks: tasks.filter(t =>!t.done && (t.due === 'inbox' || t.due === null)),
      showWhenEmpty: true,
    },
    {
      key: 'done',
      title: 'Completed',
      icon: <Check className="w-4 h-4 text-green-500" />,
      tasks: tasks.filter(t => t.done).slice(0, 12),
    },
  ];

  const TaskCard: React.FC<{ task: Task }> = ({ task }) => (
    <div className="group relative rounded-lg border border-zinc-800 bg-zinc-950/50 p-4 hover:border-zinc-700 hover:bg-zinc-900/50 transition-all">
      <div className="flex items-start gap-3">
        <button
          onClick={() => toggleTask(task.id)}
          className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
            task.done
             ? 'bg-green-500 border-green-500'
              : 'border-zinc-700 hover:border-green-500'
          }`}
        >
          {task.done && <Check className="w-3 h-3 text-black" />}
        </button>

        <div className="flex-1 min-w-0">
          <p className={`text-sm break-words ${task.done? 'line-through text-zinc-600' : 'text-zinc-200'}`}>
            {task.text}
          </p>

          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {task.priority === 'high' && (
              <span className="text-xs text-red-500 font-medium">!high</span>
            )}
            {task.scheduledTime && (
              <div className="flex items-center gap-1 text-xs text-zinc-500">
                <Clock className="w-3 h-3" />
                {task.scheduledTime} {task.duration && `· ${task.duration}m`}
              </div>
            )}
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setActiveTaskMenu(activeTaskMenu === task.id? null : task.id)}
            className="p-1 hover:bg-zinc-800 rounded text-zinc-600 hover:text-zinc-400"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {activeTaskMenu === task.id && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setActiveTaskMenu(null)}
              />
              <div className="absolute right-0 top-8 z-20 w-40 rounded-lg border border-zinc-800 bg-zinc-900 shadow-lg">
                <div className="p-1">
                  <button
                    onClick={() => moveTask(task.id, 'today')}
                    className="w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 rounded"
                  >
                    Move to Today
                  </button>
                  <button
                    onClick={() => moveTask(task.id, 'tomorrow')}
                    className="w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 rounded"
                  >
                    Move to Tomorrow
                  </button>
                  <button
                    onClick={() => moveTask(task.id, 'inbox')}
                    className="w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 rounded"
                  >
                    Move to Inbox
                  </button>
                  <div className="my-1 border-t border-zinc-800" />
                  <button
                    onClick={() => {
                      deleteTask(task.id);
                      setActiveTaskMenu(null);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-red-500 hover:bg-zinc-800 rounded flex items-center gap-2"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="min-h-screen bg-zinc-950 text-white">
        <Header />
        <div className="max-w-7xl mx-auto p-6 lg:p-8">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-zinc-900 rounded-lg border border-zinc-800"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold">Tasks</h1>
              <p className="text-zinc-500 text-sm mt-1">
                {tasks.filter(t =>!t.done).length} remaining
              </p>
            </div>
          </div>

          {/* Quick Add */}
          <div className="mb-8 rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-zinc-500" />
                <select
                  value={quickAddSection || 'inbox'}
                  onChange={(e) => setQuickAddSection(e.target.value as DueDate)}
                  className="text-xs bg-transparent text-zinc-500 focus:outline-none"
                >
                  <option value="today">Add to Today</option>
                  <option value="tomorrow">Add to Tomorrow</option>
                  <option value="inbox">Add to Inbox</option>
                </select>
              </div>

              <button
                onClick={() => setShowScheduleModal(true)}
                className="text-xs text-zinc-600 hover:text-zinc-400 flex items-center gap-1 px-2 py-1 rounded hover:bg-zinc-900 transition-colors"
              >
                <Calendar className="w-3.5 h-3.5" />
                Schedule
              </button>
            </div>
            <input
              type="text"
              value={quickAddText}
              onChange={(e) => setQuickAddText(e.target.value)}
              onKeyDown={handleQuickAdd}
              placeholder="Add a task... try 'at 3pm' or '!high'"
              className="w-full bg-transparent text-sm placeholder-zinc-600 focus:outline-none"
            />
          </div>

          {/* Task Groups - Grid Layout */}
          <div className="space-y-8">
            {taskGroups.map(group => (
              (group.tasks.length > 0 || group.showWhenEmpty) && (
                <div key={group.key}>
                  <div className="flex items-center gap-2 mb-4">
                    {group.icon}
                    <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">
                      {group.title}
                    </h2>
                    <span className="text-xs text-zinc-600">
                      {group.tasks.length}
                    </span>
                  </div>

                  {group.tasks.length === 0? (
                    <div className="text-sm text-zinc-600 py-8 text-center border border-dashed border-zinc-800 rounded-lg">
                      No tasks in {group.title.toLowerCase()}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {group.tasks.map(task => (
                        <TaskCard key={task.id} task={task} />
                      ))}
                    </div>
                  )}
                </div>
              )
            ))}
          </div>

          {showScheduleModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-950 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Schedule Task</h3>
                  <button
                    onClick={() => setShowScheduleModal(false)}
                    className="p-1 hover:bg-zinc-900 rounded text-zinc-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-zinc-500 mb-1 block">Task</label>
                    <input
                      type="text"
                      value={quickAddText}
                      onChange={(e) => setQuickAddText(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-zinc-700"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-zinc-500 mb-1 block">Date</label>
                      <select
                        value={scheduleDate || 'today'}
                        onChange={(e) => setScheduleDate(e.target.value as DueDate)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none"
                      >
                        <option value="today">Today</option>
                        <option value="tomorrow">Tomorrow</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="inbox">Inbox</option>
                        <option value="overdue">Overdue</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-zinc-500 mb-1 block">Time</label>
                      <input
                        type="time"
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-zinc-500 mb-1 block">Duration</label>
                    <select
                      value={scheduleDuration}
                      onChange={(e) => setScheduleDuration(Number(e.target.value))}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none"
                    >
                      <option value={15}>15 min</option>
                      <option value={30}>30 min</option>
                      <option value={60}>1 hour</option>
                      <option value={90}>1.5 hours</option>
                    </select>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => setShowScheduleModal(false)}
                      className="flex-1 px-4 py-2 rounded-lg border border-zinc-800 text-sm hover:bg-zinc-900"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleScheduleSubmit}
                      className="flex-1 px-4 py-2 rounded-lg bg-white text-black text-sm font-medium hover:bg-zinc-200"
                    >
                      Schedule Task
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TaskPages;
