import { useParams } from 'react-router-native';
import { useQuery } from '@apollo/client';
import { FlatList, View, StyleSheet, Text } from 'react-native';

import RepositoryItem from './RepositoryItem';
import ReviewItem from './ReviewItem'; // NO curly braces here either
import { GET_REPOSITORY } from '../graphql/queries';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e1e4e8',
    flex: 1,
  },
  separator: {
    height: 10,
  },
});

const ItemSeparator = () => <View style={styles.separator} />;

const SingleRepository = () => {
  const { id } = useParams();

  const { data, loading, error } = useQuery(GET_REPOSITORY, {
    variables: { id },
    fetchPolicy: 'cache-and-network',
  });

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  const repository = data?.repository;
  
  // Extract the reviews from the nested edges/node structure
  const reviews = repository?.reviews
    ? repository.reviews.edges.map((edge: any) => edge.node)
    : [];

  return (
    <FlatList
      data={reviews}
      renderItem={({ item }) => <ReviewItem review={item} />}
      keyExtractor={({ id }) => id}
      ItemSeparatorComponent={ItemSeparator}
      // This keeps the Repository details at the top of the scrollable list
      ListHeaderComponent={() => (
        <View>
          <RepositoryItem item={repository} showGitHubButton={true} />
          <ItemSeparator />
        </View>
      )}
    />
  );
};

export default SingleRepository;