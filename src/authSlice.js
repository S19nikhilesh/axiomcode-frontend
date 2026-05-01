import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';//store ko configure krte hai toolkit se
import axiosClient from './utils/axiosClient';

export const registerUser = createAsyncThunk(
    'auth/register',
    async (userData,{rejectWithValue}) => {
        try {
            const response = await axiosClient.post('/user/register', userData);
            return response.data.user;
        } catch (error) {
            return rejectWithValue(error.response?.data || error);
        }
    }
);

export const loginUser = createAsyncThunk(
    'auth/login',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post('/user/login', userData);
            return response.data.user; 
        } catch (error) {
            // Grab the "Invalid Credentials" message from the JSON we sent above
            const errorMessage = error.response?.data?.message || "Something went wrong";
            return rejectWithValue(errorMessage);
        }
    }
);

export const checkAuth = createAsyncThunk(
    'auth/check',
    async (_,{rejectWithValue}) => {
        try {
            const {data} = await axiosClient.get('/user/check');
            return data.user;
        } catch (error) {
            return rejectWithValue(error.response?.data || error);
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_,{rejectWithValue}) => {
        try {
            await axiosClient.post('/user/logout');
            return null;
        } catch (error) {
            return rejectWithValue(error.response?.data || error);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        isLoading: false,
        error: null,
        isAuthenticated: false
    },
    reducers: {
       
    },
    extraReducers: (builder) => {
        builder
            // Register cases
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
                state.isAuthenticated = !!action.payload; //agr user ka koi data nhi aaya NULL ,so yeh !!NULL=false
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || 'Something went wrong';
                state.isAuthenticated = false;
                state.user = null;
            })
            
            // Login cases
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || 'Something went wrong';
                state.isAuthenticated = false;
                state.user = null;
            })
            
            // Check auth cases
            .addCase(checkAuth.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
                state.isAuthenticated = !!action.payload;
                state.error = null;
            })
            .addCase(checkAuth.rejected, (state) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.error = null;
            })
            
            // Logout cases
            .addCase(logoutUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                state.error = null;
            })
            .addCase(logoutUser.rejected, (state,action) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.error = action.payload?.message || 'Something went wrong';
            })
    }
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;