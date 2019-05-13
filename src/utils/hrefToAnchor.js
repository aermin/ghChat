export function hrefToAnchor(content, className) {
  // eslint-disable-next-line no-useless-escape
  const exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
  return content.replace(exp, `<a target="_blank" class="${className || ''}" href="$1">$1</a>`);
}
