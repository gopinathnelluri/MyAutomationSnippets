// Create a function to intercept and log responses
function interceptResponses(response) {
  console.log('Intercepted Response:', response);
  return response; // Return the response to keep the flow unchanged
}

// Store the original fetch function
const originalFetch = window.fetch;

// Override the fetch function
window.fetch = function(input, init) {
  // Call the original fetch function
  const fetchPromise = originalFetch.apply(this, arguments);

  // Intercept and log the response when the promise resolves
  return fetchPromise.then(interceptResponses);
};

// Example usage
fetch('https://jsonplaceholder.typicode.com/posts/1')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
