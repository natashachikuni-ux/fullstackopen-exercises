import { Text, TextInput, Pressable, View, StyleSheet } from 'react-native';
import { useFormik } from 'formik';
import * as yup from 'yup';
import useSignIn from '../hooks/useSignIn';

const validationSchema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

const initialValues = {
  username: '',
  password: '',
};

const SignIn = () => {
  const [signIn] = useSignIn(); // Hook called inside the component

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      const { username, password } = values;

      try {
        const data = await signIn({ username, password });
        // This confirms the mutation worked!
        console.log('Login successful, token:', data.authenticate.accessToken);
      } catch (e) {
        console.log('Error signing in:', e);
      }
    },
  });

  return (
    <View style={styles.container}>
      <TextInput
        style={[
          styles.input, 
          formik.touched.username && formik.errors.username && styles.inputError
        ]}
        placeholder="Username"
        value={formik.values.username}
        onChangeText={formik.handleChange('username')}
        onBlur={formik.handleBlur('username')}
      />
      {formik.touched.username && formik.errors.username && (
        <Text style={styles.errorText}>{formik.errors.username}</Text>
      )}

      <TextInput
        style={[
          styles.input, 
          formik.touched.password && formik.errors.password && styles.inputError
        ]}
        placeholder="Password"
        secureTextEntry
        value={formik.values.password}
        onChangeText={formik.handleChange('password')}
        onBlur={formik.handleBlur('password')}
      />
      {formik.touched.password && formik.errors.password && (
        <Text style={styles.errorText}>{formik.errors.password}</Text>
      )}

      <Pressable style={styles.button} onPress={() => formik.handleSubmit()}>
        <Text style={styles.buttonText}>Sign In</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: 'white',
    margin: 15,
    borderRadius: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#d73a4a',
  },
  button: {
    backgroundColor: '#0366d6',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    color: '#d73a4a',
    marginBottom: 10,
    marginTop: -5,
  }
});

export default SignIn;