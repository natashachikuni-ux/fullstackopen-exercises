import { Platform } from 'react-native';

const theme = {
  colors: {
    textPrimary: '#24292e',
    textSecondary: '#586069',
    primary: '#0366d6',
    appBarBackground: '#24292e',
    mainBackground: '#e1e4e8',
  },
  fontSizes: {
    body: 14,
    subheading: 16,
  },
  fonts: {
    // Here is the magic! It detects the OS and picks the right font.
    main: Platform.select({
      android: 'Roboto',
      ios: 'Arial',
      default: 'System', // 'System' acts as the fallback for web
    }),
  },
  fontWeights: {
    normal: '400' as const,
    bold: '700' as const,
  },
};

export default theme;