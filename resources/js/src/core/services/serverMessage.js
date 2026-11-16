/**
 * The server's own words for a refused or failed call, whatever shape the answer takes: `error`, the first
 * validation message, `message`, or the status. With no answer at all, that is said instead.
 *
 * The admin screens swallowed their failures (2026-11-15 frontend audit, FA8): a save that did nothing looked like
 * a save that worked.
 */
export function serverMessage(error, fallback = "") {
  const response = error && error.response;
  const data = response && response.data;

  if (data && typeof data.error === "string" && data.error) return data.error;

  if (data && data.errors && typeof data.errors === "object") {
    const first = Object.values(data.errors)[0];
    const text = Array.isArray(first) ? first[0] : first;

    if (text) return String(text);
  }

  if (data && typeof data.message === "string" && data.message) return data.message;
  if (response) return fallback || `The server refused that (${response.status}).`;

  return "Could not reach the server. Check your connection and try again.";
}

export default serverMessage;
