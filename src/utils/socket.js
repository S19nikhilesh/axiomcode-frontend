import { io } from 'socket.io-client';


const BACKEND_URL = 'https://axiomcode-backend-1.onrender.com'; 


const socket = io(BACKEND_URL, {
    autoConnect: true,       
    reconnection: true,      
    reconnectionAttempts: 5  
});


socket.on('connect', () => {
    console.log('Frontend global socket connected successfully! ID:', socket.id);
});

export default socket;