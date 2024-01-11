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


// 3 - test


// Save the original XMLHttpRequest object
const originalXHROpen = window.XMLHttpRequest.prototype.open;
const originalXHRSend = window.XMLHttpRequest.prototype.send;

// Override the open method of XMLHttpRequest
window.XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
  // Add your logic here before the actual open method is called
  console.log(`Intercepted XHR request to ${url} with method ${method}`);

  // Call the original open method
  originalXHROpen.apply(this, arguments);
};

// Override the send method of XMLHttpRequest
window.XMLHttpRequest.prototype.send = function(data) {
  // Save a reference to the XMLHttpRequest object
  const xhr = this;

  // Add your logic here before the actual send method is called
  xhr.addEventListener('load', function() {
    // This event is triggered when the response is received
    console.log('Intercepted XHR response:', xhr.responseText);

    // You can access the response text using xhr.responseText
    // Do something with the response text here
  });

  // Call the original send method
  originalXHRSend.apply(this, arguments);
};


//4 - //


function interceptNetworkRequests(ee) {
    const open = XMLHttpRequest.prototype.open;
    const send = XMLHttpRequest.prototype.send;

    const isRegularXHR = open.toString().indexOf('native code') !== -1;


    // don't hijack if already hijacked - this will mess up with frameworks like Angular with zones
    // we work if we load first there which we can.
    if (isRegularXHR) {
        XMLHttpRequest.prototype.open = function() {
            ee.onOpen && ee.onOpen(this, arguments);
            if (ee.onLoad) {
                this.addEventListener('load', ee.onLoad.bind(ee));
            }
            if (ee.onError) {
                this.addEventListener('error', ee.onError.bind(ee));
            }
            return open.apply(this, arguments);
        };
        XMLHttpRequest.prototype.send = function() {
            ee.onSend && ee.onSend(this, arguments);
            return send.apply(this, arguments);
        };
    }

    const fetch = window.fetch || "";
    // don't hijack twice, if fetch is built with XHR no need to decorate, if already hijacked
    // then this is dangerous and we opt out
    const isFetchNative = fetch.toString().indexOf('native code') !== -1;
    if(isFetchNative) {
        window.fetch = function () {
            ee.onFetch && ee.onFetch(arguments);
            const p = fetch.apply(this, arguments);
            p.then(ee.onFetchResponse, ee.onFetchError);
            return p;
        };
        // at the moment, we don't listen to streams which are likely video 
        const json = Response.prototype.json;
        const text = Response.prototype.text;
        const blob = Response.prototype.blob;
        Response.prototype.json = function () {
            const p = json.apply(this.arguments);
            p.then(ee.onFetchLoad && ee.onFetchLoad.bind(ee, "json"));
            return p;
        };
        Response.prototype.text = function () {
            const p = text.apply(this.arguments);
            p.then(ee.onFetchLoad && ee.onFetchLoad.bind(ee, "text"));
            return p;
        };
        Response.prototype.blob = function () {
            const p = blob.apply(this.arguments);
            p.then(ee.onFetchLoad && ee.onFetchLoad.bind(ee, "blob"));
            return p;
        };
    }
    return ee;
}

interceptNetworkRequests({
    onFetch: console.log,
    onFetchResponse: console.log,
    onFetchLoad: console.log,    
    onOpen: console.log,
    onSend: console.log,
    onError: console.log,
    onLoad: console.log
});
