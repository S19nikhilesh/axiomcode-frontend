import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import socket from '../utils/socket';
import { useSelector, useDispatch } from 'react-redux'; // 👈 useDispatch import kiya
import { Zap, Swords, Trophy, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
 

const ContestPage = ({ activeTab, setActiveTab }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch(); // 👈 Dispatch setup
    const [searchParams] = useSearchParams();
    const matchId = searchParams.get('matchId');
    const { user } = useSelector((state) => state.auth);
    const [isSearching, setIsSearching] = useState(false);
    
    // 🎯 Ab local state ko direct Redux store wale single source aur backup trigger se connect kar diya
    const [contestScore, setContestScore] = useState(user?.contestScore || 0);

    // Jab jab Redux user store ka score global level par badlega, tab tab ye local UI ko real-time refresh rakhega
    useEffect(() => {
        if (user?.contestScore !== undefined) {
            setContestScore(user.contestScore);
        }
    }, [user?.contestScore,user]);

    useEffect(() => {
        if (setActiveTab) setActiveTab('contest');
    }, [setActiveTab]);
    
    // ⚔️ Match Over Live Sync Handler
    useEffect(() => {
        if (!matchId) return;
    
        socket.on('match_over', ({ winnerId, message }) => {
            alert(message); 
            
            // 🏆 GLOBAL SCORE UPDATION LOGIC
            if (winnerId === user?._id) {
                // 1. Local state update instantly screen par dikhane ke liye
                setContestScore(prev => prev + 10);
                
                // 2. Redux State sync (ताकि Navbar/Profile har jagah live +10 update ho jaye)
                // if (typeof updateUserScore === 'function') {
                //     dispatch(updateUserScore(user.contestScore + 10));
                // }
            }
            
            // Clean navigation, query parameters hata do URL se match khatam hote hi
            navigate('/contest');
        });
    
        return () => {
            socket.off('match_over');
        };
    }, [matchId, navigate, user?._id, dispatch]);

    // 📡 Match Init Dynamic Redirection
    useEffect(() => {
        socket.on('match_init', ({ roomId, problemId }) => {
            setIsSearching(false);
            navigate(`/problem/${problemId}?matchId=${roomId}`);
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
            <Navbar activeTab={activeTab} setActiveTab={setActiveTab} user={user}/>

            <main className="max-w-md mx-auto px-4 py-16 text-center space-y-8">
                
                {/* Score Token Display */}
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