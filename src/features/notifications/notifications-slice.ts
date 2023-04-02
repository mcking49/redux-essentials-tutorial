import {
  createAction,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  isAnyOf,
  type PayloadAction,
} from '@reduxjs/toolkit'

import { client } from '../../api/client'
import { forceGenerateNotifications } from '../../api/server'
import { type RootState } from '../../app/store'
import { apiSlice } from '../api/api-slice'

const notificationsReceived = createAction(
  'notifications/notificationsReceived',
)

type Notification = {
  id: string
  date: string
  message: string
  user: string
  read: boolean
  isNew: boolean
}

const notificationsAdapter = createEntityAdapter<Notification>()

const initialState = notificationsAdapter.getInitialState()

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    allNotificationsRead(state) {
      Object.values(state.entities).forEach((notification) => {
        if (notification) {
          notification.read = true
        }
      })
    },
  },
  extraReducers(builder) {
    builder.addMatcher(matchNotificationsReceived, (state, action) => {
      // Add client-side metadata for tracking new notifications
      const notificationsMetadata = action.payload?.map((notification) => ({
        id: notification.id,
        read: false,
        isNew: true,
      }))

      Object.values(state.entities).forEach((notification) => {
        // Any notifications we've read are no longer new
        if (notification) {
          notification.isNew = !notification.read
        }
      })

      notificationsAdapter.upsertMany(state, notificationsMetadata)
    })
  },
})

export const { allNotificationsRead } = notificationsSlice.actions

export default notificationsSlice.reducer

export const extendedApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<Notification[], void>({
      query: () => '/notifications',
      async onCacheEntryAdded(
        _arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved, dispatch },
      ) {
        // create a websocket connection when the cache subscription starts
        const ws = new WebSocket('ws://localhost')
        try {
          // wait for the initial query to resolve before proceeding
          await cacheDataLoaded

          // when data is received from the socket connection to the server,
          // update our query result with the received message
          const listener = (event: { data: string }) => {
            const message = JSON.parse(event.data)
            switch (message.type) {
              case 'notifications': {
                updateCachedData((draft: Notification[]) => {
                  // Insert all received notifications from the websocket
                  // into the existing RTKQ cache array
                  draft.push(...message.payload)
                  draft.sort((a: Notification, b: Notification) =>
                    b.date.localeCompare(a.date),
                  )
                })
                dispatch(notificationsReceived(message.payload))
                break
              }
              default:
                break
            }
          }

          ws.addEventListener('message', listener)
        } catch {
          // no-op in case `cacheEntryRemoved` resolves before `cacheDataLoaded`,
          // in which case `cacheDataLoaded` will throw
        }
        // cacheEntryRemoved will resolve when the cache subscription is no longer active
        await cacheEntryRemoved
        // perform cleanup steps once the `cacheEntryRemoved` promise resolves
        ws.close()
      },
    }),
  }),
})

export const { useGetNotificationsQuery } = extendedApi

const emptyNotifications: Notification[] = []

export const selectNotificationsResult =
  extendedApi.endpoints.getNotifications.select()

const selectNotificationsData = createSelector(
  selectNotificationsResult,
  (notificationsResult) => notificationsResult.data ?? emptyNotifications,
)

export const fetchNotificationsWebsocket =
  () => (_dispatch: unknown, getState: () => RootState) => {
    const allNotifications = selectNotificationsData(getState())
    const [latestNotification] = allNotifications
    const latestTimestamp = latestNotification?.date ?? ''
    // Hardcode a call to the mock server to simulate a server push scenario over websockets
    forceGenerateNotifications(latestTimestamp)
  }

const matchNotificationsReceived = isAnyOf(
  notificationsReceived,
  extendedApi.endpoints.getNotifications.matchFulfilled,
)

export const {
  selectAll: selectNotificationsMetadata,
  selectEntities: selectMetadataEntities,
} = notificationsAdapter.getSelectors((state: RootState) => state.notifications)

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_state, { getState }) => {
    const allNotifications = selectNotificationsMetadata(
      getState() as RootState,
    )
    const [latestNotification] = allNotifications
    const latestTimestamp = latestNotification ? latestNotification.date : ''
    const response = await client.get(
      `/fakeApi/notifications?since=${latestTimestamp}`,
    )
    return response.data as Notification[]
  },
)
