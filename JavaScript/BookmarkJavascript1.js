//Sample HTTP post request

!function(){var e=new XMLHttpRequest;e.open("POST","https://example.com/api",!0),e.setRequestHeader("Content-Type","application/xml"),e.onreadystatechange=function(){4===e.readyState&&200===e.status&&console.log("Response:",e.responseText)},e.send("<data><item>Value</item></data>")}();
