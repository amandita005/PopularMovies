import { useEffect, useState } from 'react';
import axios from 'axios';

const HomePage = () => {
  const [message, setMessage] = useState('');

  const fetchMovie = async (id) => {
    const response = await fetch('http://localhost:4000/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query GetMovie($id: ID!) {
            movie(id: $id) {
              title
              overview
              release_date
            }
          }
        `,
        variables: { id: id },
      }),
    });
  
    const result = await response.json();
    console.log(result.data.movie);  // Aqui você obtém o filme da resposta
  };

  return (
    <div >
      <button onClick={() => fetchMovie('123')}>Click here</button>
    </div>
  );
};

export default HomePage;
