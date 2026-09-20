
import axios from "axios"

const axiosClient= axios.create({
    baseURL: "https://axiomcode-backend-1.onrender.com",
    // baseURL: "http://localhost:3000",
    
    withCredentials:true,
    headers: { 
        'Content-Type':'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0', 
     },
  });


export default axiosClient;

