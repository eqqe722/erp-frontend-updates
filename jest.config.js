module.exports = {
  transform: {
    '^.+\\.(js|jsx)$': ['babel-jest', { presets: ['@babel/preset-env', '@babel/preset-react'] }],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(axios|react-router-dom|@chakra-ui|react-i18next|jwt-decode)/).+\\.js$'
  ],
  moduleNameMapper: {
    '^axios$': require.resolve('axios'),
    '^axios$': '<rootDir>/src/__mocks__/axios.js',
  },
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleDirectories: ['node_modules', 'src'],
};
