const fs = require('fs');

// Define your bookmarks
const bookmarks = [
    { title: 'Google', url: 'https://www.google.com' },
    { title: 'OpenAI', url: 'https://www.openai.com' },
    { title: 'GitHub', url: 'https://www.github.com' }
];

// Create the HTML content for the bookmark file
const htmlContent = `
<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file.
     It will be read and overwritten.
     DO NOT EDIT! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
    ${bookmarks.map(bookmark => `
    <DT><A HREF="${bookmark.url}">${bookmark.title}</A>
    `).join('')}
</DL><p>
`;

// Write the HTML content to a file
fs.writeFileSync('bookmarks.html', htmlContent, 'utf8');
console.log('Bookmark file generated successfully.');
