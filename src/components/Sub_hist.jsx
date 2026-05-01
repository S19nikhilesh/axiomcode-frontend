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
      <span className="loading loading-spinner loading-md text-green-500"></span>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#1a1a1a] relative">
      <div className="p-4 border-b border-[#3c3c3c] flex justify-between items-center">
        <h3 className="font-bold text-gray-200 text-sm">Recent Submissions</h3>
        <span className="text-[10px] bg-[#2a2a2a] px-2 py-1 rounded text-gray-400">
          {submissions.length} Total
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {submissions.length > 0 ? (
          <div className="divide-y divide-[#2a2a2a]">
            {submissions.map((sub) => (
              <div key={sub._id} className="p-4 hover:bg-[#252525] transition-colors group">
                <div className="flex justify-between items-start mb-1">
                  <span className={`text-xs font-bold uppercase tracking-tight ${
                    sub.status === 'accepted' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {sub.status?.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] text-gray-500">
                    {new Date(sub.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex items-center gap-3 text-[11px] text-gray-400">
                  <span className="flex items-center gap-1">
                    <Database size={12} className="text-gray-500" /> {sub.memoryUsage} KB
                  </span>
                  <span>•</span>
                  <span>{sub.language}</span>
                  
                  {/* Action Button */}
                  <button 
                    onClick={() => setSelectedCode(sub.code)}
                    className="ml-auto opacity-0 group-hover:opacity-100 text-green-500 text-[10px] hover:underline transition-opacity font-medium"
                  >
                    View Code →
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-600">
            <p className="text-sm italic">No submissions yet.</p>
          </div>
        )}
      </div>

      {/* --- View Code Modal --- */}
      {selectedCode && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#1e1e1e] w-full max-w-2xl rounded-xl border border-[#3c3c3c] shadow-2xl flex flex-col max-h-[80vh]">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b border-[#3c3c3c]">
              <h3 className="font-bold text-gray-200">Submitted Solution</h3>
              <button 
                onClick={() => setSelectedCode(null)}
                className="p-1 hover:bg-[#3c3c3c] rounded-full transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            
            {/* Modal Body (Scrollable Code) */}
            <div className="p-4 overflow-auto bg-[#0d0d0d]">
              <pre className="text-sm font-mono text-gray-300 leading-relaxed">
                <code>{selectedCode}</code>
              </pre>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#3c3c3c] flex justify-end">
              <button 
                onClick={() => setSelectedCode(null)}
                className="btn btn-sm btn-ghost text-gray-400"
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