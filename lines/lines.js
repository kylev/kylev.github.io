var PDFDocument = require('pdfkit'),
    blobStream = require('blob-stream');

var doc = new PDFDocument();

function updatePdf(arg) {
  var paper = $('#lines [name=paper]').val();
  var orientation = $('#lines [name=orientation]').val();

  //var newDoc = new jsPDF(orientation, 'pt', paper);
  var newDoc = new PDFDocument();
  var stream = newDoc.pipe(blobStream());
  stream.on('finish', function () {
    var pdfString = stream.toBlobURL('application/pdf');
    $('.preview-pane').attr('src', pdfString);
  });

  var marginAbove;
  var ascender = 3/8;
  var xHeight = 1/4;
  var descender = 3/8;
  var totalHeight = marginAbove + ascender + xHeight + descender;

  newDoc.moveTo(100, 100)
    .lineTo(200, 100)
    .stroke();

  //newDoc.line(2,2,-2,2);

  console.log(newDoc);

  doc = newDoc.end();

  return false;
}

function savePdf() {
  doc.save();
}

window.updatePdf = updatePdf;
window.savePdf = savePdf;
//module.exports.updatePdf = updatePdf;
