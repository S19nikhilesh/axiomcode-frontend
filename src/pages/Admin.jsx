import React from 'react';
import { Plus, Edit, Trash2,LogOut,Video,UserCog } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../authSlice';


function Admin() {
  const dispatch = useDispatch();
  
  
  const handleLogout = () => {
    dispatch(logoutUser());
  };
  const adminOptions = [
    {
      id: 'create',
      title: 'Create Problem',
      description: 'Add a new coding problem to the platform',
      icon: Plus,
      color: 'btn-success',
      bgColor: 'bg-success/10',
      route: '/admin/create'
    },
   
    {
      id: 'delete',
      title: 'Delete / Update Problem',
      description: 'Manage problems from the platform',
      icon: Edit,
      color: 'btn-error',
      bgColor: 'bg-error/10',
      route: '/admin/delete'
    },
    {
      id: 'video',
      title: 'Video Problem',
      description: 'Upload And Delete Videos',
      icon: Video,
      color: 'btn-success',
      bgColor: 'bg-success/10',
      route: '/admin/video'
    },
    {
      id: 'video',
      title: 'New Admin',
      description: 'Register New Admin',
      icon: UserCog,
      color: 'btn-success',
      bgColor: 'bg-success/10',
      route: '/admin/register'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 min-h-[calc(100vh-64px)]">
      {/* Header */}
      <div className="text-center mb-16 relative">
      {/* Logout Button - Top Right Positioning (Optional but looks professional) */}
      <div className="absolute right-0 top-0">
        <button 
          onClick={handleLogout} 
          className="btn btn-ghost text-error gap-2 hover:bg-error/10 transition-colors"
        >
          <LogOut size={18}/> 
          <span>Logout</span>
        </button>
      </div>

      {/* Main Header Content */}
      <h1 className="text-4xl font-bold text-base-content mb-4 tracking-tight">
        Admin Panel
      </h1>
      
      <p className="text-base-content/70 text-lg max-w-2xl mx-auto">
        Manage coding problems and monitor platform performance
      </p>
    </div>

      {/* Admin Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2  gap-8 max-w-6xl mx-auto">
        {adminOptions.map((option) => {
          const IconComponent = option.icon;
          return (
            <div 
              key={option.id} 
              className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-base-300"
            >
              <div className="card-body items-center text-center p-8">
                {/* Icon Wrapper */}
                <div className={`${option.bgColor} p-4 rounded-full mb-4 text-base-content`}>
                  <IconComponent size={32} />
                </div>

                {/* Title & Description */}
                <h2 className="card-title text-xl mb-2">{option.title}</h2>
                <p className="text-sm text-base-content/60 mb-6">
                  {option.description}
                </p>

                {/* Action Button */}
                <div className="card-actions w-full">
                  <NavLink 
                    to={option.route} 
                    className={`btn ${option.color} btn-block btn-outline hover:text-white`}
                  >
                    {option.title}
                  </NavLink>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Admin;