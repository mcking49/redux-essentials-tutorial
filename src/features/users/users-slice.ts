import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { client } from '../../api/client'

type User = {
  id: string
  name: string
}

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await client.get('/fakeApi/users')
  return response.data as User[]
})

const initialState: User[] = [
  { id: '0', name: 'Tianna Jenkins' },
  { id: '1', name: 'Kevin Grant' },
  { id: '2', name: 'Madison Price' },
]

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchUsers.fulfilled, (_, action) => {
      return action.payload
    })
  },
})

export default usersSlice.reducer
