import { BrowserRouter, Routes, Route } from "react-router-dom"
import LandingPage from './pages/LandingPage.js'
import DashbordModule from "./pages/DashbordModule.js"
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/dashboard" element={<DashbordModule/>}/>
      </Routes >
    </BrowserRouter>
  )
}

export default App