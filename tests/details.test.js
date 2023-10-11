import '@testing-library/jest-dom';;
import { render, screen } from '@testing-library/react';

import Page from '@/app/details/[recipeId]/page';
import { mealsData } from './data/meals-data';

describe('Details section tests:', () => {
  beforeEach( async() => {
    const mockResponse = {
      meals: mealsData,
    };

    global.fetch = jest.fn(() => Promise.resolve({
      status: 200,
      ok: true,
      json: () => Promise.resolve(mockResponse),
    }));

    const props = {
      params: {
        recipeId: mealsData[0].idMeal,
      }
    }

   render(await Page({...props}));
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should have all elements on the dom', async () => {
    const foodImg = screen.getByTestId('food-img');
    const foodName = screen.getByText(mealsData[0].strMeal);
    const ingrdientList = screen.getAllByTestId('ingredient-li');
    const ytVideo = screen.getByTestId('yt-video');
    const instructions = screen.getByTestId('instructions');

    expect(foodImg).toBeInTheDocument();
    expect(foodName).toBeInTheDocument();
    expect(ingrdientList).toHaveLength(14);
    expect(ytVideo).toBeInTheDocument();
    expect(instructions).toBeInTheDocument();
  });
});
