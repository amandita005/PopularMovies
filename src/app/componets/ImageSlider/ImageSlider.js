'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ImageSlider() {
  const [dataPopular, setDataPopular] = useState([]);
  const [positionIndex, setPositionIndex] = useState([0, 1, 2, 3, 4]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPositionIndex((prevIndex) =>
        prevIndex.map((prevIndex) => (prevIndex + 1) % 5)
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const images = [
    dataPopular[0],
    dataPopular[1],
    dataPopular[2],
    dataPopular[3],
    dataPopular[4],
  ].filter(Boolean);

  useEffect(() => {
    fetchPopularMovie();
  }, []);

  const fetchPopularMovie = async () => {
    const response = await fetch('https://graphql-api-9d65.vercel.app/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
                query GetPopularMovies {
                    popularMovies {
                        id
                        title
                        overview
                        release_date
                        poster_path
                    }
                }
            `,
      }),
    });

    const data = await response.json();
    setDataPopular(data.data.popularMovies);
  };

  const positions = ['center', 'left1', 'left', 'right', 'right1'];

  const imageVariants = {
    center: { x: '0%', scale: 1, zIndex: 5 },
    left1: { x: '-60%', scale: 0.7, zIndex: 2 },
    left: { x: '-110%', scale: 0.5, zIndex: 1 },
    right: { x: '110%', scale: 0.5, zIndex: 1 },
    right1: { x: '60%', scale: 0.7, zIndex: 2 },
  };

  return (
    <div className="flex justify-center items-center bg-black h-[78vh] relative pt-12 lg:mb-6 ">
      {dataPopular.length > 0 ? (
        images.map((img, index) => (
          <motion.img
            key={index}
            src={`https://image.tmdb.org/t/p/w500${img.poster_path}`}
            alt={img.title}
            className={`absolute rounded-[12px] ${
              positionIndex[index] === 0
                ? 'w-[90%] sm:w-[80%] md:w-[60%] lg:w-[25%]'
                : 'w-[30%]'
            }`}
            animate={positions[positionIndex[index]]}
            variants={imageVariants}
            transition={{ duration: 0.5 }}
          />
        ))
      ) : (
        <p className="text-white">Carregando...</p>
      )}
    </div>
  );
}
