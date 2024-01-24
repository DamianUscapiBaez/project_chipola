import { Login } from './components/Login';
import './App.css'
import { HashRouter, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { RoutesComponents } from './components/RoutesComponents';
import { Ranking } from './components/cosecha/Ranking';
import { NotFount } from './NotFount';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('islogged', true);

  }
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('islogged');
  }
  useEffect(() => {
    const islogged = JSON.parse(localStorage.getItem('islogged'));
    if (islogged !== undefined) {
      setIsAuthenticated(islogged);
    } else {
      setIsAuthenticated(false);
    }
  }, []);
  return (
    <HashRouter>
      {isAuthenticated ? (
        <RoutesComponents onLogout={handleLogout} />
      ) : (
        <Routes>
          <Route path='/' element={<Login onLogin={handleLogin} />} />
          <Route path="/ranking" exact element={<Ranking />} />
          <Route path="*" element={<NotFount />} />
        </Routes>
      )}
    </HashRouter>
  )
}
export default App
