import { FlatList, View, StyleSheet, Pressable } from 'react-native';
import { useNavigate } from 'react-router-native';
import RepositoryItem from './RepositoryItem';
import useRepositories from '../hooks/useRepositories';

const styles = StyleSheet.create({
  separator: {
    height: 10,
    backgroundColor: '#e1e4e8',
  },
});

const ItemSeparator = () => <View style={styles.separator} />;

// 1. The Container Component (Used by Tests)
// We add 'export' so the test file can see it
export const RepositoryListContainer = ({ repositories, onEndReach }: any) => {
  const navigate = useNavigate();

  const repositoryNodes = repositories?.edges
    ? repositories.edges.map((edge: any) => edge.node)
    : [];

  return (
    <FlatList
      data={repositoryNodes}
      ItemSeparatorComponent={ItemSeparator}
      renderItem={({ item }) => (
        <Pressable onPress={() => navigate(`/repository/${item.id}`)}>
          <RepositoryItem item={item} />
        </Pressable>
      )}
      keyExtractor={(item) => item.id}
      onEndReached={onEndReach}
      onEndReachedThreshold={0.5}
    />
  );
};

// 2. The Main Component (Used by the App)
const RepositoryList = () => {
  const { repositories, loading, fetchMore } = useRepositories({
    first: 8,
  });

  const onEndReach = () => {
    fetchMore();
  };

  if (loading && !repositories) {
    return null;
  }

  return (
    <RepositoryListContainer 
      repositories={repositories} 
      onEndReach={onEndReach} 
    />
  );
};

export default RepositoryList;