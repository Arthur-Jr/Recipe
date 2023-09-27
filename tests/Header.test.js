import React from 'react';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { appContext } from '@/context/AppProvider';
import { Header } from '@/components';
import { categories } from '@/constants/mealsCategories';

const FIVE_SECONDS = 5000;

describe('Header Tests:', () => {
  const setMealList = jest.fn();

  beforeEach(() => {
    const mockResponse = {
      data: {
        translations: [{ translatedText: '' }],
      },
      meals: [],
    }

    global.fetch = jest.fn(() => Promise.resolve({
      status: 200,
      ok: true,
      json: () => Promise.resolve(mockResponse),
    }))

    render(
      <appContext.Provider value={{ setMealList }}>
        <Header />
      </appContext.Provider>
    );
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('Search option input: should exist 2 radio input of search-option', () => {
    const radioInput = screen.getAllByLabelText(/buscar por/i);

    expect(radioInput).toHaveLength(2);
    expect(radioInput[0]).toBeChecked();
    expect(radioInput[1]).not.toBeChecked();
    radioInput.forEach((input) => expect(input).toBeInTheDocument());
  });

  it('Search option input: should change the checked input on click', async () => {
    const radioInput = screen.getAllByLabelText(/buscar por/i);
    await act(() => userEvent.click(radioInput[1]));

    expect(radioInput[1]).toBeChecked();
    expect(radioInput[0]).not.toBeChecked();
  });

  it('Search text input: should have the input on the document and his value should change onChange ', async () => {
    const textInput = screen.getByPlaceholderText(/O que vamos comer hoje?/i);

    expect(textInput).toBeInTheDocument();
    expect(textInput.value).toBe('');

    await act(() => userEvent.type(textInput, 'test'));
    expect(textInput.value).toBe('test');
  });

  it('Search text input: should have the language buttons and active when is clicked', async () => {
    const ptButton = screen.getByTestId('pt-btn');
    const enButton = screen.getByTestId('en-btn');

    expect(ptButton).toBeInTheDocument();
    expect(enButton).toBeInTheDocument();
    expect(ptButton.classList.contains('bg-gray-400')).toBeTruthy();
    expect(enButton.classList.contains('bg-gray-400')).toBeFalsy();

    await act(() => userEvent.click(enButton));
    expect(ptButton.classList.contains('bg-gray-400')).toBeFalsy();
    expect(enButton.classList.contains('bg-gray-400')).toBeTruthy();
  });
  
  it('Search text input: should have the search button and call fetch only 1 time if text input is empty', async () => {
    const searchBtn = screen.getByText(/pesquisar/i);

    expect(searchBtn).toBeInTheDocument();
    await act(() => userEvent.click(searchBtn));
    expect(global.fetch).toBeCalledTimes(1);
    expect(searchBtn).toBeDisabled();
    expect(setMealList).toBeCalledTimes(1);
    setTimeout(() => expect(searchBtn).toBeEnabled(), FIVE_SECONDS);
  });

  it('Search text input: should call fetch 2 times if text input has something and the language is PT', async () => {
    const textInput = screen.getByPlaceholderText(/O que vamos comer hoje?/i);
    const ptButton = screen.getByTestId('pt-btn');
    const searchBtn = screen.getByText(/pesquisar/i);

    expect(ptButton.classList.contains('bg-gray-400')).toBeTruthy();
    expect(searchBtn).toBeInTheDocument();

    await act(() => userEvent.type(textInput, 'test'));
    await act(() => userEvent.click(searchBtn));
  
    expect(global.fetch).toBeCalledTimes(2);
    expect(searchBtn).toBeDisabled();
    expect(setMealList).toBeCalledTimes(2);
    setTimeout(() => expect(searchBtn).toBeEnabled(), FIVE_SECONDS);
  });

  it('Search text input: should call fetch 1 time if text input has something and the language is EN', async () => {
    const textInput = screen.getByPlaceholderText(/O que vamos comer hoje?/i);
    const enButton = screen.getByTestId('en-btn');
    const searchBtn = screen.getByText(/pesquisar/i);

    expect(searchBtn).toBeInTheDocument();

    await act(() => userEvent.click(enButton));
    expect(enButton.classList.contains('bg-gray-400')).toBeTruthy();

    await act(() => userEvent.type(textInput, 'test'));
    await act(() => userEvent.click(searchBtn));
  
    expect(global.fetch).toBeCalledTimes(1);
    expect(searchBtn).toBeDisabled();
    expect(setMealList).toBeCalledTimes(3);
    setTimeout(() => expect(searchBtn).toBeEnabled(), FIVE_SECONDS);
  });

  it('Category filter: should have 9 options', () => {
    const cateoryRadios = screen.getAllByTestId('category-radio');

    expect(cateoryRadios).toHaveLength(9);
    cateoryRadios.forEach((category) => {
      expect(categories[category.id]).toBeTruthy();
    });
  });

  it('Category filter: should call fecth 1 time when clicked and disbale buttons for 6 secs', async () => {
    const cateoryRadios = screen.getAllByTestId('category-radio');

    await act(() => userEvent.click(cateoryRadios[0]));
    expect(global.fetch).toBeCalledTimes(1);
    expect(setMealList).toBeCalledTimes(4);
    expect(cateoryRadios[0]).toBeDisabled();
    expect(cateoryRadios[1]).toBeDisabled();
    expect(cateoryRadios[2]).toBeDisabled();
    setTimeout(() => {
      expect(cateoryRadios[0]).toBeEnabled();
      expect(cateoryRadios[1]).toBeEnabled();
      expect(cateoryRadios[2]).toBeEnabled();
    }, FIVE_SECONDS);
  });
});
