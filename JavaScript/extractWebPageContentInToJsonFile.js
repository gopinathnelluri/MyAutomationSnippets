// As automation anywhere has alot of issues around extaction of data/field-values from webpages using JavaScript - This is a stable workarround when we are looking for JavaScript-only solutions due to VM Resolution/Recorder command limitations.

function downloadJsonObjectAsFile(jsonObject, fileName = 'data.json') {
  // Convert JSON object to string
  const jsonString = JSON.stringify(jsonObject, null, 2);

  // Create a Blob with the JSON string
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });

  // Create an anchor element to trigger the download
  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = fileName;

  // Add the link to the DOM, click it, and then remove it
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

// Example usage:
const pageDataObj = { 
    key: 'value',
    email: document.querySelector('#email').value
};

downloadJsonObjectAsFile(pageDataObj, 'pageData.json');
