export const randomId = () =>
  "T" +
  Math.random()
    .toString()
    .slice(2, 7);

export const fetchEmoji = () =>
  fetch("https://ranmoji.herokuapp.com/emojis/api/v.1.0/")
    .then(response => response.json())
    .then(data => data.emoji as string);
