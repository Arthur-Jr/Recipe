import React from 'react';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { appContext } from '@/context/AppProvider';
import { Foods } from '@/components';
import { mealsData } from './data/meals-data';

describe('Foods section tests:', () => {
  let mealList = [];
  let isLoading = true;
  const setMealList = jest.fn((meals) => mealList = meals);
  const setIsLoading = jest.fn((status) => isLoading = status);

  beforeEach(() => {
    const mockResponse = {
      meals: [...mealsData, ...mealsData, ...mealsData],
    }

    global.fetch = jest.fn(() => Promise.resolve({
      status: 200,
      ok: true,
      json: () => Promise.resolve(mockResponse),
    }))

    render(
      <appContext.Provider value={{ setMealList, mealList, isLoading, setIsLoading }}>
        <Foods />
      </appContext.Provider>
    );
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should have loading message when there is no food on array and is loading is true', () => {
    const loadingMessage = screen.getByText(/carregando/i);
    expect(loadingMessage).toBeInTheDocument();
  });

  it('should have 3 food card on dom.', () => {
    const foodCards = screen.getAllByTestId('food-card');

    expect(foodCards).toHaveLength(10);
  });

  it('should have 2 pages e "..."', () => {
    const pageNumbers = screen.getAllByTestId('page-numbers');

    expect(pageNumbers).toHaveLength(3);
    expect(pageNumbers[2].innerHTML).toBe('...');
  });

  it('should test all pagination conditions.', async () => {
    let pageNumbers = screen.getAllByTestId('page-numbers');
    let prevButton = screen.queryByText('<');
    const nextButton = screen.getByText('>');
    await act(() => userEvent.click(pageNumbers[1]));

    expect(prevButton).toBe(null);
    expect(nextButton).toBeInTheDocument();

    const foodCards = screen.getAllByTestId('food-card');
    expect(foodCards).toHaveLength(10);
    pageNumbers = screen.getAllByTestId('page-numbers');
    prevButton = screen.queryByText('<');
    
    expect(pageNumbers).toHaveLength(4);
    expect(prevButton).toBeInTheDocument();
    expect(pageNumbers[0].innerHTML).toBe('1');
    expect(pageNumbers[1].innerHTML).toBe('2');
    expect(pageNumbers[2].innerHTML).toBe('3');
    expect(pageNumbers[3].innerHTML).toBe('...');
  });
});
