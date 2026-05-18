import React, { useEffect, useState } from 'react';
import axiosClient from '../utils/axiosClient';
import { Database, X } from 'lucide-react';

const SubmissionHistory = ({ problemId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCode, setSelectedCode] = useState(null); // To store code for the modal

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const { data } = await axiosClient.get(`/problem/submittedProblems/${problemId}`);
        setSubmissions(data);
      } catch (err) {
        console.error("Error fetching submissions:", err);
      } finally {
        setLoading(false);
      }
    };
    if (problemId) fetchSubmissions();
  }, [problemId]);

  if (loading) return (
    <div className="flex justify-center py-10">
      <span className="loading loading-spinner loading-md text-success"></span>
    </div>
  );

  return (
    // bg-[#1a1a1a] ki jagah bg-base-200 lagaya
    <div className="flex flex-col h-full bg-base-200 relative transition-colors duration-200">
      <div className="p-4 border-b border-base-content/10 flex justify-between items-center">
        <h3 className="font-bold text-base-content text-sm">Recent Submissions</h3>
        <span className="text-[10px] bg-base-300 px-2 py-1 rounded text-base-content/70 border border-base-content/5">
          {submissions.length} Total
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {submissions.length > 0 ? (
          <div className="divide-y divide-base-content/5">
            {submissions.map((sub) => (
              <div key={sub._id} className="p-4 hover:bg-base-100/50 transition-colors group">
                <div className="flex justify-between items-start mb-1">
                  <span className={`text-xs font-bold uppercase tracking-tight ${
                    sub.status === 'accepted' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {sub.status?.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] text-base-content/40">
                    {new Date(sub.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex items-center gap-3 text-[11px] text-base-content/60">
                  <span className="flex items-center gap-1">
                    <Database size={12} className="text-base-content/40" /> {sub.memoryUsage} KB
                  </span>
                  <span>•</span>
                  <span>{sub.language}</span>
                  
                  {/* Action Button */}
                  <button 
                    onClick={() => setSelectedCode(sub.code)}
                    className="ml-auto opacity-0 group-hover:opacity-100 text-success text-[10px] hover:underline transition-opacity font-bold"
                  >
                    View Code →
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-base-content/30">
            <p className="text-sm italic">No submissions yet.</p>
          </div>
        )}
      </div>

      {/* --- View Code Modal --- */}
      {selectedCode && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-base-100 w-full max-w-2xl rounded-xl border border-base-content/10 shadow-2xl flex flex-col max-h-[80vh]">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b border-base-content/10">
              <h3 className="font-bold text-base-content">Submitted Solution</h3>
              <button 
                onClick={() => setSelectedCode(null)}
                className="p-1 hover:bg-base-200 rounded-full text-base-content/60 hover:text-base-content transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Modal Body (Scrollable Code Canvas) */}
            <div className="p-4 overflow-auto bg-base-300">
              <pre className="text-sm font-mono text-base-content/90 leading-relaxed">
                <code>{selectedCode}</code>
              </pre>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-base-content/10 flex justify-end">
              <button 
                onClick={() => setSelectedCode(null)}
                className="btn btn-sm btn-ghost text-base-content/60 hover:text-base-content"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionHistory;