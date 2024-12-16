'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import NavBar from './componets/nav/Nav';
import ImageSlider from './componets/ImageSlider/ImageSlider';
import Genres from './componets/genres/genres';

interface Movie {
  id: string;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string;
}

const HomePage = () => {
  const [dataPopular, setDataPopular] = useState<Movie[]>([]); // Definição explícita de tipo
  const [searchText, setSearchText] = useState<string>(''); // Texto da busca
  const router = useRouter();
  const carouselRef = useRef<HTMLDivElement | null>(null); // Referência do carrossel

  useEffect(() => {
    fetchPopularMovies(); // Chama a função para buscar os filmes populares
  }, []);

  const fetchPopularMovies = async () => {
    try {
      const response = await fetch('https://graphql-api-9d65.vercel.app/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `query GetPopularMovies {
            popularMovies {
              title
              overview
              release_date
              poster_path
              id
            }
          }`,
        }),
      });

      const data = await response.json();
      setDataPopular(data?.data?.popularMovies || []); // Garantir que a resposta tenha dados
    } catch (error) {
      console.error('Erro ao buscar filmes populares:', error);
      setDataPopular([]); // Caso ocorra erro, a lista de filmes ficará vazia
    }
  };

  const navigateToIndividual = (movieId: string) => {
    if (movieId) {
      router.push(`/individual`);
      localStorage.setItem('movieId', movieId); // Armazenar ID do filme no localStorage
    }
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -260, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 260, behavior: 'smooth' });
    }
  };

  const CarouselWithArrows = ({ dataPopular }: { dataPopular: Movie[] }) => {
    return (
      <div className="bg-black">
        <NavBar />
        <ImageSlider />
        <div className="relative p-4">
          <div className="flex items-center">
            <h2 className="text-white text-xl font-bold ml-4 mr-4">Popular Movies</h2>
            <div className="flex-1 h-[2px] bg-gray-800 mr-4"></div>
          </div>

          <div
            className="overflow-x-auto whitespace-nowrap scroll-smooth [&::-webkit-scrollbar]:hidden"
            ref={carouselRef}
          >
            <button
              onClick={scrollLeft}
              className="absolute border-r-2 border-white left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-2xl z-10"
            >
              ◀
            </button>
            <div className="flex flex-row p-2">
              {dataPopular.map((movie) => (
                <div
                  key={movie.id}
                  className="inline-block rounded shadow-lg w-48 flex-shrink-0 cursor-pointer p-1"
                  onClick={() => navigateToIndividual(movie.id)}
                >
                  <img
                    className="w-full h-72 object-cover shadow-md shadow-white hover:shadow-[0_5px_5px_rgba(0,0,0,0.9)] transition-shadow transition-transform duration-300 ease-in-out hover:scale-105"
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                  />
                </div>
              ))}
            </div>
            <button
              onClick={scrollRight}
              className="border-l-2 border-white absolute right-2 top-1/2 rounded-2xl transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full z-10"
            >
              ▶
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (!dataPopular.length) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <h1 className="text-white text-2xl">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-[#2927b0] to-[#000000] via-[#000000]">
      <CarouselWithArrows dataPopular={dataPopular} />
      <Genres />
    </div>
  );
};

export default HomePage;
