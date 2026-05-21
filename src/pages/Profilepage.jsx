import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Shield, Mail, Flame, Edit3, Check, X, Award, ChevronRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import axiosClient from '../utils/axiosClient';
import { checkAuth } from '../authSlice';

const Profile = ({ activeTab, setActiveTab,user }) => {
    const dispatch = useDispatch();
    const { user: reduxUser } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({ firstName: '', lastName: '', age: '' });
    const [stats, setStats] = useState({ potdCount: 0, normalCount: 0, streak: 0 });
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false);
    const [toast, setToast] = useState({ type: '', text: '' });

    useEffect(() => {
        if (setActiveTab) setActiveTab('profile');
    }, [setActiveTab]);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await axiosClient.get('/user/getProfile');
                if (response.data) {
                    const { firstName, lastName, age, PotdSolved, ProblemSolved, potdStreak } = response.data;
                    setFormData({
                        firstName: firstName || '',
                        lastName: lastName || '',
                        age: age || ''
                    });
                    setStats({
                        potdCount: PotdSolved?.length || 0,
                        normalCount: ProblemSolved?.length || 0,
                        streak: potdStreak || 0
                    });
                }
            } catch (err) {
                showToast(err, 'Database sync failed!');
            } finally {
                setLoading(false);
            }
        };
        fetchProfileData();
    }, []);

    const showToast = (type, text) => {
        setToast({ type, text });
        setTimeout(() => setToast({ type: '', text: '' }), 4000);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setBtnLoading(true);
        try {
            await axiosClient.put('/user/updateProfile', formData);
            showToast('success', 'Profile updated successfully!');
            setIsEditing(false);
            dispatch(checkAuth());
        } catch (err) {
            showToast('error', err.response?.data || 'Sync error.');
        } finally {
            setBtnLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-100">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-100 text-base-content antialiased font-sans transition-colors duration-200">
            <Navbar activeTab={activeTab} setActiveTab={setActiveTab} user={user} />

            {/* TOAST NOTIFICATION */}
            {toast.text && (
                <div className="toast toast-top toast-end z-50 p-4">
                    <div className={`alert rounded-xl font-bold shadow-2xl border-none ${toast.type === 'success' ? 'alert-success text-success-content' : 'alert-error text-error-content'}`}>
                        <span>{toast.text}</span>
                    </div>
                </div>
            )}

            <main className="max-w-4xl mx-auto px-4 py-8 lg:py-12 space-y-6">
                
                {/* 1. TOP HERO REGION - Cleaned up fake info */}
                <div className="bg-base-200 border border-base-content/10 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-5">
                        {/* Soft Monolith Avatar */}
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-base-300 text-base-content flex items-center justify-center font-black text-3xl sm:text-4xl shadow-md border border-base-content/5 relative select-none shrink-0">
                            {formData.firstName[0]?.toUpperCase()}{formData.lastName[0]?.toUpperCase() || ''}
                        </div>
                        
                        <div className="space-y-1.5">
                            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{formData.firstName} {formData.lastName}</h1>
                            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wide">
                                <span className="text-primary flex items-center gap-1 bg-primary/10 px-2.5 py-0.5 rounded-md border border-primary/10">
                                    <Shield size={12} className="text-primary" /> {reduxUser?.role || 'User'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Edit Trigger Action */}
                    {!isEditing && (
                        <div className="w-full md:w-auto flex items-center gap-2">
                            <button 
                                onClick={() => setIsEditing(true)}
                                className="btn btn-sm sm:btn-md btn-outline border-base-content/20 hover:bg-base-content hover:text-base-100 rounded-xl font-bold gap-2 px-5 shadow-sm grow md:grow-0"
                            >
                                <Edit3 size={15} /> Edit Profile
                            </button>
                        </div>
                    )}
                </div>

                {/* 2. DYNAMIC CONTENT SPLIT */}
                {!isEditing ? (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                        
                        {/* LEFT: CORE METRICS (Problems Solved) */}
                        <div className="md:col-span-7">
                            <div className="bg-base-200 border border-base-content/10 rounded-2xl p-5 h-full flex flex-col justify-center">
                                <div className="flex justify-between items-center bg-base-100 border border-base-content/5 p-5 rounded-xl cursor-pointer hover:bg-base-300/30 transition-colors shadow-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-xl bg-primary/10 text-primary"><Award size={22} /></div>
                                        <div>
                                            <span className="font-black text-base text-base-content block">Problems Solved</span>
                                            <span className="text-xs text-base-content/50 font-medium">Core DSA database evaluations</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="font-black font-mono bg-base-200 border border-base-content/10 px-4 py-1.5 rounded-lg text-base">{stats.normalCount}</span>
                                        <ChevronRight size={18} className="opacity-40" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: STREAKS & POTD METRICS */}
                        <div className="md:col-span-5 flex flex-col gap-4 justify-between">
                            {/* Orange Gradient POTD Streak Pill */}
                            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-5 text-white flex items-center gap-4 shadow-md border border-orange-600/10">
                                <Flame size={26} className="animate-pulse" />
                                <div>
                                    <span className="text-lg font-black tracking-tight block">{stats.streak} Day POTD Streak</span>
                                    <span className="text-xs text-white/70 font-semibold">Keep coding daily!</span>
                                </div>
                            </div>

                            {/* Total POTD Solved Box */}
                            <div className="bg-base-200 border border-base-content/10 rounded-2xl p-5 flex justify-between items-center">
                                <div className="space-y-1">
                                    <div className="text-xs font-mono font-bold text-base-content/50 uppercase tracking-wider">
                                        POTDs Solved
                                    </div>
                                    <p className="text-3xl font-black font-mono text-base-content">{stats.potdCount}</p>
                                </div>
                                <div className="p-3 rounded-xl bg-info/10 text-info font-bold"><Flame size={20} className="text-orange-500" /></div>
                            </div>
                        </div>

                    </div>
                ) : (
                    /* 3. PROFILE EDIT FORM (Opens smoothly on click) */
                    <div className="bg-base-200 border border-base-content/10 rounded-2xl p-6 sm:p-8 shadow-sm">
                        <div className="flex justify-between items-center mb-8 pb-4 border-b border-base-content/5">
                            <div>
                                <h3 className="text-xl font-black tracking-tight">Edit Profile Parameters</h3>
                                <p className="text-xs text-base-content/50 mt-1">Modify your personal parameters synchronized with core APIs.</p>
                            </div>
                        </div>

                        <form onSubmit={handleUpdate} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                
                                <div className="form-control w-full">
                                    <label className="text-xs font-mono font-black text-base-content/50 uppercase tracking-widest mb-2 px-1">First Name</label>
                                    <input 
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                        required
                                        className="input input-bordered input-lg w-full bg-base-100 border-base-content/10 rounded-xl font-bold text-base focus:input-primary placeholder:text-base-content/60 shadow-inner"
                                        placeholder="First Name"
                                    />
                                </div>

                                <div className="form-control w-full">
                                    <label className="text-xs font-mono font-black text-base-content/50 uppercase tracking-widest mb-2 px-1">Last Name</label>
                                    <input 
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                        className="input input-bordered input-lg w-full bg-base-100 border-base-content/10 rounded-xl font-bold text-base focus:input-primary placeholder:text-base-content/60 shadow-inner"
                                        placeholder="Last Name"
                                    />
                                </div>

                                <div className="form-control w-full sm:col-span-2">
                                    <label className="text-xs font-mono font-black text-base-content/50 uppercase tracking-widest mb-2 px-1 flex items-center gap-1.5">
                                        <Mail size={13} /> Registered Email Endpoint
                                    </label>
                                    <input 
                                        type="email"
                                        value={reduxUser?.emailId || ''}
                                        disabled
                                        className="input input-bordered input-lg w-full bg-base-300/30 text-base-content/40 border-base-content/5 cursor-not-allowed font-mono text-base rounded-xl select-all placeholder:text-base-content/60"
                                    />
                                </div>

                                <div className="form-control w-full">
                                    <label className="text-xs font-mono font-black text-base-content/50 uppercase tracking-widest mb-2 px-1">Age Parameter</label>
                                    <input 
                                        type="number"
                                        name="age"
                                        value={formData.age}
                                        onChange={(e) => setFormData({...formData, age: e.target.value})}
                                        min="6"
                                        max="80"
                                        className="input input-bordered input-lg w-full bg-base-100 border-base-content/10 rounded-xl font-bold text-base focus:input-primary placeholder:text-base-content/60 shadow-inner"
                                        placeholder="Age"
                                    />
                                </div>
                            </div>

                            {/* CANCEL & SAVE CONTROL ACTIONS */}
                            <div className="flex gap-3 justify-end pt-6 mt-8 border-t border-base-content/10">
                                <button 
                                    type="button"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setToast({ type: '', text: '' });
                                    }}
                                    className="btn btn-sm sm:btn-md btn-ghost rounded-xl font-bold px-5"
                                >
                                    <X size={15} /> Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={btnLoading}
                                    className="btn btn-sm sm:btn-md btn-primary rounded-xl font-bold gap-1.5 px-6 shadow-sm"
                                >
                                    {btnLoading ? (
                                        <span className="loading loading-spinner loading-xs"></span>
                                    ) : (
                                        <>
                                            <Check size={15} /> Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Profile;