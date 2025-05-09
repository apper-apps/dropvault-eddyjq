import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import getIcon from './utils/iconUtils';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import ContactUs from './pages/ContactUs';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true' || 
      window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const SunIcon = getIcon('Sun');
  const MoonIcon = getIcon('Moon');

  return (
    <div className="min-h-screen transition-colors duration-300">
      <header className="py-4 px-6 md:px-10 flex justify-between items-center bg-white dark:bg-surface-800 shadow-sm">
        <div className="flex items-center space-x-2">
          <motion.div 
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="text-primary-dark dark:text-primary-light"
          >
            {(() => {
              const BoxIcon = getIcon('Database');
              return <BoxIcon size={28} />;
            })()}
          </motion.div>
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            DropVault
          </h1>
        </div>
        
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? <SunIcon size={20} /> : <MoonIcon size={20} />}
        </motion.button>
      </header>

      <main className="container mx-auto px-4 py-6 md:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="mt-auto py-6 px-6 bg-white dark:bg-surface-800 border-t border-surface-200 dark:border-surface-700">
        <div className="container mx-auto flex flex-col items-center">
          <div className="mb-3">
            <nav className="flex justify-center space-x-6 text-sm font-medium">
              <a href="/" className="text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary-light">Home</a>
              <a href="/contact" className="text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary-light">Contact Us</a>
            </nav>
          </div>
          <div className="text-sm text-center text-surface-500 dark:text-surface-400">
          &copy; {new Date().getFullYear()} DropVault. All rights reserved.
          </div>
        </div>
      </footer>

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? "dark" : "light"}
        className="md:max-w-md"
      />
    </div>
  );
}

export default App;