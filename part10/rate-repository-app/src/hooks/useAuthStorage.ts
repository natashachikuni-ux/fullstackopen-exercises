import { useContext } from 'react';
import AuthStorageContext from '../contexts/AuthStorageContext';

const useAuthStorage = () => {
  const context = useContext(AuthStorageContext);
  
  if (context === undefined) {
    throw new Error('useAuthStorage must be used within an AuthStorageProvider');
  }

  return context;
};

export default useAuthStorage;