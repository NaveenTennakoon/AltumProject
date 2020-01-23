let doc = new jsPDF({ orientation: 'landscape' })
let products = window.document.getElementById('reports-product-table')
let orders = window.document.getElementById('reports-order-table')
let locations = window.document.getElementById('reports-location-table')
function generateProductsPdf(){
    doc.text('Products report', 10, 10)
    doc.autoTable({ html: products })
    doc.output("dataurlnewwindow")
}

function generateOrdersPdf(){
    doc.text('Orders report', 10, 10)
    doc.autoTable({ html: orders })
    doc.output("dataurlnewwindow")
}

function generateLocationPdf(){
    doc.text('Locations report', 10, 10)
    doc.autoTable({ html: locations })
    doc.output("dataurlnewwindow")
}