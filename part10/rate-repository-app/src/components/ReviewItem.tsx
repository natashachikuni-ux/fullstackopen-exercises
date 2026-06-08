import { View, StyleSheet, Text, Pressable, Alert, Platform } from 'react-native';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-native';
import { format } from 'date-fns';

import theme from '../theme';
import { DELETE_REVIEW } from '../graphql/mutations';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 15,
  },
  contentContainer: {
    flexDirection: 'row',
  },
  ratingContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  ratingText: {
    color: theme.colors.primary,
    fontWeight: 'bold',
    fontSize: 18,
  },
  infoContainer: {
    flex: 1,
  },
  usernameText: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  dateText: {
    color: '#586069',
    marginBottom: 5,
  },
  reviewText: {
    lineHeight: 20,
  },
  // New styles for the buttons
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
  },
  viewButton: {
    backgroundColor: theme.colors.primary,
    padding: 15,
    borderRadius: 5,
    flexGrow: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#d73a49', // Red for delete
    padding: 15,
    borderRadius: 5,
    flexGrow: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

// Added isMyReview prop here
const ReviewItem = ({ review, isMyReview, refetch }) => {
  const navigate = useNavigate();
  const [deleteReview] = useMutation(DELETE_REVIEW);

  const handleDelete = () => {
    // Note: Alert.alert only works on mobile. 
    // For web, we use window.confirm
    const confirmDelete = () => {
      deleteReview({ 
        variables: { deleteReviewId: review.id } 
      }).then(() => {
        if (refetch) refetch(); // Exercise 10.23: refresh the list
      });
    };

    if (Platform.OS === 'web') {
      if (window.confirm("Are you sure you want to delete this review?")) {
        confirmDelete();
      }
    } else {
      Alert.alert(
        "Delete review",
        "Are you sure you want to delete this review?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "DELETE", style: "destructive", onPress: confirmDelete }
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>{review.rating}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.usernameText}>
            {isMyReview ? review.repository.fullName : review.user.username}
          </Text>
          <Text style={styles.dateText}>
            {format(new Date(review.createdAt), 'dd.MM.yyyy')}
          </Text>
          <Text style={styles.reviewText}>{review.text}</Text>
        </View>
      </View>

      {/* Show these only on the "My Reviews" page */}
      {isMyReview && (
        <View style={styles.buttonContainer}>
          <Pressable 
            style={styles.viewButton} 
            onPress={() => navigate(`/repository/${review.repository.id}`)}
          >
            <Text style={styles.buttonText}>View repository</Text>
          </Pressable>
          <Pressable style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.buttonText}>Delete review</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default ReviewItem;