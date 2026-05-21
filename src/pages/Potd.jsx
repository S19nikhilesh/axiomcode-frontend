import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Trophy, Calendar, Code, CheckCircle2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import axiosClient from '../utils/axiosClient';
import { useSelector } from 'react-redux';

const Potd = ({  activeTab, setActiveTab }) => {
    const [problem, setProblem] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useSelector((state) => state.auth);
    // 🎯 Ab local state ki jagah hum direct Redux/Props wale user se read karenge
    // Agar user logged in hai toh uska status dikhega, nahi toh default false (guest ke liye)
    const hasSolvedToday = user?.hasSolvedToday || false;
  
    useEffect(() => {
      if (setActiveTab) {
        setActiveTab('potd');
      }
    }, [setActiveTab]);
  
    useEffect(() => {
      const fetchPOTD = async () => {
        try {
    
          const response = await axiosClient.get('/problem/problemoftheday');
          setProblem(response.data);
        } catch (err) {
          console.error("Error fetching POTD", err);
        } finally {
          setLoading(false);
        }
      };
      fetchPOTD();
    }, []); 
  
    if (loading) {
      return (
        <div className="min-h-[80vh] flex items-center justify-center bg-base-100">
          <span className="loading loading-ring loading-lg text-primary"></span>
        </div>
      );
    }
  
    if (!problem) {
      return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center bg-base-100 p-6 text-center">
          <h2 className="text-xl font-bold text-base-content/80">No POTD Available Today</h2>
          <p className="text-sm text-base-content/60 mt-1">Admin hasn't assigned a challenge yet. Check back later!</p>
        </div>
      );
    }
  
    return (
      <>
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} user={user} />
        
        <div className="min-h-[85vh] bg-base-100 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* TOP METRICS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Streak Card */}
              <div className="p-5 rounded-2xl bg-base-200 border border-base-content/5 flex items-center justify-between shadow-sm">
                <div className="space-y-1">
                  <span className="text-xs font-medium tracking-wider text-base-content/50 uppercase">Current Streak</span>
                  <h3 className="text-3xl font-black text-base-content">{user?.potdStreak || 0} Days</h3>
                </div>
                <div className="p-3 bg-orange-500/10 rounded-xl text-orange-500 animate-pulse">
                  <Flame size={28} fill="currentColor" />
                </div>
              </div>
  
              {/* Verification Card */}
              <div className="p-5 rounded-2xl bg-base-200 border border-base-content/5 flex items-center justify-between shadow-sm">
                <div className="space-y-1">
                  <span className="text-xs font-medium tracking-wider text-base-content/50 uppercase">Today's Status</span>
                  <h3 className="text-2xl font-bold text-base-content">
                    {hasSolvedToday ? "Completed" : "Pending"}
                  </h3>
                </div>
                <div className={`p-3 rounded-xl ${hasSolvedToday ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                  {hasSolvedToday ? <CheckCircle2 size={28} /> : <Trophy size={28} />}
                </div>
              </div>
            </div>
  
            {/* MAIN PROBLEM LAUNCHER CARD */}
            <div className="p-6 sm:p-8 rounded-3xl bg-base-200 border border-base-content/5 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 font-mono text-xs text-base-content/40 flex items-center gap-1.5">
                <Calendar size={14} />
                {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
  
              <div className="space-y-6 max-w-2xl">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="badge badge-primary font-bold tracking-wide">PROBLEM OF THE DAY</span>
                  <span className={`badge uppercase font-bold tracking-wider text-[10px] ${
                    problem.difficulty === 'easy' ? 'badge-success text-white' : 
                    problem.difficulty === 'medium' ? 'badge-warning text-white' : 'badge-error text-white'
                  }`}>
                    {problem.difficulty}
                  </span>
                </div>
  
                <div className="space-y-2">
                  <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-base-content">
                    {problem.title}
                  </h1>
                  <p className="text-base-content/60 text-sm sm:text-base leading-relaxed max-w-xl">
                    {problem.description || "Analyze the system constraints, optimize edge-case boundaries, and map memory routing to achieve microsecond sub-execution metrics."}
                  </p>
                </div>
  
                <div className="pt-4">
                  <Link 
                    to={`/problem/${problem._id}`} 
                    className={`btn btn-md sm:btn-lg rounded-xl font-bold shadow-lg shadow-primary/10 gap-2 group ${
                      hasSolvedToday ? 'btn-ghost border border-green-500/30 text-green-500 bg-green-500/5 hover:bg-green-500/10' : 'btn-primary'
                    }`}
                  >
                    <Code size={18} />
                    {hasSolvedToday ? "Review Solution" : "Start Coding"}
                  </Link>
                </div>
              </div>
            </div>
  
          </div>
        </div>
      </>
    );
  };

export default Potd;