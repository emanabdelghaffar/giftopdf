const PDFDocument = require("pdfkit");
const fs = require("fs");
convertFramesToPDF = buffers => {
  // Create a document
  const doc = new PDFDocument();
  for (const img of buffers) {
    doc.image(img);
    doc.addPage();
  }
  doc.end();
  return doc;
};

module.exports = { convertFramesToPDF };
