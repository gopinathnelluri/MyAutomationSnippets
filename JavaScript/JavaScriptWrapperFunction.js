function wrapMethod(originalFunction) {
  return function () {
    console.log("Function is about to be called.");
    
    // Access the arguments passed to the original function
    const args = arguments;

    // Do something before calling the original function
    console.log("Arguments:", args);

    // Call the original function with the provided arguments
    const result = originalFunction.apply(this, args);

    // Do something after the original function has been called
    console.log("Function has been called.");

    return result;
  };
}

// Example usage:
function myFunction(a, b, c) {
  console.log("Original function called with:", a, b, c);
}

const wrappedFunction = wrapMethod(myFunction);

// Call the wrapped function
wrappedFunction(1, 2, 3);
