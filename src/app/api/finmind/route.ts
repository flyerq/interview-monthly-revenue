import axios from 'axios';
import type {NextRequest} from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const {searchParams} = new URL(request.url);

    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    console.log({params});

    const response = await axios.get('https://api.finmindtrade.com/api/v4/data', {
      params,
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkYXRlIjoiMjAyNS0wOC0wNyAxODoyNDowMSIsInVzZXJfaWQiOiJmbHllciIsImlwIjoiMjEyLjg3LjE5NC42MyJ9.meFJWXc88-R3fDfVz5-015Lzkzll1P0gW1OsHYG3bGY',
      },
    });

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: {'Content-Type': 'application/json'},
    });
  } catch (error) {
    console.error('Finmind API proxy error:', error instanceof Error ? error.message : error);
    return new Response(JSON.stringify({error: '代理请求失败'}), {
      status: 500,
      headers: {'Content-Type': 'application/json'},
    });
  }
}
