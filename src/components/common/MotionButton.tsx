import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface MotionButtonProps {
    children: ReactNode; // Content inside the button
    onClick?: () => void; // Optional click handler
    className?: string; // Additional Tailwind CSS classes
    hoverScale?: number; // Optional hover scaling factor
    tapScale?: number; // Optional tap scaling factor
    type?: 'button' | 'submit' | 'reset'; // Optional button type
  }

const MotionButton: React.FC<MotionButtonProps> = ({
  children,
  onClick,
  className = '', // Allows passing custom Tailwind classes
  hoverScale = 1.1, // Hover scaling factor
  tapScale = 0.95,  // Tap scaling factor
  type = 'button'
}) => {
  return (
    <motion.button
      whileHover={{ scale: hoverScale }} // Allows hover scaling customization
      whileTap={{ scale: tapScale }}     // Allows tap scaling customization
      transition={{ type: 'spring', stiffness: 300 }} // Springy animation for smoother interaction
      className={`px-4 py-2 bg-blue-600 text-white rounded-lg ${className}`} // Default Tailwind styles
      onClick={onClick}
      type={type}
    >
      {children}
    </motion.button>
  );
};

export default MotionButton;
