module.exports = {
    preset: 'ts-jest', // Usa o ts-jest para TypeScript
    testEnvironment: 'jest-environment-jsdom', // Necessário para testes React
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest', // Transforma arquivos TypeScript
      '^.+\\.(js|jsx)$': 'babel-jest', // Transforma arquivos JavaScript usando Babel
    },
    moduleNameMapper: {
      '\\.(css|scss)$': 'identity-obj-proxy', // Mock para arquivos de estilo
      '@/(.*)$': '<rootDir>/src/$1', // Suporte ao alias "@"
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // Configuração adicional do Jest
  };
  

  
