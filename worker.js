const API_BACKEND = 'https://hoorbookapp.com';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    if (url.pathname.startsWith('/api')) {
      try {
        const apiPath = url.pathname.replace('/api', '');
        const apiUrl = API_BACKEND + apiPath + url.search;
        
        const headers = new Headers();
        for (const [key, value] of request.headers.entries()) {
          if (key.toLowerCase() !== 'host') {
            headers.set(key, value);
          }
        }
        
        const apiRequest = new Request(apiUrl, {
          method: request.method,
          headers: headers,
          body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : null,
        });
        
        const response = await fetch(apiRequest);
        
        const responseHeaders = new Headers(response.headers);
        responseHeaders.set('Access-Control-Allow-Origin', '*');
        
        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: responseHeaders,
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }
    
    try {
      const response = await env.ASSETS.fetch(request);
      if (response.status === 404 || !response.ok) {
        return env.ASSETS.fetch(new URL('/index.html', url.origin));
      }
      return response;
    } catch (e) {
      return env.ASSETS.fetch(new URL('/index.html', url.origin));
    }
  },
};
