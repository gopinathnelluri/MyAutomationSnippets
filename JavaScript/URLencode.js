// Approach 1
const fs = require('fs');
const path = require('path');

// Replace with your input folder and output folder paths
const inputFolder = 'input_folder';
const outputFolder = 'output_folder';

// Read all files in the input folder
fs.readdir(inputFolder, (err, files) => {
  if (err) {
    console.error('Error reading input folder:', err);
    return;
  }

  // Filter out only JavaScript files
  const jsFiles = files.filter(file => path.extname(file) === '.js');

  jsFiles.forEach(jsFile => {
    const inputFile = path.join(inputFolder, jsFile);
    const outputFile = path.join(outputFolder, `${jsFile.split('.')[0]}_encoded.js`);

    // Read the JavaScript code from the input file
    fs.readFile(inputFile, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading input file:', err);
        return;
      }

      // URL encode the JavaScript code using encodeURIComponent
      const encodedCode = encodeURIComponent(data);

      // Write the encoded content to the output file
      fs.writeFile(outputFile, encodedCode, 'utf8', err => {
        if (err) {
          console.error('Error writing output file:', err);
          return;
        }
        console.log('URL encoded content written to', outputFile);
      });
    });
  });
});


// Approach 2
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');

// Replace with your input folder and output folder paths
const inputFolder = 'input_folder';
const outputFolder = 'output_folder';

// Read all files in the input folder
fs.readdir(inputFolder, (err, files) => {
  if (err) {
    console.error('Error reading input folder:', err);
    return;
  }

  // Filter out only JavaScript files
  const jsFiles = files.filter(file => path.extname(file) === '.js');

  jsFiles.forEach(jsFile => {
    const inputFile = path.join(inputFolder, jsFile);
    const outputFile = path.join(outputFolder, `${jsFile.split('.')[0]}_encoded.js`);

    // Read the JavaScript code from the input file
    fs.readFile(inputFile, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading input file:', err);
        return;
      }

      // URL encode the JavaScript code
      const encodedCode = querystring.escape(data);

      // Write the encoded content to the output file
      fs.writeFile(outputFile, encodedCode, 'utf8', err => {
        if (err) {
          console.error('Error writing output file:', err);
          return;
        }
        console.log('URL encoded content written to', outputFile);
      });
    });
  });
});

