const pdfParse = require('pdf-parse');
console.log("type:", typeof pdfParse);
if (typeof pdfParse !== 'function') {
  console.log("keys:", Object.keys(pdfParse));
} else {
  console.log("It is a function!");
}
