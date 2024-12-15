const handleError = (message) => {
  document.getElementById('errorMessage').textContent = message;
  document.getElementById('pMessage').classList.remove('hidden');
};

/* Sends post requests to the server using fetch. Will look for various
   entries in the response JSON object, and will handle them appropriately.
*/

const sendPost = async (url, data, type, handler) => {
  const response = await fetch(url, {
    method: `${type}`,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  document.getElementById('pMessage').classList.add('hidden');

  if(result.redirect) {
    window.location = result.redirect;
  }

  if(result.error) {
    handleError(result.error);
  }

  if(handler) {
    handler(result);
  }
};

const hideError = () => {
  document.getElementById('pMessage').classList.add('hidden');
};

module.exports = {
  handleError,
  sendPost,
  hideError,
}