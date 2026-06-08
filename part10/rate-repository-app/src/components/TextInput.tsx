import { TextInput as NativeTextInput, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  input: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#abb2bf',
    marginBottom: 10,
  },
  errorInput: {
    borderColor: '#d73a49',
  },
});

const TextInput = ({ style, error, ...props }) => {
  const textInputStyle = [styles.input, style, error && styles.errorInput];

  return <NativeTextInput style={textInputStyle} {...props} />;
};

export default TextInput;