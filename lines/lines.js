var doc = new jsPDF();

function updatePdf(arg) {
  var paper = $('#lines [name=paper]').val();
  var orientation = $('#lines [name=orientation]').val();

  var newDoc = new jsPDF(orientation, 'in', paper);

  //$('preview-pane').

  doc = newDoc;

  var pdfString = doc.output('datauristring');
  $('.preview-pane').attr('src', pdfString);

  return false;
}

function savePdf() {
  doc.save();
}
