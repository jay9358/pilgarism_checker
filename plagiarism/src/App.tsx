
import './App.css'
import Checker from './components/Checker/Checker'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Process from './components/Process/Process'
import AnalyzedText from "./components/analyzedpage/AnalyzedText"
import GenerateText from "./components/GenerateText/GenerateText"
function App() {
 
 
 
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Checker/>}></Route>
          <Route path='/text' element={<Process></Process>}></Route>
          <Route path='/AnalyzedText' element={<AnalyzedText></AnalyzedText>}></Route>
          <Route path='/generateText' element={<GenerateText></GenerateText>}></Route>
        </Routes>
        
        

      </Router>
    </>
  )
}

export default App
