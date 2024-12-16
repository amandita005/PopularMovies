'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import NavBar from '../componets/nav/Nav';

async function fetchData(movieId) {
  const movieResponse = await fetch('https://graphql-api-9d65.vercel.app/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        query GetMovie($id: ID!) {
          movie(id: $id) {
            id
            title
            overview
            release_date
            poster_path
            director
          }
        }
      `,
      variables: { id: movieId },
    }),
  });

  const movieData = await movieResponse.json();

  const recommendationsResponse = await fetch('https://graphql-api-9d65.vercel.app/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        query GetRecomendations($id: ID!) {
          moviesRecomendations(id: $id) {
            id
            title
            overview
            release_date
            poster_path
            director
          }
        }
      `,
      variables: { id: movieId },
    }),
  });

  const recommendationsData = await recommendationsResponse.json();

  return {
    movieData: movieData?.data?.movie,
    recommendations: recommendationsData?.data?.moviesRecomendations,
  };
}

export default function Individual() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [data, setData] = useState(null);
  const [rec, setRec] = useState(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const carouselRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    async function loadData() {
      if (id) {
        const { movieData, recommendations } = await fetchData(id);
        setData(movieData);
        setRec(recommendations);
      }
    }

    loadData();
  }, [id]);

  if (!data || !rec) return <p>Loading data...</p>;

  const scrollLeft = () => {
    carouselRef.current.scrollBy({ left: -260, behavior: 'smooth' });
  };

  const scrollRight = () => {
    carouselRef.current.scrollBy({ left: 260, behavior: 'smooth' });
  };

  const navigateToIndividual = (movieId) => {
    window.location.href = `/individual?id=${movieId}`;
  };

  return (
    <div>
      <NavBar />
    
      <div
        className="relative w-full h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w500${data.poster_path})` }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center h-full px-4 lg:px-16 text-white pt-10">
          <div className="hidden lg:block lg:w-1/2 flex justify-end items-center mb-6 lg:mb-0">
            <img
              src={`https://image.tmdb.org/t/p/w500${data.poster_path}`}
              alt={data.title}
              className="pl-10 max-w-full h-auto lg:max-w-[60%] rounded shadow-lg ml-auto mr-auto"
            />
          </div>

          <div className="lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left p-4">
            <h1 className="text-3xl lg:text-6xl font-bold mb-4">{data.title}</h1>
            <p className="text-lg lg:text-xl mb-6 text-justify">{data.overview}</p>

            <div className="grid grid-cols-3 lg:grid-cols-3 gap-4 w-full">
              <div className="flex flex-col items-center lg:items-start">
                <span className="font-bold text-lg">Data:</span>
                <span className="text-lg text-gray-300">{data.release_date || "Data desconhecida"}</span>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <span className="font-bold text-lg">Diretor:</span>
                <span className="text-lg text-gray-300">{data.director || "Diretor desconhecido"}</span>
              </div>
             
            </div>
          </div>
        </div>
      </div>

  
      <div className="relative bg-black pb-8 p-4">
        <div className="flex items-center pt-6 pb-2">
          <h2 className="text-white text-1xl font-bold ml-4 mr-4">Filmes Relacionados</h2>
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
          <div className="flex flex-row">
            {rec.map((movie) => (
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
        </div>

        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full z-10"
        >
          ▶
        </button>
      </div>
    </div>
  );
}
