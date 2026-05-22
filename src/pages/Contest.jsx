import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Zap, Swords, Trophy, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import socket from '../utils/socket';

const ContestPage = ({ activeTab, setActiveTab }) => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const [isSearching, setIsSearching] = useState(false);
    const [contestScore, setContestScore] = useState(user?.contestScore || 0);

    useEffect(() => {
        if (setActiveTab) setActiveTab('contest');
    }, [setActiveTab]);

    useEffect(() => {
        socket.on('match_init', ({ roomId, problemId }) => {
            setIsSearching(false);
            navigate(`/problems/${problemId}?matchId=${roomId}`);
        });

        return () => {
            socket.off('match_init');
        };
    }, [navigate]);

    const handlePlayRandom = () => {
        if (!user) return alert("Please login first!");
        setIsSearching(true);
        socket.emit('join_queue', { userId: user._id, username: user.firstName });
    };

    const handleCancelSearch = () => {
        setIsSearching(false);
        socket.emit('leave_queue', { userId: user?._id });
    };

    return (
        <div className="min-h-screen bg-base-100 text-base-content antialiased font-sans">
            <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

            <main className="max-w-md mx-auto px-4 py-16 text-center space-y-8">
                
                <div className="inline-flex items-center gap-2 bg-warning/10 text-warning px-5 py-2 rounded-full border border-warning/20 shadow-sm">
                    <Trophy size={18} />
                    <span className="font-mono font-black text-base">Contest Score: {contestScore}</span>
                </div>

                <div className="space-y-2">
                    <h1 className="text-4xl font-black tracking-tight flex items-center justify-center gap-2">
                        Arena <Swords className="text-primary" size={32} />
                    </h1>
                    <p className="text-sm text-base-content/60 font-medium">
                        Live 1v1 coding battles. Fast submission wins the score.
                    </p>
                </div>

                <div className="bg-base-200 border border-base-content/10 rounded-2xl p-8 shadow-md">
                    {!isSearching ? (
                        <div className="space-y-6">
                            <div className="p-4 rounded-xl bg-base-100 border border-base-content/5 flex items-center justify-center">
                                <Zap className="text-orange-500 mr-2" size={20} />
                                <span className="text-sm font-bold text-base-content/80">Realtime Matchmaking Pool</span>
                            </div>
                            
                            <button
                                onClick={handlePlayRandom}
                                className="btn btn-primary btn-lg w-full rounded-xl font-black text-base shadow-md tracking-wide"
                            >
                                Play a Match Randomly
                            </button>
                        </div>
                    ) : (
                        <div className="py-6 flex flex-col items-center justify-center space-y-4">
                            <Loader2 className="animate-spin text-primary" size={40} />
                            <div>
                                <p className="font-black text-lg tracking-tight">Searching for Competitor...</p>
                                <p className="text-xs text-base-content/40 font-mono mt-1">Waiting in global queue buffer</p>
                            </div>
                            <button 
                                onClick={handleCancelSearch}
                                className="btn btn-sm btn-ghost text-error hover:bg-error/10 font-bold px-4 rounded-lg mt-2"
                            >
                                Cancel Search
                            </button>
                        </div>
                    )}
                </div>

            </main>
        </div>
    );
};

export default ContestPage;