import { createContext } from 'react';
import AuthStorage from '../utils/authStorage';

// We tell TypeScript the context will hold an instance of AuthStorage or null
const AuthStorageContext = createContext<AuthStorage | null>(null);

export default AuthStorageContext;