// dashboard page functions
let date = new Date()
let annualTotal = 0
let monthlyTotal = 0
let year
let month
let customerNo = 0
let salesNo = 0
let recentLocCounter = 0

ordersRef.once("value").then(function(snapshot){
    snapshot.forEach(function(childSnapshot){
        if(childSnapshot.val().paymentDate) {
        year = childSnapshot.val().paymentDate.split("/")[0]
        month = childSnapshot.val().paymentDate.split("/")[1]
        if(year == date.getFullYear()){
            annualTotal += parseFloat(childSnapshot.val().Total.replace("$", ""))
            if(month == (date.getMonth() + 1))
            monthlyTotal += parseFloat(childSnapshot.val().Total.replace("$", ""))
        } 
        }
    })
}).then(() => {
    document.getElementById('annual-total').innerHTML = "$ "+annualTotal
    document.getElementById('monthly-total').innerHTML = "$ "+monthlyTotal
})

usersRef.once("value").then(function(snapshot){
    snapshot.forEach(function(childSnapshot){
        if(childSnapshot.val().type == 'customer')
        customerNo++
        if(childSnapshot.val().type == 'salesperson')
        salesNo++
    })
}).then(() => {
    document.getElementById('salesperson-total').innerHTML = salesNo
    document.getElementById('customer-total').innerHTML = customerNo
})

gpsRef.child('locations').orderByChild("dateString").once("value").then(function(snapshot){
    snapshot.forEach(function(childSnapshot){
        if(recentLocCounter < 5){
        document.getElementById("recent-locations").insertAdjacentHTML(
            'beforeend',
            "<div>"+
            "<b class='text-primary'>"+childSnapshot.val().id+"</b><br/>"+
            "<b>Customer : </b>"+childSnapshot.val().customer+"<br/>"+
            "<b>Shop : </b>"+childSnapshot.val().shopname+"<br/>"+
            "<b>Address : </b>"+childSnapshot.val().address+"<hr/>"+
            "</div>"
        )
        }
        recentLocCounter++
    })
})