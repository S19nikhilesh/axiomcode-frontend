import React, { useEffect, useState } from 'react';
import axiosClient from '../utils/axiosClient';
import { useNavigate,Link } from 'react-router';
const DeleteProblem = () => {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState(""); // Bonus: for easy searching
    const navigate=useNavigate();

    useEffect(() => {
        fetchProblems();
    }, []);

    const fetchProblems = async () => {
        try {
            setLoading(true);
            const { data } = await axiosClient.get('/problem/getAllProblem');
            setProblems(data);
        } catch (err) {
            setError('Failed to fetch problems');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this problem?')) return;

        try {
            await axiosClient.delete(`/problem/delete/${id}`);
            // Update UI by filtering out the deleted problem
            setProblems(problems.filter(problem => problem._id !== id));
    
        } catch (err) {
            setError('Failed to delete problem');
            console.error(err);
        }
    };

    const handleUpdate = async (id) => {

        navigate(`/admin/update/${id}`)
    };

    // Filter problems based on search term
    const filteredProblems = problems.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
    );

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Delete Problems</h1>
                    <p className="text-gray-500">Manage and remove existing challenges</p>
                </div>
                
                {/* Search Bar */}
                <div className="form-control">
                    <input 
                        type="text" 
                        placeholder="Search by title..." 
                        className="input input-bordered w-full max-w-xs"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {error && (
                <div className="alert alert-error mb-6">
                    <span>{error}</span>
                </div>
            )}

            <div className="overflow-x-auto bg-base-200 rounded-xl shadow-lg">
                <table className="table table-zebra w-full">
                    {/* head */}
                    <thead className="bg-base-300">
                        <tr>
                            <th className="w-1/12">#</th>
                            <th className="w-5/12">Title</th>
                            <th className="w-2/12">Difficulty</th>
                            <th className="w-2/12 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProblems.length > 0 ? (
                            filteredProblems.map((problem, index) => (
                                <tr key={problem._id} className="hover">
                                    <th>{index + 1}</th>
                                    <td className="font-medium">{problem.title}</td>
                                    <td>
                                        <span className={`badge ${
                                            problem.difficulty === 'Easy' 
                                            ? 'badge-success' 
                                            : problem.difficulty === 'Medium' 
                                            ? 'badge-warning' 
                                            : 'badge-error'
                                        }`}>
                                            {problem.difficulty}
                                        </span>
                                    </td>
                                    <td className="text-center">
                                        <div className="flex justify-center space-x-2">
                                            <button 
                                                onClick={() => handleDelete(problem._id)}
                                                className="btn btn-sm btn-error btn-outline hover:text-white"
                                            >
                                                Delete
                                            </button>
                                            <button 
                                                onClick={() => handleUpdate(problem._id)}
                                                className="btn btn-sm  btn-outline hover:text-white"
                                            >
                                                Update
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center py-10 text-gray-500">
                                    No problems found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DeleteProblem;