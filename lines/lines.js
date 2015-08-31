var PDFDocument = require('pdfkit'),
    blobStream = require('blob-stream');

var doc = new PDFDocument();

var colors = ['green', 'black', 'black', 'red'];

function updatePdf(arg) {
  var paper = $('#lines [name=paper]').val();
  var orientation = $('#lines [name=orientation]').val();


  var newDoc = new PDFDocument({
    size: paper,
    layout: orientation
  });

  var stream = newDoc.pipe(blobStream());
  stream.on('finish', function () {
    var pdfString = stream.toBlobURL('application/pdf');
    $('.preview-pane').attr('src', pdfString);
  });

  console.log("New doc is high: " + newDoc.page.height);

  var marginAbove = 20;
  // TODO this is currently 3:2:3 for Copperplate
  var xHeight = 18;
  var ascender = xHeight / 2 * 3;
  var descender = xHeight / 2 * 3;
  var totalHeight = marginAbove + ascender + xHeight + descender;

  var repeatCount = Math.floor(newDoc.page.height / totalHeight);
  var leftPoint = 20;
  var rightPoint = newDoc.page.width - leftPoint;

  //repeatCount = 1;
  //console.log("repeat " + repeatCount + "left" + leftPoint + 'right' + rightPoint);

  for (var i = 0, offset = 0; i < repeatCount; i++, offset += totalHeight) {
    [marginAbove, ascender, xHeight, descender].reduce(function (base, additional, idx) {
      var lineAt = base + additional;
      console.log('blah ' + base + 'add ' + additional, " idx" + idx);
      newDoc.moveTo(leftPoint, lineAt)
        .lineTo(rightPoint, lineAt)
        .stroke(colors[idx]);

      return lineAt;
    }, offset);
  }

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
