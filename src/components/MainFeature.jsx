import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

const MainFeature = ({ onFileUploaded }) => {
  // Icon components
  const UploadCloudIcon = getIcon('UploadCloud');
  const XIcon = getIcon('X');
  const CheckCircleIcon = getIcon('CheckCircle');
  const FileIcon = getIcon('File');
  const AlertCircleIcon = getIcon('AlertCircle');
  const TrashIcon = getIcon('Trash');
  
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadStatus, setUploadStatus] = useState({});
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const processFiles = (fileList) => {
    const newFiles = Array.from(fileList).map(file => ({
      id: `${file.name}-${Date.now()}`,
      file,
      name: file.name,
      size: file.size,
      type: file.type,
    }));
    
    setFiles(prevFiles => [...prevFiles, ...newFiles]);
    
    // Initialize progress for new files
    newFiles.forEach(file => {
      setUploadProgress(prev => ({
        ...prev,
        [file.id]: 0
      }));
      setUploadStatus(prev => ({
        ...prev,
        [file.id]: 'pending'
      }));
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const simulateUpload = (fileId) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setUploadProgress(prev => ({ ...prev, [fileId]: progress }));
        setUploadStatus(prev => ({ ...prev, [fileId]: 'complete' }));
        
        // Find the file data to pass to parent component
        const uploadedFile = files.find(f => f.id === fileId);
        if (uploadedFile && onFileUploaded) {
          onFileUploaded(uploadedFile);
        }
      } else {
        setUploadProgress(prev => ({ ...prev, [fileId]: progress }));
      }
    }, 300);

    return interval;
  };

  const startUpload = () => {
    if (files.length === 0) {
      toast.warn("Please add files to upload first");
      return;
    }

    // Reset progress and status for all files
    const newProgress = {};
    const newStatus = {};
    
    files.forEach(file => {
      if (uploadStatus[file.id] !== 'complete') {
        newProgress[file.id] = 0;
        newStatus[file.id] = 'uploading';
      } else {
        newProgress[file.id] = uploadProgress[file.id];
        newStatus[file.id] = uploadStatus[file.id];
      }
    });
    
    setUploadProgress(newProgress);
    setUploadStatus(newStatus);
    
    // Start upload simulation for each pending file
    files.forEach(file => {
      if (newStatus[file.id] === 'uploading') {
        simulateUpload(file.id);
      }
    });
    
    toast.info(`Uploading ${files.filter(f => newStatus[f.id] === 'uploading').length} files`);
  };

  const removeFile = (fileId) => {
    setFiles(files.filter(file => file.id !== fileId));
    
    // Also remove from progress and status
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[fileId];
      return newProgress;
    });
    
    setUploadStatus(prev => {
      const newStatus = { ...prev };
      delete newStatus[fileId];
      return newStatus;
    });
  };

  const clearAllFiles = () => {
    setFiles([]);
    setUploadProgress({});
    setUploadStatus({});
    toast.info("All files cleared");
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'complete':
        return <CheckCircleIcon size={16} className="text-green-500" />;
      case 'error':
        return <AlertCircleIcon size={16} className="text-red-500" />;
      case 'uploading':
        return (
          <svg className="animate-spin h-4 w-4 text-primary" viewBox="0 0 24 24">
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
              fill="none"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        );
      default:
        return <FileIcon size={16} className="text-surface-500" />;
    }
  };

  const pendingFilesCount = files.filter(file => 
    uploadStatus[file.id] !== 'complete'
  ).length;

  const completedFilesCount = files.filter(file => 
    uploadStatus[file.id] === 'complete'
  ).length;

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-surface-800 rounded-2xl p-6 md:p-8 shadow-card"
      >
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Upload Files</h2>
          <p className="text-surface-600 dark:text-surface-400">
            Drag and drop files or browse to upload
          </p>
        </div>

        <div
          onClick={() => fileInputRef.current.click()}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-xl p-8 md:p-12 text-center cursor-pointer
            transition-all duration-200 ease-in-out
            ${isDragging 
              ? 'border-primary bg-primary/5 dark:bg-primary/10' 
              : 'border-surface-300 dark:border-surface-600 hover:border-primary hover:bg-surface-50 dark:hover:bg-surface-700/50'
            }
          `}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            className="hidden"
          />
          
          <motion.div 
            animate={{ 
              scale: isDragging ? 1.05 : 1,
              y: isDragging ? -10 : 0
            }}
            className="flex flex-col items-center"
          >
            <div className="mb-4 p-4 rounded-full bg-primary/10 dark:bg-primary/20 text-primary">
              <UploadCloudIcon size={36} />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {isDragging ? "Drop files here" : "Drag & Drop files here"}
            </h3>
            <p className="text-surface-500 dark:text-surface-400 mb-4">
              or click to browse your device
            </p>
            <p className="text-xs text-surface-400 dark:text-surface-500">
              Supports all file types up to 50MB
            </p>
          </motion.div>
        </div>

        {files.length > 0 && (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">
                Files ({files.length})
                {completedFilesCount > 0 && (
                  <span className="ml-2 text-sm text-surface-500">
                    • {completedFilesCount} uploaded
                  </span>
                )}
              </h3>
              
              <div className="flex space-x-3">
                {pendingFilesCount > 0 && (
                  <button 
                    onClick={startUpload}
                    className="btn-primary text-sm px-3 py-1.5"
                  >
                    Upload {pendingFilesCount} files
                  </button>
                )}
                
                <button 
                  onClick={clearAllFiles}
                  className="btn-outline text-sm px-3 py-1.5 flex items-center gap-1"
                >
                  <TrashIcon size={14} />
                  <span>Clear all</span>
                </button>
              </div>
            </div>
            
            <div className="overflow-hidden rounded-xl border border-surface-200 dark:border-surface-700 divide-y divide-surface-200 dark:divide-surface-700">
              <AnimatePresence initial={false}>
                {files.map((file) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="bg-surface-50 dark:bg-surface-800/50 p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3 flex-grow mr-4">
                      <div className="flex-shrink-0">
                        {getStatusIcon(uploadStatus[file.id])}
                      </div>
                      <div className="min-w-0 flex-grow">
                        <p className="font-medium truncate max-w-xs md:max-w-md">{file.name}</p>
                        <p className="text-xs text-surface-500 dark:text-surface-400">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      {uploadStatus[file.id] === 'uploading' && (
                        <div className="w-24 md:w-36 h-2 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${uploadProgress[file.id]}%` }}
                          />
                        </div>
                      )}
                      
                      {uploadStatus[file.id] === 'complete' ? (
                        <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 py-1 px-2 rounded-full">
                          Complete
                        </span>
                      ) : (
                        <button
                          onClick={() => removeFile(file.id)}
                          className="p-1 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
                        >
                          <XIcon size={16} className="text-surface-500 hover:text-surface-700 dark:hover:text-surface-300" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </motion.div>
      
      <div className="mt-6 p-4 bg-surface-100 dark:bg-surface-800/70 rounded-lg text-sm text-surface-500 dark:text-surface-400">
        <p className="flex items-center">
          <span className="mr-2">💡</span>
          <span>Files are stored locally in this demo. In a production app, files would be securely uploaded to cloud storage.</span>
        </p>
      </div>
    </div>
  );
};

export default MainFeature;