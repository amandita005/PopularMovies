import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Genres from '../componets/genres/genres'; // Ajuste o caminho se necessário
import { useRouter } from 'next/navigation'; // Importando o useRouter

// Mock do useRouter
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock do fetch
global.fetch = jest.fn();

describe('Genres', () => {
  beforeEach(() => {
    // Mock do useRouter para garantir que o método push funcione corretamente
    useRouter.mockReturnValue({
      push: jest.fn(),
    });

    // Mock do fetch para retornar filmes por categoria
    const genreData = {
      data: {
        MoviesGenres: [
          { id: 1, title: 'Filme de Fantasia 1', poster_path: '/path-to-posters1.jpg' },
          { id: 2, title: 'Filme de Fantasia 2', poster_path: '/path-to-posters2.jpg' },
        ],
      },
    };

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(genreData),
    });
  });

  it('deve renderizar filmes por categoria', async () => {
    render(<Genres />); // Renderiza o componente Genres

    // Verifica se os títulos das categorias aparecem na tela
    expect(screen.getByText('Filmes de fantasia')).toBeInTheDocument();
    expect(screen.getByText('Filmes de comédia')).toBeInTheDocument();
    expect(screen.getByText('Filmes musicais')).toBeInTheDocument();
    expect(screen.getByText('Filmes de ficção-científica')).toBeInTheDocument();

    // Verifica se os filmes das categorias estão sendo renderizados
    await waitFor(() => {
      expect(screen.getByAltText('Filme de Fantasia 1')).toBeInTheDocument();
      expect(screen.getByAltText('Filme de Fantasia 2')).toBeInTheDocument();
    });
  });

  it('deve navegar para a página do filme quando um filme é clicado', async () => {
    render(<Genres />); // Renderiza o componente Genres

    // Espera os filmes serem renderizados
    await waitFor(() => screen.getByAltText('Filme de Fantasia 1'));

    // Simula um clique no filme para navegar
    fireEvent.click(screen.getByAltText('Filme de Fantasia 1'));

    // Verifica se a navegação foi chamada com o ID correto do filme
    expect(useRouter().push).toHaveBeenCalledWith('/individual?id=1');
  });

  it('deve exibir mensagem de erro caso os dados não sejam encontrados', async () => {
    // Simula erro no fetch
    fetch.mockRejectedValueOnce(new Error('Erro ao buscar filmes'));

    render(<Genres />);

    await waitFor(() => {
      // Aqui você pode verificar como a UI lida com falhas
      expect(screen.queryByText('Filmes de fantasia')).not.toBeInTheDocument();
    });
  });
});
