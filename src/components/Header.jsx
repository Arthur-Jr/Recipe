'use client';

import { useContext, useState } from 'react';
import { categories } from '../constants/mealsCategories';
import { getMealByCategory, inputTextRequest } from '@/api/MealDbRequests';
import { translateTextPtToEN } from '@/api/translateApi';
import { appContext } from '@/context/AppProvider';

export default function Header() {
  const searchOptionList = ['name', 'ingredient'];
  const SIX_SECONDS = 6000;
  const [searchOption, setSearchOption] = useState('name');
  const [textInputValue, setTextInputValue] = useState('');
  const [searchLanguage, setSearchLanguage] = useState('PT');
  const [isDisabled, setIsDisabled] = useState(false);

  const { setMealList } = useContext(appContext);

  const handleTranslate = async () => {
    const result = await translateTextPtToEN(textInputValue);
    return result;
  }

  const handleTextInputSearh = async () => {
    let textToSearch = textInputValue;

    setIsDisabled(true);
    setTimeout(() => setIsDisabled(false), SIX_SECONDS);
  
    if (searchLanguage === 'PT') {
      textToSearch = await handleTranslate();
    }

    const meals = await inputTextRequest(searchOption, textToSearch);
    setMealList(meals);
  }

  const handleRadioButtonSearch = async (category) => {
    setIsDisabled(true);
    setTimeout(() => setIsDisabled(false), SIX_SECONDS);

    const meals = await getMealByCategory(category);
    setMealList(meals);
  }

  return (
    <header className="flex flex-col h-56 w-full items-center">
      <form className="flex flex-col items-center justify-around h-40 w-full bg-primary-color md:justify-evenly">
        <div className="flex items-center justify-between w-full px-2 text-white min-[450px]:w-[400px]">
          {searchOptionList.map((option) => (
            <label
              key={ option }
              htmlFor={ option }
              className="flex items-center italic font-bold text-sm hover:cursor-pointer sm:text-base"
            >
              Buscar por { option === 'name' ? 'Nome' : 'Ingrediente' }

              <input
                type="radio"
                value={ option }
                id={ option }
                name="search-option"
                onChange={({ target }) =>  setSearchOption(target.value)}
                className="ml-2 h-[16px] w-[16px] hover:cursor-pointer"
                defaultChecked={ option === 'name' }
              />
            </label>
          ))}
        </div>

        <div className="flex flex-col justify-between items-center w-[95%] h-[90px] md:w-[70%] sm:flex-row">
          <label htmlFor="input-text" className="flex w-full">
            <input
              type="text"
              value={ textInputValue }
              id="input-text"
              name="text-search"
              onChange={ ({ target }) =>  setTextInputValue(target.value)}
              placeholder="O que vamos comer hoje?"
              autoComplete="off"
              className="w-[90%] p-2 rounded-xl rounded-r-none focus:outline-none sm:w-[87%]"
            />

            <button
              type="button"
              onClick={() => { setSearchLanguage('PT'), setTextInputValue('') }}
              className={`${searchLanguage === 'PT' ? 'bg-gray-400' : 'bg-white'} h-[40px] p-1 text-sm`}
            >
              PT
            </button>

            <button
              type="button"
              onClick={() => { setSearchLanguage('EN'), setTextInputValue('') }}
              className={`${searchLanguage === 'EN' ? 'bg-gray-400' : 'bg-white'} h-[40px] p-1 text-sm rounded-r-xl`}
            >
              EN
            </button>
          </label>

          <button
            type="button"
            onClick={ () => handleTextInputSearh() }
            disabled={ isDisabled }
            className={`w-36 p-2 rounded-xl font-bold italic bg-white hover:scale-105 ${ isDisabled && 'hover:cursor-not-allowed' }`}
          >
            Pesquisar
          </button>
        </div>
      </form>

      <form className="flex items-start w-full h-12 mt-2 overflow-x-scroll whitespace-nowrap md:overflow-hidden md:justify-around">
        {Object.keys(categories).map((category) => (
          <label
            htmlFor={ category }
            key={ category }
            className={
              `flex justify-center rounded-xl p-2 mx-1 bg-primary-color italic text-white capitalize font-semibold text-sm hover:scale-105 hover:cursor-pointer ${ isDisabled && 'hover:cursor-not-allowed'} md:w-[120px]`
            }
          >
            { category }
            <input
              type="radio"
              value={ category }
              name="filter"
              id={ category }
              disabled={ isDisabled }
              onClick={ () => handleRadioButtonSearch(categories[category]) }
              className="hidden"
            />
          </label>
        ))}
      </form>
    </header>
  )
}
