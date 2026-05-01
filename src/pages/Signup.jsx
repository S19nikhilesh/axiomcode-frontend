import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../authSlice';
import { useNavigate, Link } from 'react-router-dom'; // Changed to react-router-dom
import { useEffect, useState } from 'react';

// Schema validation for signup
const signupSchema = z.object({
  firstName: z.string().min(3, "Name should contain at least 3 characters"),
  emailId: z.string().email(),
  password: z.string().min(8, "Password should contain at least 8 characters")
});
   
function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated,loading} = useSelector((state) => state.auth);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(signupSchema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data) => {
    dispatch(registerUser(data));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center text-3xl font-bold text-primary">Axiom Code</h2>
          
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

            {/* Password with Eye Feature */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <div className="relative w-full">
                <input 
                  {...register('password')} 
                  placeholder="********" 
                  type={showPassword ? "text" : "password"}
                  className={`input input-bordered  pr-12 ${errors.password ? 'input-error' : ''}`}
                />
                {/* Eye Icon Button */}
                <button 
                  type="button" // Important: prevents form submission
                  className="absolute inset-y-0 right-3 pr-4 flex items-center text-gray-500 hover:text-primary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A11.055 11.055 0 0 0 12 5.25c2.783 0 5.308.995 7.265 2.647M1.5 1.5l21 21M9.88 9.88l1.242 1.242M12 18.75a11.055 11.055 0 0 1-8.02-3.477m10.168-1.554L12 12.182l-1.018 1.018" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <span className="text-error text-sm mt-1">{errors.password.message}</span>
              )}
            </div>

            {/* Navigation to Login */}
            <div className="mt-4 text-center"> 
              <span className="text-sm"> 
                Already have an account? 
                <Link to="/login" className="link link-primary ml-1 font-semibold">Login here</Link> 
              </span>
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

export default Signup;