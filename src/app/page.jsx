'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import NavBar from './componets/nav/Nav';
import ImageSlider from './componets/ImageSlider/ImageSlider';
import Genres from './componets/genres/genres';

const HomePage = () => {
  const [dataPopular, setDataPopular] = useState([]);
  const [searchText, setSearchText] = useState(''); // Texto da busca
  const [filteredMovies, setFilteredMovies] = useState([]);
  const router = useRouter();
  const carouselRef = useRef(null); // Referência para o carrossel

  useEffect(() => {
    fetchPopularMovie(); // Faz o fetch dos filmes populares ao carregar a página
  }, []);

  const navigateToIndividual = (movieId) => {
    if (movieId) {
      router.push(`/individual`);
      localStorage.setItem('movieId', movieId);
      console.log("p.1", movieId)
    }
  };

  const fetchPopularMovie = async () => {
    console.log("Fetching popular movies...");

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
    console.log(data); // Verifique o formato da resposta da API

    setDataPopular(data.data.popularMovies); // Certifique-se de que o caminho está correto
  };

  if (!dataPopular) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <h1 className="text-white text-2xl">Loading...</h1>
      </div>
    );
  }

  const scrollLeft = () => {
    carouselRef.current.scrollBy({ left: -260, behavior: 'smooth' });
  };

  const scrollRight = () => {
    carouselRef.current.scrollBy({ left: 260, behavior: 'smooth' });
  };

  const CarouselWithArrows = ({ dataPopular }) => {
    return (
      <div className="bg-black">
        <NavBar />
        <ImageSlider />
        <div className="relative p-4">
          <div className="flex items-center">
            <h2 className="text-white text-1xl font-bold ml-4 mr-4">Popular Movies</h2>
            <div className="flex-1 h-[2px] bg-gray-800 mr-4"></div>
          </div>

          <div className="overflow-x-auto whitespace-nowrap scroll-smooth [&::-webkit-scrollbar]:hidden" ref={carouselRef}>
            <button
              onClick={scrollLeft}
              className="absolute border-r-2 border-white left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-2xl z-10"
            >
              ◀
            </button>
            <div className="flex flex-row p-2">
              {dataPopular.map((movie) => (
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
                        : 'fallback-image.jpg'
                    }
                    alt={movie?.title}
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

  return (
    <div className="bg-gradient-to-b from-[#2927b0] to-[#000000] via-[#000000]">
      <CarouselWithArrows dataPopular={dataPopular} />
      <Genres />
    </div>
  );
};

export default HomePage;
