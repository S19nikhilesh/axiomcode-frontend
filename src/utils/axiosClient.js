//base url konse API ko hit krna
import axios from "axios"

const axiosClient= axios.create({
    baseURL: "http://localhost:3000", //backend mera is url pe host hai
    withCredentials:true,// browser tu iske sath cookies to attach kar dena
    headers: { 
        'Content-Type':'application/json' //mera data json format mai hai
     },
  });

//axiosClient.post('/user/register',data)  ab har baar poora URL/user/register nhi likhna padega
export default axiosClient;
