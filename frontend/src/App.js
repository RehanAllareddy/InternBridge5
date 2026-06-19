import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Internships from './pages/Internships';
import About from './pages/About';
import Partners from './pages/Partners';
import Survey from './pages/Survey';

function App() {
  return (
    <div className="App min-h-screen flex flex-col bg-white">
      <BrowserRouter>
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/internships" element={<Internships />} />
            <Route path="/about" element={<About />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/match" element={<Survey />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
      <Analytics />
    </div>
  );
}

export default App;
