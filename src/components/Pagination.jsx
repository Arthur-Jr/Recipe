'use client';

import { useContext, useEffect, useState } from 'react';
import { appContext } from '@/context/AppProvider';

export default function Pagination({ setPageMeals }) {
  const MEALS_PER_PAGE = 10;
  const { mealList } = useContext(appContext);
  const [pagesQuantity, setPagesQuantity] = useState(1);
  const [actualPage, setActualPage] = useState(1);

  useEffect(() => {
    setPagesQuantity(Math.ceil(mealList.length / MEALS_PER_PAGE));
  }, [mealList]);

  useEffect(() => {
    const start = (actualPage * MEALS_PER_PAGE) - MEALS_PER_PAGE;
    const finish = actualPage * MEALS_PER_PAGE;

    setPageMeals([start, finish]);
  }, [actualPage, setPageMeals]);

  const getPageNumbers = () => {
    const PAGES_NUMBERS_LIMIT = 2;
    const pagesArray = [];

    for(let pageNumber = actualPage; pagesArray.length < PAGES_NUMBERS_LIMIT && pageNumber <= pagesQuantity ; pageNumber++ ) {
      pagesArray.push(pageNumber);
    }

    if(actualPage > 1) { /* Add previous page into array */
      pagesArray.unshift(actualPage - 1);
    }

    if (actualPage === pagesQuantity && actualPage > 1) { /* If its last page add one more previous page */
      pagesArray.unshift(actualPage - 2);
    }

    if (pagesQuantity > pagesArray[pagesArray.length - 1]) { /* If there is more pages add '...' */
      pagesArray.push('...');
    }

    return pagesArray;
  }

  return (
    <div className="flex justify-evenly items-center min-w-[140px] p-2 h-10 mb-8 font-bold text-lg bg-primary-color text-white rounded-md">
      { actualPage !== 1 && <button onClick={ () => setActualPage((p) => p - 1) }>{'<'}</button> }

      {getPageNumbers().map((page) => (
        <button
          key={page}
          onClick={() => setActualPage(page)}
          disabled={ page === '...' || actualPage === page }
          className={`${actualPage === page && 'disabled:underline'} underline-offset-2 px-1`}
        >
          {page}
        </button>
      ))}

      { pagesQuantity !== actualPage && pagesQuantity > 1 && 
        <button onClick={ () => setActualPage((p) => p + 1) }>{'>'}</button>
      }
    </div>
  )
}
