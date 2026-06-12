import { BrowserRouter, Routes, Route } from "react-router-dom"
import LandingPage from './pages/LandingPage.js'
import DashbordModule from "./pages/DashbordModule.js"
import TaskPages from "./pages/TaskPages.js"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/dashboard" element={<DashbordModule/>}/>
        <Route path="/taskpages" element = {<TaskPages/>}/>
      </Routes >
    </BrowserRouter>
  )
}

export default App