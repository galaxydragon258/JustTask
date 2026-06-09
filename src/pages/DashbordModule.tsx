import { useState, useEffect,type KeyboardEvent } from 'react';
import { Plus, Check, AlertCircle, Trash2, Play, Pause, RotateCcw, Clock, Inbox } from 'lucide-react';
import Header from '../Component/Header';

interface Task {
    id: number;
    text: string;
    done: boolean;
    due: 'today' | 'tomorrow' | 'overdue' | 'inbox';
    priority: 'high' | null;
}

interface InboxItem {
    id: number;
    text: string;
}

interface UpNextItem {
    id: number;
    text: string;
    time: string;
}

export default function Dashboard() {
    const [quickAddText, setQuickAddText] = useState<string>('');
    const [todayTasks, setTodayTasks] = useState<Task[]>([
        { id: 1, text: 'Ship App v1.0', done: false, due: 'today', priority: 'high' },
        { id: 2, text: 'Review notes', done: true, due: 'today', priority: null },
        { id: 3, text: 'Gym', done: false, due: 'overdue', priority: null },
    ]);
    const [inbox, setInbox] = useState<InboxItem[]>([
        { id: 4, text: 'Buy coffee beans' },
        { id: 5, text: 'Call mom' },
    ]);
    const [upNext] = useState<UpNextItem[]>([
        { id: 1, text: 'Team standup', time: '2:00 PM' },
        { id: 2, text: 'Design review', time: '4:30 PM' },
    ]);
    const [focusTask, setFocusTask] = useState<Task | null>(null);
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [time, setTime] = useState<number>(25 * 60);
    const [streak, setStreak] = useState<number>(12);

    // Timer
    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | null = null;
        if (isRunning && time > 0) {
            interval = setInterval(() => setTime(t => t - 1), 1000);
        } else if (time === 0) {
            setIsRunning(false);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isRunning, time]);

    const completedToday = todayTasks.filter(t => t.done).length;
    const weekComplete = todayTasks.length > 0
        ? Math.round((completedToday / todayTasks.length) * 100)
        : 0;

    const handleQuickAdd = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && quickAddText.trim()) {
            const newTask: Task = {
                id: Date.now(),
                text: quickAddText,
                done: false,
                due: quickAddText.includes('tomorrow') ? 'tomorrow' : 'today',
                priority: quickAddText.includes('!high') ? 'high' : null
            };
            setTodayTasks([newTask, ...todayTasks]);
            setQuickAddText('');
        }
    };

    const toggleTask = (id: number) => {
        setTodayTasks(todayTasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
    };

    const deleteTask = (id: number) => {
        setTodayTasks(todayTasks.filter(t => t.id !== id));
    };

    const startFocus = (task: Task) => {
        setFocusTask(task);
        setTime(25 * 60);
        setIsRunning(true);
    };

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const moveInboxToTasks = (item: InboxItem) => {
        const newTask: Task = { ...item, done: false, due: 'today', priority: null };
        setTodayTasks([newTask, ...todayTasks]);
        setInbox(inbox.filter(i => i.id !== item.id));
    };

    return (
        <div className="min-h-screen bg-black text-zinc-100 antialiased">
            <Header />
            {/* Dashboard Content */}
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid lg:grid-cols-3 gap-6">

                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Quick Add */}
                        <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
                            <div className="flex items-center gap-3">
                                <Plus size={20} className="text-zinc-500" />
                                <input
                                    type="text"
                                    value={quickAddText}
                                    onChange={(e) => setQuickAddText(e.target.value)}
                                    onKeyDown={handleQuickAdd}
                                    placeholder="Add task... try 'tomorrow' or '!high'"
                                    className="w-full bg-transparent outline-none text-zinc-100 placeholder:text-zinc-500 text-sm"
                                />
                            </div>
                        </div>

                        {/* Today */}
                        <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-semibold">Today</h2>
                                <span className="text-sm text-zinc-500">{todayTasks.filter(t => !t.done).length} left</span>
                            </div>
                            <div className="space-y-2">
                                {todayTasks.slice(0, 7).map((task) => (
                                    <div key={task.id} className="group flex items-center gap-3 rounded-lg border border-zinc-800 bg-black p-3 hover:border-zinc-700">
                                        <button onClick={() => toggleTask(task.id)} className={`h-5 w-5 rounded border-2 flex items-center justify-center transition-colors ${task.done ? 'bg-white border-white' : 'border-zinc-600 hover:border-zinc-500'}`}>
                                            {task.done && <Check size={14} className="text-black" />}
                                        </button>
                                        <span className={`text-sm flex-1 ${task.done ? 'text-zinc-500 line-through' : 'text-zinc-200'}`}>
                                            {task.text}
                                        </span>
                                        {task.due === 'overdue' && <AlertCircle size={16} className="text-red-500" />}
                                        {task.priority === 'high' && <span className="text-xs text-red-400">!high</span>}
                                        <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-500 transition-opacity">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                                {todayTasks.length === 0 && <p className="text-sm text-zinc-600 text-center py-4">All clear 🎉</p>}
                            </div>
                        </div>

                        {/* Focus */}
                        <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-6">
                            <h2 className="font-semibold mb-4">Focus</h2>
                            {focusTask ? (
                                <div className="space-y-6">
                                    <p className="text-lg text-zinc-100">{focusTask.text}</p>
                                    <div className="text-center py-4">
                                        <p className="text-5xl font-mono font-bold text-white">{formatTime(time)}</p>
                                    </div>
                                    <div className="flex items-center justify-center gap-3">
                                        <button onClick={() => setIsRunning(!isRunning)} className="flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-black hover:bg-zinc-200">
                                            {isRunning ? <Pause size={16} /> : <Play size={16} />}
                                            {isRunning ? 'Pause' : 'Start'}
                                        </button>
                                        <button onClick={() => setTime(25 * 60)} className="rounded-lg border border-zinc-800 bg-black p-2.5 text-zinc-400 hover:bg-zinc-900">
                                            <RotateCcw size={16} />
                                        </button>
                                        <button onClick={() => { setFocusTask(null); setIsRunning(false); }} className="text-sm text-zinc-500 hover:text-zinc-300">Exit</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <p className="text-zinc-500 mb-4 text-sm">Select a task to focus</p>
                                    <div className="space-y-2 max-w-sm mx-auto">
                                        {todayTasks.filter(t => !t.done).map((task) => (
                                            <button key={task.id} onClick={() => startFocus(task)} className="w-full rounded-lg border border-zinc-800 bg-black p-3 text-left text-sm text-zinc-300 hover:border-zinc-700">
                                                {task.text}
                                            </button>
                                        ))}
                                        {todayTasks.filter(t => !t.done).length === 0 && <p className="text-sm text-zinc-600">All done for today 🎉</p>}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">

                        {/* Stats */}
                        <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-6">
                            <h2 className="font-semibold mb-4">Stats</h2>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-3xl font-bold text-white">{completedToday}</p>
                                    <p className="text-sm text-zinc-500">Tasks done today</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-white">{streak}</p>
                                    <p className="text-sm text-zinc-500">Day streak</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-white">{weekComplete}%</p>
                                    <p className="text-sm text-zinc-500">Week complete</p>
                                </div>
                            </div>
                        </div>

                        {/* Up Next */}
                        <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Clock size={18} className="text-zinc-500" />
                                <h2 className="font-semibold">Up Next</h2>
                            </div>
                            <div className="space-y-3">
                                {upNext.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between text-sm">
                                        <span className="text-zinc-300">{item.text}</span>
                                        <span className="text-zinc-500">{item.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Inbox */}
                        <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Inbox size={18} className="text-zinc-500" />
                                <h2 className="font-semibold">Inbox</h2>
                                <span className="text-xs text-zinc-500">{inbox.length}</span>
                            </div>
                            <div className="space-y-2">
                                {inbox.map((item) => (
                                    <button key={item.id} onClick={() => moveInboxToTasks(item)} className="w-full text-left rounded-lg border border-zinc-800 bg-black p-3 text-sm text-zinc-400 hover:border-zinc-700 hover:text-zinc-200">
                                        {item.text}
                                    </button>
                                ))}
                                {inbox.length === 0 && <p className="text-sm text-zinc-600 text-center py-2">Empty</p>}
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}