import { useState } from 'react'
import Header from './components/Landing Page Component/Header'
import LandingPage from './components/LandingPage' 
import Register from './components/Register'

import {BrowserRouter, Routes, Route} from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage/>}/>
        <Route path='/register' element={<Register />}/>
      </Routes>   
    </BrowserRouter>
      
    </>
  )
}

export default App
