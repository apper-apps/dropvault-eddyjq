import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

const NotFound = () => {
  // Icon components
  const AlertTriangleIcon = getIcon('AlertTriangle');
  const HomeIcon = getIcon('Home');
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-4 text-center"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 20
        }}
        className="mb-8 text-accent"
      >
        <AlertTriangleIcon size={80} />
      </motion.div>
      
      <h1 className="text-4xl md:text-5xl font-bold mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-surface-700 dark:text-surface-300">
        Page Not Found
      </h2>
      
      <p className="text-lg max-w-md mx-auto mb-10 text-surface-600 dark:text-surface-400">
        The page you're looking for doesn't exist or has been moved.
      </p>
      
      <Link 
        to="/"
        className="btn-primary flex items-center gap-2 mx-auto"
      >
        <HomeIcon size={18} />
        <span>Return Home</span>
      </Link>
      
      <motion.div 
        className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary" 
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      />
    </motion.div>
  );
};

export default NotFound;