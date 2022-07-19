import React from 'react'
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route,  } from "react-router-dom"
import { Provider } from 'react-redux'
import App from './App'
import store from './app/store'
import Home from './pages/Home';


const root = createRoot(document.getElementById('root'))

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<App />} />
                    <Route path='home' element={<Home />} />
                </Routes>
            </BrowserRouter>
        </Provider>
    </React.StrictMode>,
)