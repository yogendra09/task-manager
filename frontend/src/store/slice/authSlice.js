import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosInstance from '../../utils/axios'
const initialState = {
  user: null,
  isAuthenticated: false,
}

export const asyncLogin = createAsyncThunk('v1/asyncLogin', async (credentials, thunkAPI) => {
  try {
    const {data} = await axiosInstance.post('/v1/login', credentials)
    console.log('Login response:', data)
    localStorage.setItem('token', data.token)
    return data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data)
  }
})

export const asyncRegister = createAsyncThunk('v1/asyncRegister', async (userData, thunkAPI) => {
  try {
    const { data } = await axiosInstance.post('/v1/register', userData)
    localStorage.setItem('token', data.token)
    return data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data)
  }
})

export const loggedInUser = createAsyncThunk('v1/loggedInUser', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get('/v1/current-user')
    return response.data.user
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data)
  }
})

export const asyncGetAllBoards = createAsyncThunk('v1/asyncGetAllBoards', async (_, thunkAPI) => {
  try {
    const { data} = await axiosInstance.get('/v1/boards')
    return data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data)
  }
})

export const asyncCreateBoard = createAsyncThunk('v1/asyncCreateBoard', async (boardData, thunkAPI) => {
  try {
    const { data } = await axiosInstance.post('/v1/boards', boardData)
    return data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data)
  }
})

export const asyncUpdateBoard = createAsyncThunk('v1/asyncUpdateBoard', async (boardData, thunkAPI) => {
  try {
    const { data } = await axiosInstance.put(`/v1/boards/${boardData.id}`, boardData)
    return data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data)
  }
})

export const asyncDeleteBoard = createAsyncThunk('v1/asyncDeleteBoard', async (boardId, thunkAPI) => {
  try {
    const { data } = await axiosInstance.delete(`/v1/boards/${boardId}`)
    return data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data)
  }
})

export const asyncCreateTask = createAsyncThunk('v1/asyncCreateTask', async (taskData, thunkAPI) => {
  try {
    const { data } = await axiosInstance.post('/v1/tasks', taskData)
    return data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data)
  }
})

export const asyncUpdateTask = createAsyncThunk('v1/asyncUpdateTask', async (taskData, thunkAPI) => {
  try {
    const { data } = await axiosInstance.put(`/v1/tasks/${taskData.id}`, taskData)
    return data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data)
  }
})

export const asyncDeleteTask = createAsyncThunk('v1/asyncDeleteTask', async (taskId, thunkAPI) => {
  try {
    const { data } = await axiosInstance.delete(`/v1/tasks/${taskId}`)
    return data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data)
  }
})
  
export const asyncGetBoardList = createAsyncThunk('v1/asyncGetBoardList', async (boardId, thunkAPI) => {
  try {
    const { data } = await axiosInstance.get(`/v1/boards/${boardId}`)
    return data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data)
  }
})

export const asyncCreateList = createAsyncThunk('v1/asyncCreateList', async (listData, thunkAPI) => {
  try {
    const { data } = await axiosInstance.post('/v1/lists', listData)
    return data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data)
  }
})

export const asyncAddMemberToBoard = createAsyncThunk('v1/asyncAddMemberToBoard', async ({ boardId, email }, thunkAPI) => {
  try {
    const { data } = await axiosInstance.post(`/v1/boards/${boardId}/members`, { email })
    return data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data)
  }
})

export const asyncUpdateTaskDetails = createAsyncThunk('v1/asyncUpdateTaskDetails', async (payload, thunkAPI) => {
  try {
    const { data } = await axiosInstance.post(`/v1/update-task-details`, payload)
    return data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data)
  }
})

export const asyncDeleteList = createAsyncThunk('v1/asyncDeleteList', async (listId, thunkAPI) => {
  try {
    const { data } = await axiosInstance.delete(`/v1/lists/${listId}`)
    return data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data)
  }
})

export const asyncGetBoardMembers = createAsyncThunk('v1/asyncGetBoardMembers', async (boardId, thunkAPI) => {
  try {
    const { data } = await axiosInstance.get(`/v1/boardmembers/${boardId}`)
    return data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data)
  }
})

export const authReducer = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(asyncLogin.fulfilled, (state, action) => {
        state.isAuthenticated = true
      })
      .addCase(asyncLogin.rejected, (state, action) => {
        state.isAuthenticated = false
      })
      .addCase(loggedInUser.fulfilled, (state, action) => {
        state.user = action.payload
        state.isAuthenticated = true
      })
      .addCase(loggedInUser.rejected, (state, action) => {
        state.user = null
        state.isAuthenticated = false
      })
  }
})


export default authReducer.reducer