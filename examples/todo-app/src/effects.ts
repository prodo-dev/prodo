export const randomId = () =>
  "T" +
  Math.random()
    .toString()
    .slice(2, 5);

export const fetchEmoji = (text: string) =>
  fetch("https://us-central1-emoji-search-by-prodo.cloudfunctions.net/search", {
    method: "POST",
    body: text,
  })
    .then(response => response.json())
    .then(data => {
      return data[0] as string;
    });
