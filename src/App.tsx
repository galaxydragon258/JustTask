import React, { useState, useEffect } from 'react';
import { Menu, X, User, Settings, LogOut, Home, Check } from 'lucide-react';

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [tasks, setTasks] = useState([
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

  const navItems = [
    { name: 'Dashboard', icon: Home, href: '#' },
    { name: 'Settings', icon: Settings, href: '#' },
  ];


  const toggleTask = (id: number) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, done: !task.done } : task
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 rounded-lg bg-white animate-pulse mx-auto mb-4"></div>
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
      {/* Personalized Nav */}
      <header className="sticky top-0 z-50 bg-black/70 backdrop-blur-lg border-b border-zinc-800">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-white -hidden">
                  <img
                    src="/logo.png"
                    alt="App Logo"
                    className="h-full w-full object-cover"
                  />
                </div>                <span className="text-xl font-bold">App</span>
              </div>

              {/* Desktop Nav */}
              <div className="hidden md:flex items-center gap-6">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                  >
                    <item.icon size={16} />
                    {item.name}
                  </a>
                ))}
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-full bg-zinc-900 p-1.5 pr-3 hover:bg-zinc-800 transition-colors"
                >
                  <div className="h-7 w-7 rounded-full bg-zinc-700 flex items-center justify-center">
                    <User size={16} className="text-zinc-300" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium">You</span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-lg bg-zinc-950 shadow-lg border border-zinc-800 py-1">
                    <a href="#" className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-900">
                      <User size={16} />
                      Profile
                    </a>
                    <a href="#" className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-900">
                      <Settings size={16} />
                      Settings
                    </a>
                    <hr className="my-1 border-zinc-800" />
                    <a href="#" className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-900">
                      <LogOut size={16} />
                      Sign out
                    </a>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden text-zinc-400 hover:text-white"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-1 border-t border-zinc-800">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-2 py-2 text-sm font-medium text-zinc-400 rounded-lg hover:bg-zinc-900 hover:text-white"
                >
                  <item.icon size={18} />
                  {item.name}
                </a>
              ))}
            </div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="mt-2 text-zinc-400">Here's what's happening today.</p>
        </div>

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Good afternoon</h1>
            <p className="mt-1 text-zinc-400">You have 3 tasks left today.</p>
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
                      <div className={`h-5 w-5 rounded border-2 flex items-center justify-center transition-colors ${task.done
                        ? 'bg-white border-white'
                        : 'border-zinc-600 group-hover:border-zinc-500'
                        }`}>
                        {task.done && <Check size={14} className="text-black" />}
                      </div>
                      <span className={`text-sm transition-colors ${task.done
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
                    <p className="text-2xl font-bold">5</p>
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



      </main>
    </div>
  );
}