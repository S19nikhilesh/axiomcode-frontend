
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {  useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom'; // Changed to react-router-dom
import axiosClient from '../utils/axiosClient';


// Schema validation for signup
const signupSchema = z.object({
  firstName: z.string().min(3, "Name should contain at least 3 characters"),
  emailId: z.string().email(),
  password: z.string().min(8, "Password should contain at least 8 characters")
});

function AdminRegister() {
 
  const navigate = useNavigate();
  const { isAuthenticated,loading } = useSelector((state) => state.auth);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(signupSchema),
  });
  console.log("admin bhi signup page tak aaya",isAuthenticated);


  const onSubmit = async (data) => {
    // Add the role manually so the backend receives exactly what Postman sent
    const payload = { ...data, role: 'admin' }; 
  
    try {
      // Ensure this URL matches EXACTLY what you put in Postman
      await axiosClient.post('user/admin/register', payload); 
      alert('New Admin Created');
      navigate('/');
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center text-3xl font-bold text-primary">Register New Admin</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
            {/* First Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">First Name</span>
              </label>
              <input 
                {...register('firstName')} 
                placeholder="John" 
                className={`input input-bordered ${errors.firstName ? 'input-error' : ''}`}
              />
              {errors.firstName && (
                <span className="text-error text-sm mt-1">{errors.firstName.message}</span>
              )}
            </div>

            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input 
                {...register('emailId')} 
                placeholder="john@example.com" 
                className={`input input-bordered ${errors.emailId ? 'input-error' : ''}`}
              />
              {errors.emailId && (
                <span className="text-error text-sm mt-1">{errors.emailId.message}</span>
              )}
            </div>

    
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <div className="relative w-full">
                <input 
                  {...register('password')} 
                  placeholder="********" 
                  type={ "text" }
                  className={`input input-bordered ${errors.password ? 'input-error' : ''}`}
                />
                
              </div>
              {errors.password && (
                <span className="text-error text-sm mt-1">{errors.password.message}</span>
              )}
            </div>

    

            <button type='submit' className={`btn btn-primary mt-4 ${loading?'loading':''}`} disabled={loading}>
              {loading?'Signing Up...':'Sign Up'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminRegister;