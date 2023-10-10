import Image from 'next/image';
import { redirect } from 'next/navigation';

import { getMealById } from '@/api/MealDbRequests';
import './detailsCss.css';

export default async function RecipeDetails({ params: { recipeId } }) {
  if (!recipeId) {
    redirect('/');
  }

  const recipeData = await getMealById(recipeId);

  if (!recipeData.strMeal) {
    redirect('/');
  }

  const getIngredient = () => {
    let ingredientsInString = '';

    Object.keys(recipeData)
    .filter((key) => key.includes('strIngredient') && recipeData[key])
    .forEach((key, index) => {
      ingredientsInString += `${recipeData[key]} - ${recipeData[`strMeasure${index + 1}`]}|`
    });
    
    return ingredientsInString.split('|');
  }

  const getEmbedVideo = () => {
    const videoId = recipeData.strYoutube.split('v=');
    return `http://www.youtube.com/embed/${videoId[1]}`;
  }

  return (
    <div className="details-main">
      <section className="title-section">
        <Image
          src={ `${recipeData.strMealThumb}` }
          width={100}
          height={100}
          alt="meal image"
          className="recipe-image"
        />

        <h1>{recipeData.strMeal}</h1>
        { recipeData.strCategory && <h4>{recipeData.strCategory}</h4> }
      </section>

      <ul className="ingredient-section">
        {getIngredient().map((ingredient, index) => (
          <li key={index}>
            {ingredient}
          </li>
        ))}
      </ul>

      <section className="intruction-section">
        { recipeData.strYoutube && <iframe src={ getEmbedVideo() } /> }

        <p className="intructions">
          {recipeData.strInstructions}
        </p>
      </section>
    </div>
  )
}
