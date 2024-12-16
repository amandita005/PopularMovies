import '@testing-library/jest-dom'; 

// Adiciona matchers úteis para testes React

// Mock para o `fetch` global, se necessário
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
);
