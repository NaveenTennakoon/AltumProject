// Reports page functions
let customerIds = []
let spIds = []

inventoryRef.once("value").then(function(snapshot){
    snapshot.forEach(function(childSnapshot){
        document.getElementById("reports-product-body").insertAdjacentHTML(
        'beforeend',
        "<tr>"+
            "<td>"+childSnapshot.val().ID+"</td>"+
            "<td>"+childSnapshot.val().Name+"</td>"+
            "<td>"+childSnapshot.val().Price+"</td>"+
            "<td>"+childSnapshot.val().Quantity+"</td>"+
        "</tr>"
        )
    })
}).then(() => {
    $(document).ready(() => {
        $('#reports-product-table').DataTable()
    })
})
usersRef.once('value').then(function(snapshot){
    $.map(snapshot.val(), function(value, key){
        if(value.type == 'customer')
            customerIds.push({ key: key, id: value.id })
        if(value.type == 'salesperson')
            spIds.push({ key: key, id: value.id })
    })
    snapshot.forEach(function(childSnapshot){
        if(childSnapshot.val().type == 'salesperson'){
            document.getElementById("reports-users-body").insertAdjacentHTML(
                'beforeend',
                "<tr>"+
                    "<td>"+childSnapshot.val().id+"</td>"+
                    "<td>"+childSnapshot.val().firstName+" "+childSnapshot.val().lastName+"</td>"+
                    "<td>"+childSnapshot.val().telephone+"</td>"+
                    "<td>"+childSnapshot.val().address+"</td>"+
                    "<td>"+childSnapshot.val().type+"</td>"+
                    "<td>"+childSnapshot.val().status+"</td>"+
                    "<td>-</td>"+
                "</tr>"
            ) 
        }  
        else if(childSnapshot.val().type == 'customer'){
            document.getElementById("reports-users-body").insertAdjacentHTML(
                'beforeend',
                "<tr>"+
                    "<td>"+childSnapshot.val().id+"</td>"+
                    "<td>"+childSnapshot.val().name+"</td>"+
                    "<td>"+childSnapshot.val().telephone+"</td>"+
                    "<td>"+childSnapshot.val().address+"</td>"+
                    "<td>"+childSnapshot.val().type+"</td>"+
                    "<td>"+childSnapshot.val().status+"</td>"+
                    "<td>"+childSnapshot.val().company+"</td>"+
                "</tr>"
            ) 
        }  
    })
}).then(()=>{
    $('#reports-users-table').DataTable()
})
ordersRef.once("value").then(function(snapshot){
    snapshot.forEach(function(childSnapshot){
        let username
        for(let i = 0; i < customerIds.length; i++){
        if(customerIds[i].key == childSnapshot.val().Customer)  
            username = customerIds[i].id
        }
        if(!childSnapshot.val().paymentDate){
            document.getElementById("reports-order-body").insertAdjacentHTML(
                'beforeend',
                "<tr>"+
                "<td>"+childSnapshot.val().orderId+"</td>"+
                "<td>"+username+"</td>"+
                "<td>"+childSnapshot.val().Total+"</td>"+
                "<td>"+childSnapshot.val().orderDate+"</td>"+
                "<td>"+childSnapshot.val().payment+"</td>"+
                "<td>"+childSnapshot.val().Status+"</td>"+
                "<td>"+
                    "<table class='table display'>"+
                    "<tbody id='reports-order-body-products"+childSnapshot.key+"'>"
            )
        }
        else{
        document.getElementById("reports-order-body").insertAdjacentHTML(
            'beforeend',
            "<tr>"+
            "<td>"+childSnapshot.val().orderId+"</td>"+
            "<td>"+username+"</td>"+
            "<td>"+childSnapshot.val().Total+"</td>"+
            "<td>"+childSnapshot.val().orderDate+"</td>"+
            "<td>"+childSnapshot.val().payment+"</td>"+
            "<td>"+childSnapshot.val().paymentDate+"</td>"+
            "<td>"+
                "<table class='table display'>"+
                "<tbody id='reports-order-body-products"+childSnapshot.key+"'>"
        )
        }
        $.map(childSnapshot.val().Products, function(value, key){
        document.getElementById("reports-order-body-products"+childSnapshot.key).insertAdjacentHTML(
            'beforeend',
            "<td>"+key+" </td>"+
            "<td>"+value+" <br/></td>"
        )
        })
        document.getElementById("reports-order-body").insertAdjacentHTML(
        'beforeend',
        "</tbody>"+
        "</table>"+
        "</td>"+
        "</tr>"
        )   
    })
}).then(() => {
    $(document).ready(() => {
        $('#reports-order-table').DataTable()
    })
})

gpsRef.child('locations').once("value").then(function(snapshot){
    snapshot.forEach(function(childSnapshot){
        let username
        for(let i = 0; i < spIds.length; i++){
        if(spIds[i].key == childSnapshot.val().salesperson)  
            username = spIds[i].id
        }
        document.getElementById("reports-location-body").insertAdjacentHTML(
        'beforeend',
        "<tr>"+
            "<td>"+childSnapshot.val().id+"</td>"+
            "<td>"+username+"</td>"+
            "<td>"+childSnapshot.val().customer+"</td>"+
            "<td>"+childSnapshot.val().shopname+"</td>"+
            "<td>"+childSnapshot.val().timestamp+"</td>"+
            "<td>"+childSnapshot.val().address+"</td>"+
        "</tr>"
        )
    })
}).then(() => {
    $(document).ready(() => {
        $('#reports-location-table').DataTable()
    })
})
