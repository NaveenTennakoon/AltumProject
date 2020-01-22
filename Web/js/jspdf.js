let doc = new jsPDF()
let source = window.document.getElementById('reports-product-table')
function generatePdf(){
    doc.text('Hello world!', 10, 10)
    doc.autoTable({ html: source })
    doc.output("dataurlnewwindow")
}