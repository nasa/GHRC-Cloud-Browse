import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from '../feature/api/apiSlice'
import searchReducer from '../feature/searchSlice'
import delimReducer from '../feature/delimSlice'
import selectedListReducer from '../feature/selectedListSlice'
import crumbReducer from '../feature/crumbSlice'

export default configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    search: searchReducer,
    delim: delimReducer,
    selectedList: selectedListReducer,
    crumb: crumbReducer,
  },
  //necisarry for search aip
  middleware: getDefaultMiddleware =>
  getDefaultMiddleware().concat(apiSlice.middleware)
})