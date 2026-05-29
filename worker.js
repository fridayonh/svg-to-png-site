export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    let path = url.pathname;

    if (path === '/' || path === '') {
      path = '/index.html';
    }

    // Static assets are served from the ASSETS binding
    return env.ASSETS.fetch(request);
  },
};
