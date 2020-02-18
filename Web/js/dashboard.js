let date = new Date()
let annualTotal = monthlyTotal = 0
let year
let month
let customerNo = salesNo = 0
let recentLocCounter = 0
let totalOrders = pending = assigned = cancelled = completed = completed_f = 0

ordersRef.once("value").then(function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
        // calculate different order numbers
        totalOrders++
        if (childSnapshot.val().Status == 'Cancelled')
            cancelled++
        if (childSnapshot.val().Status == 'Assigned')
            assigned++
        if (childSnapshot.val().Status == 'Pending')
            pending++
        if (childSnapshot.val().Status == 'Completed' && !childSnapshot.val().Feedback)
            completed++
        if (childSnapshot.val().Status == 'Completed' && childSnapshot.val().Feedback)
            completed_f++
        if (childSnapshot.val().paymentDate) {
            year = childSnapshot.val().paymentDate.split("/")[0]
            month = childSnapshot.val().paymentDate.split("/")[1]
            if (year == date.getFullYear()) {
                // annual revenue
                annualTotal += parseFloat(childSnapshot.val().Total.replace("$", ""))
                if (month == (date.getMonth() + 1)) {
                    // current month's revenue
                    monthlyTotal += parseFloat(childSnapshot.val().Total.replace("$", ""))
                    // load current month's transactions
                    document.getElementById('recent-transactions').insertAdjacentHTML(
                        'beforeend',
                        "<div>" +
                        "<b class='text-primary'>" + childSnapshot.val().orderId + "</b><br/>" +
                        "<b>Customer : </b>" + childSnapshot.val().Customer + "<br/>" +
                        "<b>Total : </b>$" + childSnapshot.val().Total + "<br/>" +
                        "<b>Payment Date : </b>" + childSnapshot.val().paymentDate + "<hr/>" +
                        "</div>"
                    )
                }
            }
        }
    })
}).then(() => {
    // populate overall orders view
    document.getElementById('overall-body').innerHTML =
        '<h4 class="small font-weight-bold">Cancelled from Total <span class="float-right">' + parseInt((cancelled / totalOrders) * 100) + '%</span></h4>' +
        '<div class="progress mb-4">' +
        '<div class="progress-bar bg-danger" role="progressbar" style="width: ' + parseInt((cancelled / totalOrders) * 100) + '%" aria-valuenow="' + parseInt((cancelled / totalOrders) * 100) + '" aria-valuemin="0" aria-valuemax="100"></div>' +
        '</div>' +
        '<h4 class="small font-weight-bold">Pending from Total <span class="float-right">' + parseInt((pending / totalOrders) * 100) + '%</span></h4>' +
        '<div class="progress mb-4">' +
        '<div class="progress-bar bg-warning" role="progressbar" style="width: ' + parseInt((pending / totalOrders) * 100) + '%" aria-valuenow="' + parseInt((pending / totalOrders) * 100) + '" aria-valuemin="0" aria-valuemax="100"></div>' +
        '</div>' +
        '<h4 class="small font-weight-bold">Assigned from Total <span class="float-right">' + parseInt((assigned / totalOrders) * 100) + '%</span></h4>' +
        '<div class="progress mb-4">' +
        '<div class="progress-bar" role="progressbar" style="width: ' + parseInt((assigned / totalOrders) * 100) + '%" aria-valuenow="' + parseInt((assigned / totalOrders) * 100) + '" aria-valuemin="0" aria-valuemax="100"></div>' +
        '</div>' +
        '<h4 class="small font-weight-bold">Completed from Total <span class="float-right">' + parseInt((completed / totalOrders) * 100) + '%</span></h4>' +
        '<div class="progress mb-4">' +
        '<div class="progress-bar bg-info" role="progressbar" style="width: ' + parseInt((completed / totalOrders) * 100) + '%" aria-valuenow="' + parseInt((completed / totalOrders) * 100) + '" aria-valuemin="0" aria-valuemax="100"></div>' +
        '</div>' +
        '<h4 class="small font-weight-bold">Completed with Feedback from Total <span class="float-right">' + parseInt((completed_f / totalOrders) * 100) + '%</span></h4>' +
        '<div class="progress mb-4">' +
        '<div class="progress-bar bg-success" role="progressbar" style="width: ' + parseInt((completed_f / totalOrders) * 100) + '%" aria-valuenow="' + parseInt((completed_f / totalOrders) * 100) + '" aria-valuemin="0" aria-valuemax="100"></div>' +
        '</div>'
    document.getElementById('annual-total').innerHTML = "$ " + annualTotal
    document.getElementById('monthly-total').innerHTML = "$ " + monthlyTotal
})

// get total customers and salespersons
usersRef.once("value").then(function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
        if (childSnapshot.val().type == 'customer')
            customerNo++
        if (childSnapshot.val().type == 'salesperson')
            salesNo++
    })
}).then(() => {
    document.getElementById('salesperson-total').innerHTML = salesNo
    document.getElementById('customer-total').innerHTML = customerNo
})

// get recently visited locations
gpsRef.child('locations').orderByChild("dateString").once("value").then(function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
        if (recentLocCounter < 5) {
            document.getElementById("recent-locations").insertAdjacentHTML(
                'beforeend',
                "<div>" +
                "<b class='text-primary'>" + childSnapshot.val().id + "</b><br/>" +
                "<b>Customer : </b>" + childSnapshot.val().customer + "<br/>" +
                "<b>Shop : </b>" + childSnapshot.val().shopname + "<br/>" +
                "<b>Address : </b>" + childSnapshot.val().address + "<hr/>" +
                "</div>"
            )
        }
        recentLocCounter++
    })
})