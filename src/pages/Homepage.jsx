import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { logoutUser } from '../authSlice';
import { CheckCircle, CircleHelp, LogOut, User as UserIcon } from 'lucide-react'; // Using icons for better UI
 
function Homepage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  // const [loading, setLoading] = useState(true); // Added loading state
  const loading=false;
  const [filters, setFilters] = useState({
    status: 'all',
    difficulty: 'all',
    tag: 'all',
  });
  console.log("/homepage pe aaya ")
  useEffect(() => {
    
   
      const fetchProblems=async()=>{
        try{
          const {data}=await axiosClient.get('/problem/getAllProblem')
          setProblems(data);
        }catch(error){
          console.log('Error Fetching Problems',error);
        }
      };
      
      const fetchSolvedProblems=async()=>{
        try{
          const {data}=await axiosClient.get('/problem/solvedProblemsByUser')
          setSolvedProblems(data);
        }catch(error){
          console.log('Error Fetching Problems',error);
        }
      };

      fetchProblems();
      
      if(user) fetchSolvedProblems();
    } 
    , [user]);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredProblems = problems.filter((prob) => {
    const matchDifficulty = filters.difficulty === 'all' || prob.difficulty.toLowerCase() === filters.difficulty;
    const matchTag = filters.tag === 'all' || (prob.tags ===filters.tag);
    
    const matchStatus = filters.status==='all'||solvedProblems.some(sp => sp._id === prob._id);
  

    return matchDifficulty && matchTag && matchStatus;
  });

  return (
    <div className="min-h-screen bg-base-300 text-base-content">
      {/* Navigation Bar */}
      <nav className="navbar bg-base-100 border-b border-base-content/10 px-4 md:px-12 sticky top-0 z-50">
        <div className="flex-1">
          <NavLink to="/" className="text-2xl font-bold tracking-tighter text-primary">
            Axiom<span className="text-base-content font-light text-lg italic">Code</span>
          </NavLink>
        </div>
        <div>
          {user?.role === 'admin' && (
          <li className="ml-2 list-none mr-4">
            <NavLink 
              to="/admin" 
              className={({ isActive }) => 
                `btn btn-ghost btn-sm md:btn-md border border-primary/30 hover:border-primary hover:bg-primary/10 ${isActive ? 'bg-primary/20 border-primary' : ''}`
              }
            >
            
              Admin
            </NavLink>
          </li>
          )}
        </div>
        <div className="flex-none gap-2">
          {user ? (
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar border border-primary/20">
                <div className="w-10 rounded-full flex items-center justify-center bg-neutral">
                  <UserIcon size={20} />
                </div>
              </label>
              
              <ul tabIndex={0} className="mt-3 z-1 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52 border border-base-content/10">
                <li className="menu-title text-primary">Hello, {user.firstName}</li>
                <li><Link to="/profile">Profile</Link></li>
                <li><button onClick={handleLogout} className="text-error"><LogOut size={16}/> Logout</button></li>
                
              </ul>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/signup" className="btn btn-primary btn-sm">Sign Up</Link>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4 md:p-8">
        
        {/* Statistics Hero (Optional but looks good) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="stats shadow bg-base-100">
                <div className="stat">
                    <div className="stat-title">Problems Available</div>
                    <div className="stat-value text-primary">{problems.length}</div>
                </div>
            </div>
            <div className="stats shadow bg-base-100">
                <div className="stat">
                    <div className="stat-title">Solved</div>
                    <div className="stat-value text-success">{solvedProblems.length}</div>
                </div>
            </div>
            <div className="stats shadow bg-base-100">
                <div className="stat text-secondary">
                    <div className="stat-title">Success Rate</div>
                    <div className="stat-value">
                        {problems.length ? Math.round((solvedProblems.length / problems.length) * 100) : 0}%
                    </div>
                </div>
            </div>
        </div>

        {/* Filter Section */}
        <div className="flex flex-wrap gap-3 mb-6 bg-base-100 p-4 rounded-xl shadow-sm">
          <select name="status" className="select select-bordered select-sm md:select-md" onChange={handleFilterChange}>
            <option value="all">Status: All</option>
            <option value="solved">Solved</option>
            <option value="unsolved">Unsolved</option>
          </select>

          <select name="difficulty" className="select select-bordered select-sm md:select-md" onChange={handleFilterChange}>
            <option value="all">Difficulty: All</option>
            <option value="easy" className="text-success">Easy</option>
            <option value="medium" className="text-warning">Medium</option>
            <option value="hard" className="text-error">Hard</option>
          </select>

          <select name="tag" className="select select-bordered select-sm md:select-md" onChange={handleFilterChange}>
            <option value="all">Tags: All</option>
            <option value="array">Array</option>
            <option value="linkedlist">Linked List</option>
            <option value="stack">Stack</option>
            <option value="string">String</option>
          </select>
        </div>

        {/* Problems List Table */}
        <div className="overflow-x-auto bg-base-100 rounded-xl shadow-xl border border-base-content/5">
          <table className="table table-zebra w-full">
            {/* head */}
            <thead className="bg-base-200">
              <tr>
                <th className="w-12">Status</th>
                <th>Title</th>
                <th>Difficulty</th>
                <th>Category</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                 <tr>
                    <td colSpan="5" className="text-center py-10">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                    </td>
                 </tr>
              ) : filteredProblems.length > 0 ? (
                filteredProblems.map((problem) => {
                  const isSolved = solvedProblems.some(sp => sp._id === problem._id);
                  return (
                    <tr key={problem._id} className="hover">
                      <td>
                        {isSolved ? (
                          <CheckCircle className="text-success w-5 h-5" />
                        ) : (
                          <CircleHelp className="text-base-content/20 w-5 h-5" />
                        )}
                      </td>
                      <td>
                        <Link to={`/problem/${problem._id}`} className="font-medium hover:text-primary transition-colors">
                          {problem.title}
                        </Link>
                      </td>
                      <td>
                        <span className={`
                          badge badge-sm font-bold border-none
                          ${problem.difficulty === 'easy' ? 'bg-success/10 text-success' : 
                            problem.difficulty === 'medium' ? 'bg-warning/10 text-warning' : 
                            'bg-error/10 text-error'}
                        `}>
                          {problem.difficulty}
                        </span>
                      </td>
                      <td>
                        <div className="flex flex-wrap gap-1">
                          {
                            <span key={problem.tags} className="badge badge-outline badge-xs opacity-60">{problem.tags}</span>
                          }
                        </div>
                      </td>
                      <td className="text-right">
                        <Link to={`/problem/${problem._id}`} className="btn btn-ghost btn-xs text-primary">Solve</Link>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-gray-500">No problems found matching these filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default Homepage;