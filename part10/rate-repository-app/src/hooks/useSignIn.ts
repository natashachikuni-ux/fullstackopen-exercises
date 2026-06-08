import { useMutation } from '@apollo/client';
import { AUTHENTICATE } from '../graphql/mutations';
import useAuthStorage from './useAuthStorage'; // Ensure path is correct

const useSignIn = () => {
  const authStorage = useAuthStorage();
  const [mutate, result] = useMutation(AUTHENTICATE);

  const signIn = async ({ username, password }: any) => {
    // The variables key must match the $credentials variable in your mutation
    const { data } = await mutate({ 
      variables: { 
        credentials: { username, password } 
      } 
    });

    if (data?.authenticate?.accessToken) {
      await authStorage.setAccessToken(data.authenticate.accessToken);
      // Optional: Verify it in your console
      console.log('Token saved:', data.authenticate.accessToken);
    }

    return data;
  };

  return [signIn, result] as const;
};

export default useSignIn;