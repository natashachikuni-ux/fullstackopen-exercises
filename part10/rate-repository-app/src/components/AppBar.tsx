import { View, StyleSheet, ScrollView, Pressable, Text } from 'react-native';
import Constants from 'expo-constants';
import { useQuery, useApolloClient } from '@apollo/client';
import { ME } from '../graphql/queries';
import AppBarTab from './AppBarTab';
import useAuthStorage from '../hooks/useAuthStorage';

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#24292e',
    flexDirection: 'row',
  },
  tabText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    padding: 15,
  },
});

const AppBar = () => {
  const { data } = useQuery(ME);
  const apolloClient = useApolloClient();
  const authStorage = useAuthStorage();

  const user = data ? data.me : null;

  const onSignOut = async () => {
    await authStorage.removeAccessToken();
    await apolloClient.resetStore();
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal>
        <AppBarTab title="Repositories" link="/" />
        
        {user ? (
          <>
            <AppBarTab title="Create a review" link="/create-review" />
            <AppBarTab title="My reviews" link="/my-reviews" /> 
            <Pressable onPress={onSignOut}>
              <Text style={styles.tabText}>Sign out</Text>
            </Pressable>
          </>
        ) : (
          <>
            <AppBarTab title="Sign in" link="/signin" />
            <AppBarTab title="Sign up" link="/signup" />
          </>
        )}
      </ScrollView>
    </View>
  );
}

export default AppBar;