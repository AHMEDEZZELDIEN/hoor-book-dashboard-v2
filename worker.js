const API_BACKEND = 'http://185.175.208.37';

export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);

      if (url.pathname.startsWith('/api')) {
        const apiPath = url.pathname.replace('/api', '');
        const apiUrl = API_BACKEND + apiPath + url.search;

        const headers = new Headers();
        for (const [key, value] of request.headers.entries()) {
          if (!['host', 'cf-connecting-ip', 'cf-ray', 'cf-visitor', 'cf-ipcountry'].includes(key.toLowerCase())) {
            headers.set(key, value);
          }
        }

        const init = {
          method: request.method,
          headers: headers,
        };

        if (request.method !== 'GET' && request.method !== 'HEAD') {
          init.body = request.body;
        }

        const response = await fetch(apiUrl, init);

        const responseHeaders = new Headers(response.headers);
        responseHeaders.set('Access-Control-Allow-Origin', '*');
        responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        if (request.method === 'OPTIONS') {
          return new Response(null, { status: 204, headers: responseHeaders });
        }

        return new Response(response.body, {
          status: response.status,
          headers: responseHeaders,
        });
      }

      const response = await env.ASSETS.fetch(request);
      
      if (response.status === 404) {
        const indexRequest = new Request(url.origin + '/index.html', {
          method: 'GET',
          headers: request.headers,
        });
        return env.ASSETS.fetch(indexRequest);
      }
      
      return response;
    } catch (err) {
      return new Response('Error: ' + err.message, { status: 500 });
    }
  },
};
