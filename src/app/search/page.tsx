'use client';

import { useState, useEffect } from 'react';
import { FaSearch, FaArrowLeft } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

interface Movie {
  id: string;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string;
}

const SearchPage = () => {
  const [searchText, setSearchText] = useState(''); 
  const [dataPopular, setDataPopular] = useState<Movie[]>([]); 
  const [filteredBens, setFilteredBens] = useState<Movie[]>([]); 
  const [isSearching, setIsSearching] = useState(false); 
  const router = useRouter();

  useEffect(() => {
    fetchPopularMovies(); 
  }, []);

  useEffect(() => {
    if (searchText) {
      const filtered = dataPopular.filter((movie) =>
        movie.title.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredBens(filtered); 
    } else {
      setFilteredBens(dataPopular); 
    }
  }, [searchText, dataPopular]);

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
      setDataPopular(data?.data?.popularMovies || []); 
    } catch (error) {
      console.error('Erro ao buscar filmes populares:', error);
      setDataPopular([]);
    }
  };

  const handleBack = (): void => {
    router.push('/');
  };

  const navigateToIndividual = (movieId: string) => {
    if (movieId) {
      router.push(`/individual`);
      localStorage.setItem('movieId', movieId);
    }
  };
// 'w-[90%] sm:w-[80%] md:w-[60%] lg:w-[25%]'
  return (
    <div className='bg-black'>
      <nav className="flex items-center p-3 absolute top-0 left-0 w-full h-16 bg-transparent z-50 mt-3">
        <div className="flex ml-6">
          <FaArrowLeft
            className="text-white text-2xl mr-2 cursor-pointer"
            onClick={handleBack}
          />
        </div>
        <div className="flex items-center mr-8 w-[80%]">
          <div className={`w-[90%] transition-all duration-700 flex items-center ${isSearching ? 'translate-x-0' : 'translate-x-full'}`}>
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Buscar..."
              className="w-[43vh] p-2 rounded border border-white bg-transparent text-white focus:outline-none"
            />
          </div>
          {!isSearching && (
            <button className="flex items-center justify-center w-12 h-12 rounded-lg bg-gray-800 hover:bg-gray-700">
              <FaSearch className="text-white text-xl" />
            </button>
          )}
        </div>
      </nav>

      <div className="p-4 pt-20">
        <div className="min-h-screen bg-black p-4">
          {filteredBens.length > 0 ? (
            <div
            className={`grid ${
              filteredBens.length > 5 ? "lg:grid-cols-5" : "lg:grid-cols-5"
            } sm:grid-cols-2 grid-cols-2 gap-4`}
          >     
            {filteredBens.map((movie) => (
                <div
                  key={movie.id}
                  className="rounded shadow-lg cursor-pointer p-1"
                  onClick={() => navigateToIndividual(movie.id)}
                >
                  <img
                    className="w-full h-[30vh] sm:h-[50vh] object-cover shadow-md shadow-white hover:shadow-lg hover:shadow-[0_5px_5px_rgba(0,0,0,0.9)] transition-shadow transition-transform duration-300 ease-in-out hover:scale-105"
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white text-center">Nenhum filme encontrado.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
