import { Text, StyleSheet } from 'react-native';
import { Link } from 'react-router-native';

const styles = StyleSheet.create({
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    padding: 15,
  },
});

const AppBarTab = ({ title, link }: { title: string; link: string }) => {
  return (
    <Link to={link}>
      <Text style={styles.text}>{title}</Text>
    </Link>
  );
};

export default AppBarTab;