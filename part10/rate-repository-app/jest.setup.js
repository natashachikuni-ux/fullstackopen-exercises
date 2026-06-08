// jest.setup.js

// Manually initialize globals that jest-expo tries to define properties on
global.navigator = {
  userAgent: 'node.js',
};

global.location = {
  href: '',
  authenticate: () => {},
};

// Mock standard React Native modules that often cause issues in Jest 29/Node 20+
import 'react-native-gesture-handler/jestSetup';

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Silence the irony of logging errors during tests
console.error = (message) => {
  if (message.includes('test-renderer')) return;
};

// jest.setup.js

// ... (keep the navigator and location mocks at the top)

jest.mock('expo-linking', () => ({
  createURL: (str) => str,
  openURL: jest.fn(),
  useURL: () => null,
}));

// A simpler mock that doesn't trigger a module lookup
jest.mock('expo-constants', () => ({
  default: {
    expoConfig: {
      extra: {
        env: 'test',
      },
    },
  },
}));