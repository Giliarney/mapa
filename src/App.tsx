import './index.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/pages/home/Home';
import RegionPage from './components/pages/regionInfos/RegionPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/details" element={<RegionPage />}/>
      </Routes>
    </Router>
  );
}

export default App;