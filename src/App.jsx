import { BrowserRouter, Routes, Route } from "react-router-dom"
import LandingPage from './pages/LandingPage.jsx'
import DashbordModule from "./pages/DashbordModule.jsx"
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