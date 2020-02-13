let doc = new jsPDF({ orientation: 'landscape' })
let products = window.document.getElementById('reports-product-table')
let orders = window.document.getElementById('reports-order-table')
let locations = window.document.getElementById('reports-location-table')
let users = window.document.getElementById('reports-users-table')

let flag = 0
let p_filter = o_filter = l_filter = u_filter = ''

//listeners for datatable search boxes
$('#reports-product-table').on('search.dt', function() {
    p_filter = $('.dataTables_filter input')[0].value
})
$('#reports-order-table').on('search.dt', function() {
    o_filter = $('.dataTables_filter input')[1].value
})
$('#reports-location-table').on('search.dt', function() {
    l_filter = $('.dataTables_filter input')[2].value
})
$('#reports-users-table').on('search.dt', function() {
    u_filter = $('.dataTables_filter input')[3].value
})

// generate product pdf
function generateProductsPdf(){
    if(flag == 1)
        doc.addPage()
    flag = 1
    doc.setFontSize(20)
    doc.text('Products report', doc.internal.pageSize.getWidth()/2, 10, 'center')
    doc.setFontSize(14)
    doc.text('Applied filters: '+p_filter, 10, 20)
    doc.text('These reports are taken from the original Altum engineering site and are true and correct\r\n\r\n\r\n---------------------', 10, 30   )
    doc.autoTable({ 
        html: products,
        startY: 60,
    })
    doc.output("dataurl")
}

// generate orders pdf
function generateOrdersPdf(){
    if(flag == 1)
        doc.addPage()
    flag = 0
    doc.setFontSize(20)
    doc.text('Orders report', doc.internal.pageSize.getWidth()/2, 10, 'center')
    doc.setFontSize(14)
    doc.text('Applied filters: '+o_filter, 10, 20)
    doc.text('These reports are taken from the original Altum engineering site and are true and correct\r\n\r\n\r\n---------------------', 10, 30   )
    doc.autoTable({ 
        html: orders,
        startY: 60,
    })
    doc.output("dataurl")
}

// generate locations pdf
function generateLocationPdf(){
    if(flag == 1)
        doc.addPage()
    flag = 0
    doc.setFontSize(20)
    doc.text('Locations report', doc.internal.pageSize.getWidth()/2, 10, 'center')
    doc.setFontSize(14)
    doc.text('Applied filters: '+l_filter, 10, 20)
    doc.text('These reports are taken from the original Altum engineering site and are true and correct\r\n\r\n\r\n---------------------', 10, 30   )
    doc.autoTable({ 
        html: locations,
        startY: 60,
    })
    doc.output("dataurl")
}

// generate users pdf
function generateUsersPdf(){
    if(flag == 1)
        doc.addPage()
     flag = 0
     doc.setFontSize(20)
     doc.text('Users report', doc.internal.pageSize.getWidth()/2, 10, 'center')
     doc.setFontSize(14)
     doc.text('Applied filters: '+u_filter, 10, 20)
     doc.text('These reports are taken from the original Altum engineering site and are true and correct\r\n\r\n\r\n---------------------', 10, 30   )
     doc.autoTable({ 
         html: users,
         startY: 60,
     })
    doc.output("dataurl")
}