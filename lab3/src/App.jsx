import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import WelcomePage from './pages/WelcomePage';
import GamesPage from './pages/GamesPage';
import FavouritePage from './pages/FavouritesPage';
import ProfilePage from './pages/ProfilePage';
import TournamentsPage from './pages/TournamentsPage';
import Footer from './components/Footer';

import './styles/general.css';
import './styles/header.css';
import './styles/sidebar.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <div className="main-content">
          <Sidebar />
          <div className="page-content">
            <Routes>
              <Route path="/" element={<WelcomePage />} />
              <Route path="/games" element={<GamesPage />} />
              <Route path="/favourite" element={<FavouritePage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/tournaments" element={<TournamentsPage />} />
            </Routes>
          </div>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;