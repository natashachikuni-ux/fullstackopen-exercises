import { Slot } from 'expo-router';
import AuthStorage from '../src/utils/authStorage';
import AuthStorageContext from '../src/contexts/AuthStorageContext';
import { ApolloProvider } from '@apollo/client';
import createApolloClient from '../src/utils/apolloClient';

const authStorage = new AuthStorage();
const apolloClient = createApolloClient(authStorage);

export default function RootLayout() {
  return (
    <AuthStorageContext.Provider value={authStorage}>
      <ApolloProvider client={apolloClient}>
        <Slot /> 
      </ApolloProvider>
    </AuthStorageContext.Provider>
  );
}