import { FlatList, View, StyleSheet } from 'react-native';
import { useQuery } from '@apollo/client';
import { ME } from '../graphql/queries'; // 1. Change this from GET_CURRENT_USER to ME
import ReviewItem from './ReviewItem';

const styles = StyleSheet.create({
  separator: { height: 10, backgroundColor: '#e1e4e8' },
});

const MyReviews = () => {
  // 2. Change the query name here to ME
  const { data, loading, refetch } = useQuery(ME, {
    variables: { includeReviews: true },
    fetchPolicy: 'cache-and-network',
  });

  if (loading || !data?.me) return null;

  const reviewNodes = data.me.reviews
    ? data.me.reviews.edges.map((edge) => edge.node)
    : [];

  return (
    <FlatList
      data={reviewNodes}
      renderItem={({ item }) => (
        <ReviewItem review={item} isMyReview={true} refetch={refetch} />
      )}
      keyExtractor={({ id }) => id}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
};

export default MyReviews;