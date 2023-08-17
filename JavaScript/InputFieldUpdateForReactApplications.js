(function(){
    function setInputValue(inputElement, newValue) {
      // Set the input value
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      nativeInputValueSetter.call(inputElement, newValue);
   
      // Dispatch input event
      const inputEvent = new Event('input', { bubbles: true });
      inputElement.dispatchEvent(inputEvent);
   
      // Dispatch change event
      const changeEvent = new Event('change', { bubbles: true });
      inputElement.dispatchEvent(changeEvent);
    }
   
    // Usage
    const inputElement = document.querySelector('#\\31 -email');
    setInputValue(inputElement, 'get@gmail.com');
})();


//// ============================

const inputElement = document.querySelector('input'); // Replace with the correct selector for your input field

// Function to dispatch a keyboard event
function dispatchKeyEvent(key, eventType) {
  const event = new KeyboardEvent(eventType, {
    key: key,
    bubbles: true,
    cancelable: true,
    keyCode: key.charCodeAt(0),
  });

  inputElement.dispatchEvent(event);
}

// Simulate typing a string
function simulateTyping(text) {
  for (const char of text) {
    dispatchKeyEvent(char, 'keydown');
    dispatchKeyEvent(char, 'keypress');
    inputElement.value += char;
    dispatchKeyEvent(char, 'keyup');
  }
}

// Call the function to simulate typing
simulateTyping('New Value');




//===============================================================
//Ignore bellow piece of code
//===============================================================
// Backup logic, updating the react internal instance, this might need enhancement to target the right key name.

document.querySelector("#\\31 -email").value = "abcd@gmail.com"
document.querySelector("#\\31 -email").__reactInternalInstance$pehkkcehyqf._currentElement.props.value = "abcd@gmail.com"
document.querySelector("#\\31 -email").__reactInternalInstance$pehkkcehyqf._currentElement._owner._currentElement.props.value = "abcd@gmail.com"
