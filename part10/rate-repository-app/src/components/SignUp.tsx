import { useNavigate } from 'react-router-native';
import { useMutation } from '@apollo/client';
import { StyleSheet, View, Pressable, Text } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';

import FormikTextInput from './FormikTextInput';
import theme from '../theme';
import { CREATE_USER } from '../graphql/mutations';

const styles = StyleSheet.create({
  container: { backgroundColor: 'white', padding: 15 },
  button: {
    backgroundColor: theme.colors.primary,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});

const validationSchema = yup.object().shape({
  username: yup.string().min(3).max(30).required('Username is required'),
  password: yup.string().min(5).max(50).required('Password is required'),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords do not match')
    .required('Password confirmation is required'),
});

const SignUp = () => {
  const [mutate] = useMutation(CREATE_USER);
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    const { username, password } = values;
    try {
      await mutate({ variables: { user: { username, password } } });
      // Usually, you'd auto-login here, but for the exercise, 
      // navigating to sign-in is a good start!
      navigate('/signin');
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      <Formik
        initialValues={{ username: '', password: '', passwordConfirm: '' }}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        {({ handleSubmit }) => (
          <View>
            <FormikTextInput name="username" placeholder="Username" />
            <FormikTextInput name="password" placeholder="Password" secureTextEntry />
            <FormikTextInput name="passwordConfirm" placeholder="Password confirmation" secureTextEntry />
            <Pressable onPress={() => handleSubmit()} style={styles.button}>
              <Text style={styles.buttonText}>Sign up</Text>
            </Pressable>
          </View>
        )}
      </Formik>
    </View>
  );
};

export default SignUp;