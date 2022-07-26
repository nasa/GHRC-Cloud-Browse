import React from 'react'
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route,  } from "react-router-dom"
import { Provider } from 'react-redux'
import TopBar from './components/universal/TopBar';
import { CssBaseline } from '@mui/material';
import App from './App'
import store from './app/store'
import { Footer } from './components/universal/Footer';


const root = createRoot(document.getElementById('root'))

root.render(
    <React.StrictMode>
        <Provider store={store}>
        <div>
            <CssBaseline />
            <TopBar />
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<App />} /> 
                </Routes>
            </BrowserRouter>
            <Footer />
        </div>
        </Provider>
    </React.StrictMode>,
)