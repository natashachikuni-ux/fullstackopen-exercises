import { useNavigate } from 'react-router-native';
import { useMutation } from '@apollo/client';
import { StyleSheet, View, Pressable, Text } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';

import FormikTextInput from './FormikTextInput';
import theme from '../theme';
import { CREATE_REVIEW } from '../graphql/mutations';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 15,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

const initialValues = {
  ownerName: '',
  repositoryName: '',
  rating: '',
  text: '',
};

const validationSchema = yup.object().shape({
  ownerName: yup.string().required("Repository owner's name is required"),
  repositoryName: yup.string().required("Repository's name is required"),
  rating: yup
    .number()
    .min(0, 'Rating must be between 0 and 100')
    .max(100, 'Rating must be between 0 and 100')
    .required('Rating is required'),
  text: yup.string(),
});

const CreateReview = () => {
  const [mutate] = useMutation(CREATE_REVIEW);
  const navigate = useNavigate();

  const onSubmit = async (values: typeof initialValues) => {
    const { ownerName, repositoryName, rating, text } = values;

    try {
      const { data } = await mutate({
        variables: {
          review: {
            ownerName,
            repositoryName,
            rating: Number(rating), // Critical: Convert string to integer
            text,
          },
        },
      });

      // Navigate to the repository's view after successful submission
      if (data?.createReview) {
        navigate(`/repository/${data.createReview.repositoryId}`);
      }
    } catch (e) {
      console.log('Mutation error:', e);
    }
  };

  return (
    <View style={styles.container}>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        {({ handleSubmit }) => (
          <View>
            <FormikTextInput name="ownerName" placeholder="Repository owner name" />
            <FormikTextInput name="repositoryName" placeholder="Repository name" />
            <FormikTextInput name="rating" placeholder="Rating between 0 and 100" />
            <FormikTextInput name="text" placeholder="Review" multiline />
            <Pressable onPress={() => handleSubmit()} style={styles.button}>
              <Text style={styles.buttonText}>Create a review</Text>
            </Pressable>
          </View>
        )}
      </Formik>
    </View>
  );
};

export default CreateReview;