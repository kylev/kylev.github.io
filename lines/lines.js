var PDFDocument = require('pdfkit'),
    blobStream = require('blob-stream');

var doc = new PDFDocument().end();

var colors = ['green', 'black', 'black', 'red'];

var ratios = {
  x1: function (x) { return x; },
  x2: function (x) { return x * 2; },
  x3: function (x) { return x * 3; },
  r32: function (x) { return x / 2 * 3; }
};

function updatePdf() {
  var paper = $('#lines [name=paper]').val();
  var orientation = $('#lines [name=orientation]').val();
  var xHeight = $('#lines [name=xHeight]').val() * 1;
  var adRatio = $('#lines [name=adHeight]').val();
  var includeXMark = $('#lines [name=includeXMark]').prop('checked');

  var newDoc = new PDFDocument({
    size: paper,
    layout: orientation
  });

  var stream = newDoc.pipe(blobStream());
  stream.on('finish', function () {
    var pdfString = stream.toBlobURL('application/pdf');
    $('.preview-pane').attr('src', pdfString);
  });
  //console.log("New doc is high: " + newDoc.page.height);

  var marginAbove = 20;
  // TODO this is currently 3:2:3 for Copperplate
  var ascender = ratios[adRatio].call(null, xHeight);
  var descender = ascender;
  var totalHeight = marginAbove + ascender + xHeight + descender;

  var repeatCount = Math.floor(newDoc.page.height / totalHeight);
  var leftPoint = 20;
  var rightPoint = newDoc.page.width - leftPoint;

  var xMarkBase = (totalHeight / 2) + (newDoc.currentLineHeight() / 2);

  for (var i = 0, offset = 0; i < repeatCount; i++, offset += totalHeight) {
    [marginAbove, ascender, xHeight, descender].reduce(function (base, additional, idx) {
      var lineAt = base + additional;
      //console.log('blah ' + base + 'add ' + additional, " idx" + idx);

      newDoc.moveTo(leftPoint, lineAt)
        .lineTo(rightPoint, lineAt)
        .dash(5)
        .stroke(colors[idx]);

      return lineAt;
    }, offset);

    if (includeXMark) {
      newDoc.text('x', leftPoint, offset + xMarkBase);
    }
  }

  console.log(newDoc);

  doc = newDoc.end();

  return false;
}

window.updatePdf = updatePdf;
