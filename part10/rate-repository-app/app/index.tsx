import { NativeRouter } from 'react-router-native';
import Main from '../src/components/Main';

export default function Index() {
  return (
    <NativeRouter>
      <Main />
    </NativeRouter>
  );
}