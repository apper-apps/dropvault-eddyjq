import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Your message has been sent successfully!');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      toast.error('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const MailIcon = getIcon('Mail');
  const UserIcon = getIcon('User');
  const MessageSquareIcon = getIcon('MessageSquare');

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-surface-800 rounded-2xl shadow-card p-6 md:p-8"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Contact Us</h2>
        <p className="text-surface-600 dark:text-surface-400 mb-8 text-center">
          Have questions or feedback? We'd love to hear from you!
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-surface-400"><UserIcon size={18} /></span>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="input pl-10" placeholder="Your name" />
            </div>
            {errors.name && <p className="mt-1 text-sm text-accent">{errors.name}</p>}
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-surface-400"><MailIcon size={18} /></span>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="input pl-10" placeholder="your.email@example.com" />
            </div>
            {errors.email && <p className="mt-1 text-sm text-accent">{errors.email}</p>}
          </div>
          
          <div>
            <label htmlFor="subject" className="block text-sm font-medium mb-1">Subject</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-surface-400"><MessageSquareIcon size={18} /></span>
              <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} className="input pl-10" placeholder="Subject of your message" />
            </div>
            {errors.subject && <p className="mt-1 text-sm text-accent">{errors.subject}</p>}
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
            <textarea id="message" name="message" rows="5" value={formData.message} onChange={handleChange} className="input" placeholder="Type your message here..."></textarea>
            {errors.message && <p className="mt-1 text-sm text-accent">{errors.message}</p>}
          </div>
          
          <button 
            type="submit" 
            className="btn-primary w-full flex items-center justify-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ContactUs;