export async function translateTextPtToEN(text) {
  try {
    const URL = 'https://google-translate1.p.rapidapi.com/language/translate/v2';
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept-Encoding': 'application/gzip',
        'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPID_API_KEY,
        'X-RapidAPI-Host': process.env.NEXT_PUBLIC_RAPID_API_HOST
      },
      body: new URLSearchParams({
        q: text,
        target: 'en',
        source: 'pt'
      })
    }

    const response = await fetch(URL, options);
    const r = await response.json();
    return r.data.translations[0].translatedText;
  } catch(err) {
    return text;
  }
}
