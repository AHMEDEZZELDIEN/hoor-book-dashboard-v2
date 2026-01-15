const API_BACKEND = 'http://185.175.208.37';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    if (url.pathname.startsWith('/api')) {
      const apiPath = url.pathname.replace('/api', '');
      const apiUrl = API_BACKEND + apiPath + url.search;
      
      const apiRequest = new Request(apiUrl, {
        method: request.method,
        headers: request.headers,
        body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : null,
      });
      
      const response = await fetch(apiRequest);
      
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      });
    }
    
    try {
      const response = await env.ASSETS.fetch(request);
      
      if (response.status === 404) {
        const indexRequest = new Request(new URL('/index.html', url.origin), request);
        return env.ASSETS.fetch(indexRequest);
      }
      
      return response;
    } catch (e) {
      const indexRequest = new Request(new URL('/index.html', url.origin), request);
      return env.ASSETS.fetch(indexRequest);
    }
  },
};
