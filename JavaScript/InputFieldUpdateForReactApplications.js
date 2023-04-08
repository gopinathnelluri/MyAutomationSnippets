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


//===============================================================
//Ignore bellow piece of code
//===============================================================
// Backup logic, updating the react internal instance, this might need enhancement to target the right key name.

document.querySelector("#\\31 -email").value = "abcd@gmail.com"
document.querySelector("#\\31 -email").__reactInternalInstance$pehkkcehyqf._currentElement.props.value = "abcd@gmail.com"
document.querySelector("#\\31 -email").__reactInternalInstance$pehkkcehyqf._currentElement._owner._currentElement.props.value = "abcd@gmail.com"
