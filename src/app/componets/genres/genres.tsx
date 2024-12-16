'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

// Interface para representar os dados de um filme
interface Movie {
  id: string;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string | null;
}

// Props para o componente Carousel
interface CarouselProps {
  title: string;
  movies: Movie[];
}

const Genres: React.FC = () => {
  const [actionMovies, setActionMovies] = useState<Movie[]>([]);
  const [comedyMovies, setComedyMovies] = useState<Movie[]>([]);
  const [musicalMovies, setMusicalMovies] = useState<Movie[]>([]);
  const [fictionMovies, setFictionMovies] = useState<Movie[]>([]);
  const [error, setError] = useState(null);

  const router = useRouter();

  useEffect(() => {
    fetchMoviesByCategory();
  }, []);

  const fetchMoviesByCategory = async () => {
    const fetchCategory = async (genre: string) => {
      try {
        const response = await fetch('https://graphql-api-9d65.vercel.app/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `
              query getMoviesGenres($genre: String!) {
                MoviesGenres(genre: $genre) {
                  title
                  overview
                  release_date
                  poster_path
                  id
                }
              }
            `,
            variables: { genre },
          }),
        });

        if (!response.ok) {
          throw new Error(`Erro ao buscar filmes da categoria ${genre}`);
        }

        const data = await response.json();
        return data?.data?.MoviesGenres || [];
      } catch (error){
        console.error('Erro ao buscar filmes:', error);
        throw new Error(`Dados inválidos recebidos para a categoria ${genre}`);
        return [];
      }
    };

    try {
      const [action, comedy, musical, fiction] = await Promise.all([
        fetchCategory('14'),
        fetchCategory('35'),
        fetchCategory('10402'),
        fetchCategory('878'),
      ]);

      setActionMovies(action);
      setComedyMovies(comedy);
      setMusicalMovies(musical);
      setFictionMovies(fiction);
    } catch (error){
      throw new Error(`Dados inválidos recebidos `);
    }
  };

  const navigateToIndividual = (movieId: string) => {
    if (movieId) {
      router.push(`/individual`);
      localStorage.setItem('movieId', movieId);
      console.log('p.1', movieId);
    }
  };

  const CarouselWithArrows: React.FC<CarouselProps> = ({ title, movies }) => {
    const carouselRef = useRef<HTMLDivElement | null>(null);

    const scrollLeft = () => {
      carouselRef.current?.scrollBy({ left: -260, behavior: 'smooth' });
    };

    const scrollRight = () => {
      carouselRef.current?.scrollBy({ left: 260, behavior: 'smooth' });
    };

    return (
      <div className="bg-black">
        <div className="relative p-4">
          <div className="flex items-center">
            <h2 className="text-white text-1xl font-bold ml-4 mr-4">{title || 'Category'}</h2>
            <div className="flex-1 h-[2px] bg-gray-800 mr-4"></div>
          </div>
          <button
            onClick={scrollLeft}
            className="absolute border-r-2 border-white left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-2xl z-10"
          >
            ◀
          </button>
          <div
            ref={carouselRef}
            className="overflow-x-auto whitespace-nowrap scroll-smooth [&::-webkit-scrollbar]:hidden"
          >
            <div className="flex flex-row p-2">
              {movies.map((movie) => (
                <div
                  className="inline-block rounded shadow-lg w-48 flex-shrink-0 cursor-pointer p-1"
                  key={movie.id}
                  onClick={() => navigateToIndividual(movie.id)}
                >
                  <img
                    className="w-full h-72 object-cover shadow-md shadow-white hover:shadow-[0_5px_5px_rgba(0,0,0,0.9)] transition-shadow transition-transform duration-300 ease-in-out hover:scale-105"
                    src={
                      movie?.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie?.poster_path}`
                        : '/fallback-image.jpg'
                    }
                    alt={movie?.title || 'Imagem do filme'}
                  />
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={scrollRight}
            className="border-l-2 border-white absolute right-2 top-1/2 rounded-2xl transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full z-10"
          >
            ▶
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-b from-[#2927b0] to-[#000000] via-[#000000]">
      {error && <div className="text-red-500 text-center">{error}</div>}
      <CarouselWithArrows title="Filmes de ação" movies={actionMovies} />
      <CarouselWithArrows title="Filmes de comédia" movies={comedyMovies} />
      <CarouselWithArrows title="Filmes musicais" movies={musicalMovies} />
      <CarouselWithArrows title="Filmes de ficção-científica" movies={fictionMovies} />
    </div>
  );
};

export default Genres;
