export function onRequest(context) {
  const url = new URL(context.request.url);

  if (url.hostname === "www.taotrails.com") {
    url.hostname = "taotrails.com";
    return Response.redirect(url.toString(), 301);
  }

  if (url.protocol === "http:" && url.hostname === "taotrails.com") {
    url.protocol = "https:";
    return Response.redirect(url.toString(), 301);
  }

  return context.next();
}
