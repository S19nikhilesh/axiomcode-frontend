import React, { useEffect, useState } from 'react';
import { LogOut, User as UserIcon, Sun, Moon } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

const Navbar = ({ activeTab, setActiveTab, user, handleLogout }) => {
  // Global theme state handler
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const navigate = useNavigate();

  useEffect(() => {
    // HTML element par attribute update call lagaya
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <nav className={`navbar px-4 md:px-12 sticky top-0 z-50 flex justify-between transition-all duration-200 ${
        activeTab === 'about'
          ? 'bg-zinc-950/60 backdrop-blur-md border-b border-zinc-800/40 text-white'
          : 'bg-base-100 border-b border-base-content/10 shadow-sm text-base-content'
      }`}
    >
      {/* Logo & Tabs Left Wrapper */}
      <div className="flex items-center gap-2"> 
        <NavLink to="/" className="text-2xl font-bold tracking-tighter text-primary">
          Axiom
          <span className={`text-lg font-light italic transition-colors ${
            activeTab === 'about' ? 'text-zinc-200' : 'text-base-content'
          }`}>
            Code
          </span>
        </NavLink>
      </div>

      {/* Tabs Section */}
      <div className="hidden md:flex items-center gap-8 ml-24 font-medium text-sm flex-1">
        {/* 1. ABOUT TAB */}
        <span 
          onClick={() => {
            setActiveTab('about');
            navigate('/'); 
          }}
          className={`cursor-pointer transition-colors pb-1 ${
            activeTab === 'about' 
              ? 'text-primary font-bold border-b-2 border-primary' 
              : 'text-base-content/70 hover:text-base-content'
          }`}
        >
          About
        </span>

        {/* 2. PROBLEMS TAB */}
        <span 
          onClick={() => {
            setActiveTab('problems');
            navigate('/'); 
          }}
          className={`cursor-pointer transition-colors pb-1 ${
            activeTab === 'problems' 
              ? 'text-primary font-bold border-b-2 border-primary' 
              : activeTab === 'about' ? 'text-zinc-400 hover:text-zinc-100' : 'text-base-content/70 hover:text-base-content'
          }`}
        >
          Problems
        </span>

        {/* 3. CONTEST TAB - (🎯 Fixed: nClick Typo Fixed to onClick) */}
        <Link 
          to="/contest"
          onClick={() => setActiveTab('contest')}
          className={`cursor-pointer transition-colors pb-1 ${
            activeTab === 'contest' 
              ? 'text-primary font-bold border-b-2 border-primary' 
              : activeTab === 'about' ? 'text-zinc-400 hover:text-zinc-100' : 'text-base-content/70 hover:text-base-content'
          }`}
        >
          Contest
        </Link>

        
        <Link 
          to="/potd"
          onClick={() => setActiveTab('potd')}
          className={`cursor-pointer transition-colors pb-1 ${
            activeTab === 'potd' 
              ? 'text-primary font-bold border-b-2 border-primary' 
              : activeTab === 'about' ? 'text-zinc-400 hover:text-zinc-100' : 'text-base-content/70 hover:text-base-content'
          }`}
        >
          POTD
        </Link>
      </div>

     
      <div className="flex items-center gap-4">
        
        
        {activeTab !== 'about' && (
          <button 
            onClick={toggleTheme}
            className="btn btn-ghost btn-circle btn-sm transition-colors text-base-content/70 hover:text-base-content"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        )}

        {user?.role === 'admin' && (
          <div className="list-none">
            <NavLink 
              to="/admin" 
              className={({ isActive }) => 
                `btn btn-ghost btn-sm md:btn-md border border-primary/30 hover:border-primary hover:bg-primary/10 ${isActive ? 'bg-primary/20 border-primary' : ''}`
              }
            >
              Admin
            </NavLink>
          </div>
        )}

        <div className="flex-none gap-2">
          {user ? (
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar border border-primary/20">
                <div className={`w-10 rounded-full flex items-center justify-center transition-colors ${
                  activeTab === 'about' ? 'bg-zinc-800 text-zinc-100' : 'bg-base-200 text-base-content'
                }`}>
                  <UserIcon size={20} />
                </div>
              </label>
              
              <ul tabIndex={0} className={`mt-3 z-[100] p-2 shadow-xl menu menu-sm dropdown-content rounded-xl w-52 border ${
    activeTab === 'about'
      ? 'bg-zinc-900/95 backdrop-blur-md border-zinc-800 text-zinc-200'
      : 'bg-base-100 border-base-content/10 text-base-content'
  }`}>
    {/* Safe navigation lagaya taaki user guest ho toh handle ho jaye */}
    <li className="menu-title text-primary font-bold">Hello, {user?.firstName || 'Coder'}</li>
    
    <li className="my-0.5">
      <Link 
        to="/profile" 
        onClick={() => setActiveTab && setActiveTab('profile')}
        className={`font-semibold py-2 ${activeTab === 'profile' ? 'text-primary font-bold' : ''}`}
      >
        <user size={16} /> My Profile
      </Link>
    </li>
    
    <li className="mt-1 pt-1 border-t border-base-content/5">
      <button onClick={handleLogout} className="text-error font-semibold flex items-center gap-2">
        <LogOut size={16}/> Logout
      </button>
    </li>
</ul>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="btn btn-primary btn-sm">Login</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;