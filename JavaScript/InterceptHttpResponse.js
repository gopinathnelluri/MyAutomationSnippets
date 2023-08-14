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

// ================================================================================================

// Create a function to intercept and log responses
function interceptResponses(xhr) {
  const originalOnReadyStateChange = xhr.onreadystatechange;
  
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) { // When the request is complete
      console.log('Intercepted Response:', xhr);
    }
    
    // Call the original onreadystatechange function
    if (originalOnReadyStateChange) {
      originalOnReadyStateChange.apply(this, arguments);
    }
  };
}

// Store the original XMLHttpRequest constructor
const OriginalXMLHttpRequest = window.XMLHttpRequest;

// Override the constructor
window.XMLHttpRequest = function () {
  const xhr = new OriginalXMLHttpRequest();
  
  // Intercept responses for this instance
  interceptResponses(xhr);

  return xhr;
};

// Example usage
const xhr = new XMLHttpRequest();
xhr.open('GET', 'https://jsonplaceholder.typicode.com/posts/1', true);
xhr.send();
