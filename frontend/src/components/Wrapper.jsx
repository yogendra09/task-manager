import React from 'react'
import { BrowserRouter as BrowseRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from '../store/store'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
const Wrapper = ({children}) => {
  return (
    <>
    <BrowseRouter >
    <Provider store={store}>  
      <ToastContainer />
        {children}
        </Provider>
    </BrowseRouter>
    </>
  )
}

export default Wrapper