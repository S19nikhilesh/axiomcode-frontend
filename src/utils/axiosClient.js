//base url konse API ko hit krna
import axios from "axios"

const axiosClient= axios.create({
    baseURL: "https://axiomcode-backend-1.onrender.com",
     //backend mera is url pe host hai baseURL:"http://localhost:3000", 
    withCredentials:true,// browser tu iske sath cookies to attach kar dena
    headers: { 
        'Content-Type':'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0', //mera data json format mai hai
     },
  });


export default axiosClient;


//axiosClient.post('/user/register',data)  ab har baar poora URL/user/register nhi likhna padega