import { render, screen } from '@testing-library/react-native';
import { RepositoryListContainer } from '../RepositoryList';
import { NativeRouter } from 'react-router-native';

// Safety polyfill for the "non-object" error in React 19 testing environments
if (typeof global.navigator === 'undefined') {
  global.navigator = {
    userAgent: 'node.js',
  } as any;
}

describe('RepositoryList', () => {
  describe('RepositoryListContainer', () => {
    it('renders repository information correctly', () => {
      const repositories = {
        totalCount: 8,
        pageInfo: {
          hasNextPage: true,
          endCursor: 'WyJhc3luYy1saWJyYXJ5LnJlYWN0LWFzeW5jIiwxNTg4NjU2NzUwMDcwXQ==',
          startCursor: 'WyJqYXJlZHBhbG1lci5mb3JtaWsiLDE1ODg2NjAzNTAwNzBd',
        },
        edges: [
          {
            node: {
              id: 'jaredpalmer.formik',
              fullName: 'jaredpalmer/formik',
              description: 'Build forms in React, without the tears',
              language: 'TypeScript',
              forksCount: 1619,
              stargazersCount: 21856,
              ratingAverage: 88,
              reviewCount: 3,
              ownerAvatarUrl: 'https://avatars2.githubusercontent.com/u/1060084?v=4',
            },
            cursor: 'WyJqYXJlZHBhbG1lci5mb3JtaWsiLDE1ODg2NjAzNTAwNzBd',
          },
          {
            node: {
              id: 'async-library.react-async',
              fullName: 'async-library/react-async',
              description: 'Flexible promise-based React component for fetching and displaying data',
              language: 'JavaScript',
              forksCount: 69,
              stargazersCount: 1760,
              ratingAverage: 72,
              reviewCount: 3,
              ownerAvatarUrl: 'https://avatars1.githubusercontent.com/u/54310907?v=4',
            },
            cursor: 'WyJhc3luYy1saWJyYXJ5LnJlYWN0LWFzeW5jIiwxNTg4NjU2NzUwMDcwXQ==',
          },
        ],
      };

      render(
        <NativeRouter>
          <RepositoryListContainer repositories={repositories} />
        </NativeRouter>
      );

      // Check for first repository info
      expect(screen.getByText('jaredpalmer/formik')).toBeTruthy();
      expect(screen.getByText('Build forms in React, without the tears')).toBeTruthy();
      expect(screen.getByText('TypeScript')).toBeTruthy();
      
      // Check for second repository info
      expect(screen.getByText('async-library/react-async')).toBeTruthy();
      expect(screen.getByText('Flexible promise-based React component for fetching and displaying data')).toBeTruthy();
      expect(screen.getByText('JavaScript')).toBeTruthy();

      // Check for formatted numbers
      // Note: If your formatting logic produces different strings (e.g. 1.6k vs 1.6K), 
      // adjust these to match your actual component output.
      expect(screen.getByText('1.6k')).toBeTruthy();
      expect(screen.getByText('21.9k')).toBeTruthy();
      expect(screen.getByText('88')).toBeTruthy();
      expect(screen.getByText('72')).toBeTruthy();
    });
  });
});