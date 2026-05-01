
import Homepage from "./pages/Homepage"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import {Routes, Route, Navigate } from "react-router";
import { checkAuth } from "./authSlice";
import { useDispatch,useSelector } from "react-redux";

import { useEffect } from "react";
import CreateProblem from "./components/Adminpanel"
import DeleteProblem from "./components/Deletepanel"
import AdminVideo from "./components/Adminvideo"
import ProblemPage from "./pages/Problempage"
import Admin from "./pages/Admin";
import UpdateProblem from "./components/Codepanel";
import AdminUpload from "./components/AdminUpload"
import AdminRegister from "./components/Adminregister";


function App() {
  
  //is autenticated hai ya nhi uska code yaha pe hoga 
  const {isAuthenticated,loading,user}=useSelector((state)=>state.auth) //state. slice ka naam

  const dispatch=useDispatch();

  useEffect(()=>{
    dispatch(checkAuth()); //function call
  },[dispatch])//ek hi baar call krna chchta hu , jab dispatch change ho -jo kabhi hoga nhi,ya khali array bhi chodd skte ho

  if(loading){
    return<div className="min-h-screen flex items-center justify-center">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  }
 //pehle directly siginup page pe redirect hora tha . 
  return (
    <>
      <Routes>  
        <Route path="/login" element={isAuthenticated ?<Navigate to="/"/> :<Login></Login>}></Route>
        <Route path="/signup" element={isAuthenticated?<Navigate to="/"/> :<Signup></Signup>}></Route>
        <Route path="/" element={isAuthenticated ? (user?.role === 'admin' ? <Navigate to="/admin" /> : <Homepage />) : <Navigate to="/login" />} />
        
        <Route path="/admin" element={isAuthenticated && user.role==='admin' ?<Admin></Admin>:<Navigate to="/signup"/>}></Route>
        <Route path="/admin/register" element={isAuthenticated && user.role==='admin'?<AdminRegister></AdminRegister>:<Navigate to="/"/>}></Route>
        <Route path="/admin/create" element={isAuthenticated && user.role==='admin'?<CreateProblem/>:<Navigate to="/"/>}></Route>
        <Route path="/admin/delete" element={isAuthenticated && user.role==='admin'?<DeleteProblem/>:<Navigate to="/"/>}></Route>
        <Route path="/admin/update/:id" element={isAuthenticated && user.role==='admin'?<UpdateProblem/>:<Navigate to="/"/>} ></Route>

        <Route path="/admin/video" element={isAuthenticated && user?.role === 'admin' ? <AdminVideo /> : <Navigate to="/" />} />
        <Route path="/admin/upload/:problemId" element={isAuthenticated && user?.role === 'admin' ? <AdminUpload /> : <Navigate to="/" />} />
        <Route path="/problem/:problemId" element={<ProblemPage/>}></Route>
        
      </Routes>
    </>
  )
}

export default App
