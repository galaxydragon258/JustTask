import  { useState, useEffect } from 'react';
import Header from '../Component/Header';
import { Check } from 'lucide-react';

interface Task {
  id: number;
  text: string;
  done: boolean;
}

function LandingPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: 'Ship App v1.0', done: false },
    { id: 2, text: 'Review notes', done: false },
    { id: 3, text: 'Gym', done: true },
  ]);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const toggleTask = (id: number): void => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, done: !task.done } : task
    ));
  };

  const tasksLeft = tasks.filter(task => !task.done).length;
  const tasksDone = tasks.filter(task => task.done).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <img 
            className="h-12 w-12 rounded-lg bg-white animate-pulse mx-auto mb-4"
            src="/logo.png"
            alt="Loading"
          />
          <div className="flex gap-1 justify-center">
            <span className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="h-2 w-2 bg-white rounded-full animate-bounce"></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100 antialiased">
      <Header />
      
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Good afternoon</h1>
          <p className="mt-1 text-zinc-400">You have {tasksLeft} tasks left today.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column - Main stuff */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Add */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
              <input
                type="text"
                placeholder="Add a task..."
                className="w-full bg-transparent outline-none text-zinc-100 placeholder:text-zinc-500"
              />
            </div>

            {/* Today */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-6">
              <h2 className="font-semibold mb-4">Today</h2>
              <div className="space-y-2">
                {tasks.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className="w-full flex items-center gap-3 rounded-lg border border-zinc-800 bg-black p-3 text-left hover:border-zinc-700 hover:bg-zinc-900/50 transition-all group"
                  >
                    <div className={`h-5 w-5 rounded border-2 flex items-center justify-center transition-colors ${
                      task.done
                        ? 'bg-white border-white'
                        : 'border-zinc-600 group-hover:border-zinc-500'
                    }`}>
                      {task.done && <Check size={14} className="text-black" />}
                    </div>
                    <span className={`text-sm transition-colors ${
                      task.done
                        ? 'text-zinc-500 line-through'
                        : 'text-zinc-200'
                    }`}>
                      {task.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right column - Stats/Extras */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-6">
              <h2 className="font-semibold mb-4">Stats</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-2xl font-bold">{tasksDone}</p>
                  <p className="text-xs text-zinc-500">Tasks done today</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-xs text-zinc-500">Day streak</p>
                </div>
              </div>
            </div>

            {/* Focus */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-6">
              <h2 className="font-semibold mb-2">Focus</h2>
              <p className="text-sm text-zinc-400 mb-4">No task selected</p>
              <button className="w-full rounded-lg bg-white text-black py-2 text-sm font-medium hover:bg-zinc-200">
                Start session
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default LandingPage;
