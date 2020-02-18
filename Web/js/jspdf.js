let doc = new jsPDF({ orientation: 'landscape' })
let products = window.document.getElementById('reports-product-table')
let orders = window.document.getElementById('reports-order-table')
let locations = window.document.getElementById('reports-location-table')
let users = window.document.getElementById('reports-users-table')
let feedback = window.document.getElementById('reports-feedback-table')

let p_filter = o_filter = l_filter = u_filter = f_filter = ''

//listeners for datatable search boxes
$('#reports-product-table').on('search.dt', function () {
    p_filter = $('.dataTables_filter input')[0].value
})
$('#reports-order-table').on('search.dt', function () {
    o_filter = $('.dataTables_filter input')[1].value
})
$('#reports-location-table').on('search.dt', function () {
    l_filter = $('.dataTables_filter input')[2].value
})
$('#reports-users-table').on('search.dt', function () {
    u_filter = $('.dataTables_filter input')[3].value
})
$('#reports-feedback-table').on('search.dt', function () {
    f_filter = $('.dataTables_filter input')[4].value
})

// generate product pdf
function generateProductsPdf() {
    doc.setFontSize(20)
    doc.text('Products report', doc.internal.pageSize.getWidth() / 2, 10, 'center')
    doc.setFontSize(14)
    doc.text('Applied filters: ' + p_filter, 10, 20)
    doc.text('These reports are taken from the original Altum engineering site and are true and correct\r\n\r\n\r\n---------------------', 10, 30)
    doc.autoTable({
        html: products,
        startY: 60,
    })
    doc.output("dataurl")
}

// generate orders pdf
function generateOrdersPdf() {
    if (flag == 1)
        doc.addPage()
    flag = 0
    doc.setFontSize(20)
    doc.text('Orders report', doc.internal.pageSize.getWidth() / 2, 10, 'center')
    doc.setFontSize(14)
    doc.text('Applied filters: ' + o_filter, 10, 20)
    doc.text('These reports are taken from the original Altum engineering site and are true and correct\r\n\r\n\r\n---------------------', 10, 30)
    doc.autoTable({
        html: orders,
        startY: 60,
    })
    doc.output("dataurl")
}

// generate locations pdf
function generateLocationPdf() {
    doc.setFontSize(20)
    doc.text('Locations report', doc.internal.pageSize.getWidth() / 2, 10, 'center')
    doc.setFontSize(14)
    doc.text('Applied filters: ' + l_filter, 10, 20)
    doc.text('These reports are taken from the original Altum engineering site and are true and correct\r\n\r\n\r\n---------------------', 10, 30)
    doc.autoTable({
        html: locations,
        startY: 60,
    })
    doc.output("dataurl")
}

// generate users pdf
function generateUsersPdf() {
    doc.setFontSize(20)
    doc.text('Users report', doc.internal.pageSize.getWidth() / 2, 10, 'center')
    doc.setFontSize(14)
    doc.text('Applied filters: ' + u_filter, 10, 20)
    doc.text('These reports are taken from the original Altum engineering site and are true and correct\r\n\r\n\r\n---------------------', 10, 30)
    doc.autoTable({
        html: users,
        startY: 60,
    })
    doc.output("dataurl")
}

// generate feedback pdf
function generateFeedbackPdf() {
    doc.setFontSize(20)
    doc.text('Feedback report', doc.internal.pageSize.getWidth() / 2, 10, 'center')
    doc.setFontSize(14)
    doc.text('Applied filters: ' + f_filter, 10, 20)
    doc.text('These reports are taken from the original Altum engineering site and are true and correct\r\n\r\n\r\n---------------------', 10, 30)
    doc.autoTable({
        html: feedback,
        startY: 60,
    })
    doc.output("dataurl")
}