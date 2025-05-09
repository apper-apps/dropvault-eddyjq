import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import MainFeature from '../components/MainFeature';
import getIcon from '../utils/iconUtils';

function Home() {
  const [recentFiles, setRecentFiles] = useState([]);
  
  // Icon components
  const FileUpIcon = getIcon('Upload');
  const FolderIcon = getIcon('Folder');
  const ShieldCheckIcon = getIcon('ShieldCheck');
  const ActivityIcon = getIcon('Activity');
  
  const handleNewUpload = (newFile) => {
    // Add file to recent files
    setRecentFiles(prev => [newFile, ...prev.slice(0, 4)]);
    
    // Show success notification
    toast.success(`"${newFile.name}" uploaded successfully!`);
  };
  
  const features = [
    {
      title: "Simple Drag & Drop",
      description: "Easily upload files by dragging them to the upload zone",
      icon: FileUpIcon,
    },
    {
      title: "Organized Storage",
      description: "Keep all your important files organized in one place",
      icon: FolderIcon,
    },
    {
      title: "Secure Sharing",
      description: "Share files securely with custom access controls",
      icon: ShieldCheckIcon,
    }
  ];

  return (
    <div className="space-y-12">
      <section className="text-center max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Manage your files with ease
            </span>
          </h1>
          <p className="text-lg md:text-xl text-surface-600 dark:text-surface-300 mb-8">
            Upload, organize, and share your files securely in one place
          </p>
        </motion.div>
      </section>

      <MainFeature onFileUploaded={handleNewUpload} />

      {recentFiles.length > 0 && (
        <section className="mt-12">
          <div className="flex items-center mb-4">
            <ActivityIcon size={20} className="text-primary mr-2" />
            <h2 className="text-xl font-semibold">Recent Uploads</h2>
          </div>
          <div className="bg-white dark:bg-surface-800 rounded-xl p-4 shadow-card">
            <ul className="divide-y divide-surface-200 dark:divide-surface-700">
              {recentFiles.map((file, index) => (
                <motion.li 
                  key={`${file.name}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="py-3 flex justify-between items-center"
                >
                  <div className="flex items-center">
                    <span className="p-2 rounded-lg mr-3 bg-surface-100 dark:bg-surface-700">
                      {(() => {
                        const FileIcon = getIcon(
                          file.type.includes('image') ? 'Image' :
                          file.type.includes('pdf') ? 'FileText' :
                          file.type.includes('video') ? 'Video' : 'File'
                        );
                        return <FileIcon size={18} className="text-surface-500" />;
                      })()}
                    </span>
                    <div>
                      <p className="font-medium truncate max-w-[180px] sm:max-w-xs">{file.name}</p>
                      <p className="text-xs text-surface-500">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  <span className="text-xs bg-surface-100 dark:bg-surface-700 px-2 py-1 rounded-full">
                    {new Date().toLocaleDateString()}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              className="p-6 rounded-2xl glass-morphism hover:shadow-card transition duration-300"
            >
              <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-xl inline-block mb-4">
                <Icon size={24} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-surface-600 dark:text-surface-300">{feature.description}</p>
            </motion.div>
          );
        })}
      </section>
    </div>
  );
}

export default Home;