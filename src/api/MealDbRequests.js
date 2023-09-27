const ENDPOINT = 'https://www.themealdb.com/api/json/v1/1'

export async function inputTextRequest(searchOption = 'name', text = '') {
  try {
    const chosedEndpoint = searchOption === 'name' ? `${ENDPOINT}/search.php?s` : `${ENDPOINT}/filter.php?i`;
    const response = await fetch(`${chosedEndpoint}=${text}`);
    const result = await response.json();
    return result.meals;
  } catch (err) {
    return [];
  }
}

export async function getMealById(id) {
  try {
    const response = await fetch(`${ENDPOINT}/lookup.php?i=${id}`);
    const result = await response.json();
    return result.meals;
  } catch (err) {
    return {};
  }
}

export async function getMealByCategory(category) {
  try {
    const response = await fetch(`${ENDPOINT}/filter.php?c=${category}`);
    const result = await response.json();
    return result.meals;
  } catch (err) {
    return [];
  }
}
