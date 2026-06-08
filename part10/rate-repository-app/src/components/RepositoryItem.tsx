import { View, Image, Text, StyleSheet, Pressable } from 'react-native';
import * as Linking from 'expo-linking';
import theme from '../theme';

// Helper function to format big numbers
const formatNumber = (num: number) => {
  return num >= 1000 ? (num / 1000).toFixed(1) + 'k' : String(num);
};

const RepositoryItem = ({ item, showGitHubButton }: { item: any, showGitHubButton?: boolean }) => {
  const openGitHub = () => {
    Linking.openURL(item.url);
  };

  return (
    <View style={styles.container}>
      {/* Top Section: Avatar and Info */}
      <View style={styles.topSection}>
        <Image style={styles.avatar} source={{ uri: item.ownerAvatarUrl }} />
        <View style={styles.infoContainer}>
          <Text style={styles.fullName}>{item.fullName}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <View style={styles.languageBadge}>
            <Text style={styles.languageText}>{item.language}</Text>
          </View>
        </View>
      </View>

      {/* Bottom Section: Statistics */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{formatNumber(item.stargazersCount)}</Text>
          <Text style={styles.statLabel}>Stars</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{formatNumber(item.forksCount)}</Text>
          <Text style={styles.statLabel}>Forks</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.reviewCount}</Text>
          <Text style={styles.statLabel}>Reviews</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.ratingAverage}</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
      </View>

      {/* GitHub Button: Only shows if prop is true */}
      {showGitHubButton && (
        <Pressable onPress={openGitHub} style={styles.button}>
          <Text style={styles.buttonText}>Open in GitHub</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: 'white',
  },
  topSection: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
  },
  fullName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  description: {
    color: '#586069',
    marginBottom: 10,
  },
  languageBadge: {
    backgroundColor: theme.colors.primary,
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  languageText: {
    color: 'white',
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    color: '#586069',
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 15,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default RepositoryItem;