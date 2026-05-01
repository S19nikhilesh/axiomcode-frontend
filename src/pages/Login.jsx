import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { loginUser } from '../authSlice';
import { useEffect,useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate,Link } from 'react-router';

//schema validation for login
const LoginSchema = z.object({
  emailId: z.string().email(),
  password: z.string().min(8, "Password should contain atleast 8 characters")
})
//...regsiter ek object return karta hai isliye spread operator lagaya
//&& ka matlab agr firdt conditon true then return second , but if first false then return first
function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch=useDispatch();
  const navigate=useNavigate();
  // Add 'error' here!
  const { isAuthenticated, error,user } = useSelector((state) => state.auth);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(LoginSchema),
  });

  useEffect(() => {
    
    if (isAuthenticated && user?.role) {
      console.log("Role Found:", user.role); // Debugging
      
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, user, navigate]);

  
  const onSubmit = async (data) => {
    console.log("Form Data Sent:", data);
    const result = await dispatch(loginUser(data));
    console.log("Login Result:", result);
    
  };
  return (
    <>
    <div className="min-h-167 flex items-center justify-center p-4 bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center text-3xl">Axiom Code</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          {error && (
            <div className="alert alert-error mb-4 py-2 text-sm justify-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-4 w-3" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{error}</span>
            </div>
          )}
            <div className="form-control">
              <label className="label mb-1">
                <span className="label-text">Email</span>
              </label>
              <input 
                {...register('emailId')} 
                placeholder="admin@gmail.com" 
                className={`input input-bordered ${errors.emailId ? 'input-error' : ''}`}
              />
              {errors.emailId && (
                <span className="text-error text-sm mt-1">{errors.emailId.message}</span>
              )}
            </div>

            <div className="form-control">
              <label className="label mb-1">
                <span className="label-text">Password</span>
              </label>
              <input 
                  {...register('password')} 
                  placeholder="Admin@123" 
                  type={showPassword ? "text" : "password"}
                  className={`input input-bordered pr-4 ${errors.password ? 'input-error' : ''}`}
              />
               <button 
                  type="button" // Important: prevents form submission
                  className="absolute inset-y-0 right-3 mr-10 mt-7.5 flex items-center text-gray-500 hover:text-primary"
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
              {errors.password && (
                <span className="text-error text-sm mt-1">{errors.password.message}</span>
              )}
            </div>

            <div className="mt-4 text-center"> 
              <span className="text-sm"> 
                Doesn't have an account ?
                <Link to="/signup" className="link link-primary ml-1 font-semibold">Sign Up here</Link> 
              </span>
            </div>

            <button type='submit' className='btn btn-primary mt-4'>
              Login
            </button>
          </form>
        </div>
      </div>
      
    </div>
    <div className='items-center justify-center p-4 bg-base-200'>
    <h1>ADMIN Credentials : admin@gmail.com , Admin@123</h1>
    <span></span>
    </div>
    </>
 
    
  );
}

export default Login;