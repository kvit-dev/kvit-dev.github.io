import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { setGlobalAuthCallback } from "./firebase/auth";
import { setupAuthListener } from "./firebase/databaseInit";

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import WelcomePage from './pages/WelcomePage';
import GamesPage from './pages/GamesPage';
import FavouritePage from './pages/FavouritesPage';
import ProfilePage from './pages/ProfilePage';
import TournamentsPage from './pages/TournamentsPage';
import LoginPage from "./pages/LoginPage";
import Footer from './components/Footer';

import './styles/general.css';
import './styles/header.css';
import './styles/sidebar.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = setGlobalAuthCallback((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    
    const unsubscribeDatabase = setupAuthListener();
    return () => {
      unsubscribeAuth();
      if (unsubscribeDatabase) unsubscribeDatabase();
    };
  }, []);

  return (
    <Router>
      <div className="app-container">
        <Header user={user} />
        <div className="main-content">
          <Sidebar />
          <div className="page-content">
            <Routes>
              <Route path="/" element={<WelcomePage />} />
              <Route path="/games" element={<GamesPage />} />
              <Route path="/favourite" element={
                loading ? <div>Loading...</div> : 
                user ? <FavouritePage /> : <Navigate to="/" />
              } />
              <Route path="/profile" element={
                loading ? <div>Loading...</div> : 
                user ? <ProfilePage /> : <Navigate to="/" />
              } />
              <Route path="/tournaments" element={<TournamentsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
        <Footer />
      </div>
    </Router>
  );
}