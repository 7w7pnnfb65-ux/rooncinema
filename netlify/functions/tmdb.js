const TMDB_BASE = 'https://api.themoviedb.org/3';

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
    'Content-Type': 'application/json; charset=utf-8',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const token = process.env.TMDB_API_TOKEN;
  const apiKey = process.env.TMDB_API_KEY;

  if (!token && !apiKey) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'TMDB credentials are not configured' }),
    };
  }

  const prefix = '/.netlify/functions/tmdb';
  let tmdbPath = event.path || '';
  if (tmdbPath.startsWith(prefix)) tmdbPath = tmdbPath.slice(prefix.length);
  if (!tmdbPath.startsWith('/')) tmdbPath = `/${tmdbPath}`;

  const query = new URLSearchParams(event.rawQuery || '');
  if (apiKey && !token) query.set('api_key', apiKey);

  const url = `${TMDB_BASE}${tmdbPath}${query.toString() ? `?${query}` : ''}`;

  try {
    const response = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    const body = await response.text();

    return {
      statusCode: response.status,
      headers,
      body,
    };
  } catch (error) {
    return {
      statusCode: 502,
      headers,
      body: JSON.stringify({ error: 'TMDB request failed' }),
    };
  }
};
