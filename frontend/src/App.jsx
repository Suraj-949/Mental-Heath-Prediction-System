import LandingPage from './components/LandingPage' 
import Register from './components/Register'
import Login from './components/Login'
import PredictForm from './components/PredictForm'

import {BrowserRouter, Routes, Route} from 'react-router-dom'
import AuthProvider from './AuthProvider'
import PublicRoute from './PublicRoute'
import PrivateRoute from './PrivateRoute'

function App() {
  return (
    <>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LandingPage/>}/>
          <Route path='/register' element={<PublicRoute><Register/></PublicRoute>}/>
          <Route path='/login' element={<PublicRoute><Login/></PublicRoute>} />
          <Route path='/predict' element={<PrivateRoute><PredictForm/></PrivateRoute>} />
        </Routes>   
      </BrowserRouter>
    </AuthProvider>
    
      
    </>
  )
}

export default App
