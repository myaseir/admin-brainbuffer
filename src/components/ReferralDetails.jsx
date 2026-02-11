import React, { useState, useEffect } from 'react';
import { User, Calendar, Wallet, Gamepad2, ArrowLeft, AlertCircle } from 'lucide-react';

const ReferralDetails = ({ referrerId, referrerName, onBack }) => {
    const [referrals, setReferrals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            setErrorMessage(null);
            
            try {
                // 1. Define the correct Backend URL
                const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
                const token = localStorage.getItem('token');

                // 2. Add Authorization headers
                const response = await fetch(`${API_BASE}/api/admin/referral/${referrerId}/details`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                // 3. Safety check for HTML responses (Prevents the "Unexpected Token <" error)
                const contentType = response.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json")) {
                    throw new Error("Server returned HTML instead of JSON. Check if the Backend URL is correct.");
                }

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || "Failed to fetch details");
                }

                const data = await response.json();
                setReferrals(data.referrals || []);
            } catch (error) {
                console.error("Referral Fetch Error:", error);
                setErrorMessage(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (referrerId) fetchDetails();
    }, [referrerId]);

    if (loading) return (
        <div className="p-20 text-center space-y-4">
            <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Loading Records...</p>
        </div>
    );

    if (errorMessage) return (
        <div className="p-10 bg-red-50 rounded-2xl border border-red-100 text-center space-y-4">
            <AlertCircle className="mx-auto text-red-500" size={40} />
            <p className="text-red-800 font-bold">{errorMessage}</p>
            <button onClick={onBack} className="px-6 py-2 bg-red-600 text-white rounded-xl text-sm font-bold">Go Back</button>
        </div>
    );

    return (
        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-100">
            {/* Header */}
            <div className="bg-slate-900 p-6 flex items-center justify-between text-white">
                <button onClick={onBack} className="flex items-center gap-2 hover:bg-white/10 px-4 py-2 rounded-xl transition-all font-bold text-xs uppercase tracking-widest">
                    <ArrowLeft size={18} />
                    Back
                </button>
                <div className="text-right">
                    <h2 className="text-xl font-black uppercase tracking-tighter italic">Referrals by {referrerName}</h2>
                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{referrals.length} Verified Users</p>
                </div>
            </div>

            {/* List Container */}
            <div className="p-4 sm:p-8">
                {referrals.length === 0 ? (
                    <div className="text-center py-20">
                        <User size={48} className="mx-auto text-slate-200 mb-4" />
                        <p className="text-slate-400 font-bold uppercase text-xs">No users found for this referrer.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        <div className="hidden md:grid grid-cols-4 px-6 py-3 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                            <span>User Details</span>
                            <span>Joined At</span>
                            <span>Balance</span>
                            <span>Activity</span>
                        </div>

                        {referrals.map((user) => (
                            <div key={user._id} className="flex flex-col md:grid md:grid-cols-4 p-6 bg-slate-50/50 border border-slate-100 rounded-[1.5rem] hover:border-blue-200 transition-all gap-4">
                                
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="bg-white shadow-sm p-3 rounded-xl text-blue-600 border border-slate-100">
                                        <User size={20} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-black text-slate-900 uppercase text-sm truncate">{user.username}</p>
                                        <p className="text-[10px] text-slate-400 font-medium truncate">{user.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                    <Calendar size={16} className="text-slate-400" />
                                    <span className="md:hidden text-[10px] text-slate-400">JOINED:</span>
                                    {new Date(user.created_at).toLocaleDateString()}
                                </div>

                                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                                    <Wallet size={16} className="text-green-500" />
                                    <span className="md:hidden text-[10px] text-slate-400">WALLET:</span>
                                    {user.wallet_balance.toLocaleString()} <span className="text-green-600 text-[10px]">PKR</span>
                                </div>

                                <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                    <Gamepad2 size={16} className="text-purple-500" />
                                    <span className="md:hidden text-[10px] text-slate-400">MATCHES:</span>
                                    {user.total_matches || 0} <span className="text-[10px] text-slate-400 font-normal">Played</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReferralDetails;