const JSESSIONID_REGEX = /JSESSIONID="?([^";]+)"?/;

export async function getCsrfToken() {
  const match = document.cookie.match(JSESSIONID_REGEX);
  return (match && match[1]) || '';
}
