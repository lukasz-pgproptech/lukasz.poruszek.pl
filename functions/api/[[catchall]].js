export async function onRequest(context) {
  const url = new URL(context.request.url);
  const targetUrl = `https://lukasz-poruszek-api.lukasz-main.workers.dev${url.pathname}${url.search}`;
  return fetch(new Request(targetUrl, context.request));
}
