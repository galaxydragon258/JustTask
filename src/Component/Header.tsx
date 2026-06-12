import { Menu, X, User, Settings, LogOut, Home, ListCheck } from 'lucide-react';
import { Link,useNavigate } from 'react-router-dom'
import { useState } from 'react'

function Header() {
    const navigate = useNavigate();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const navItems = [
        { name: 'Dashboard', icon: Home, Link: '/dashboard' },
        { name: 'Settings', icon: Settings, Link: '/' },
        {name:'Task Page', icon: ListCheck, Link: '/taskpages'}

    ];

    const handleLogoClick = () => {
        navigate('/');
    };

    return (
        <header className="sticky top-0 z-50 bg-black/70 backdrop-blur-lg border-b border-zinc-800">
            <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2"
                        onClick={handleLogoClick}
                        >
                            <img
                                className='h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 bg-white 
                            rounded-lg object-contain'
                                src='/logo.png'
                            />
                            <span className="text-xl font-bold">App</span>
                        </div>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center gap-6">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.Link}
                                    className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                                >
                                    <item.icon size={16} />
                                    {item.name}
                                </Link>
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
                            <Link
                                key={item.name}
                                to={item.Link}
                                className="flex items-center gap-3 px-2 py-2 text-sm font-medium text-zinc-400 rounded-lg hover:bg-zinc-900 hover:text-white"
                            >
                                <item.icon size={18} />
                                {item.name}
                            </Link>
                        ))}
                    </div>
                )}
            </nav>
        </header>
    )
}

export default Header