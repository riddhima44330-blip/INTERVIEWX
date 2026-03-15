import pdfParse from 'pdf-parse';

async function test() {
  console.log("pdfParse from 'pdf-parse' type:", typeof pdfParse);
  if (typeof pdfParse !== 'function') {
      console.log("pdfParse keys:", Object.keys(pdfParse || {}));
  }
}
test();
