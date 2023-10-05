'use client';

import { useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { appContext } from '@/context/AppProvider';
import { getAllMeals } from '@/api/MealDbRequests';

export default function Foods() {
  const { setMealList, mealList, isLoading, setIsLoading } = useContext(appContext);
  const [page, setPage] = useState([0, 10]);

  useEffect(() => {
    const getMeals = async () => {
      const meals = await getAllMeals();
      setMealList(meals);
      setIsLoading(false);
    }

    getMeals();
  }, [setMealList, setIsLoading]);


  return (
    <div className="flex flex-col items-center">
      { mealList.length === 0 && isLoading && <span className="font-bold text-lg text-center">Carregando...</span> }
      { mealList.length === 0 && !isLoading && <span className="font-bold text-lg text-center">Não temos este prato no cardápio!</span> }

      <div className='flex flex-wrap justify-around py-6 md:w-[90%]'>
        {mealList.slice(page[0], page[1]).map((meal) => (
          <Link
            key={meal.idMeal}
            href="http://google.com"
            className="bg-primary-color mb-8 text-white w-[150px] h-[200px] border-solid border-[1px] border-primary-color hover:scale-105 md:w-[210px] md:h-[275px]"
          >
            <Image 
              src={`${meal.strMealThumb}/preview`}
              alt={`${meal.strMeal} thumb`}
              width={150}
              height={200}
              className="md:w-[210px] md:h-[220px]"
            />
            <div className="flex items-center justify-center h-[52px] p-2">
              <h1 className="text-center font-bold italic text-xs md:text-[1rem]">{meal.strMeal}</h1>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
