import { render, screen, waitFor } from '@testing-library/react';
import SearchPage from '../search/page'; // Verifique se o caminho está correto

import { useRouter } from 'next/router';

// Mock do useRouter
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('SearchPage', () => {
  it('deve renderizar os filmes populares', () => {
    // Defina o comportamento do useRouter
    useRouter.mockReturnValue({
      query: {},
      push: jest.fn(),
    });

    // Seu código de teste aqui
  });
});

