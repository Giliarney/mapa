import './index.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/pages/home/Home';
import RegionPage from './components/pages/regions/RegionPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/region/:regionId" element={<RegionPage />} />

      </Routes>
    </Router>
  );
}

export default App;