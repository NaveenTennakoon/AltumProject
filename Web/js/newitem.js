let counter = 0;
let typeArr = [];

function typesnapshotToArray() {
    inventoryRef.once("value").then(function(snapshot){
    // <!-- snapshot of childs of root of database-->
        snapshot.forEach(function(childSnapshot) {
            if(typeArr.length == 0){
                let item = childSnapshot.val().Type;
                typeArr.push(item);
            }
            let flag = i = 0;
            while(i<typeArr.length){
                if(childSnapshot.val().Type != typeArr[i]){
                    flag = 1;
                }
                i++;
            }
            if(flag == 1){
                let item = childSnapshot.val().Type;
                typeArr.push(item);
            }     
        });
    }).catch(function(error){
        // Handle Errors here.
        let errorMessage = error.message;
        window.alert(errorMessage);
    });
    return typeArr;
};
typesnapshotToArray();
autocomplete(document.getElementById("defaultval2"), typeArr);

function addInput(divName){
    counter++;
    let newdiv = document.createElement('div');
    newdiv.setAttribute('id', 'div_' + counter);
    newdiv.innerHTML = "<div class='form-row my-3'><div class='col-lg-4'><input class='form-control' id='addedkey"+counter+"' placeholder='Enter key field'> </div><div class='col-lg-8'><input class='form-control' id='addedval"+counter+"' placeholder='Value of key'></div></div>";           
    document.getElementById(divName).appendChild(newdiv);  
    
}


function deleteInput(divName){
    if(0 < counter) {
        document.getElementById(divName).removeChild(document.getElementById('div_' + counter));
        counter--;
    } else {
        alert("Nothing to remove");
    }
}

function additem(){
    let i = 1;
    inventoryRef.push({
        Name: $("#defaultval1").val(),
        Type: $("#defaultval2").val(),
        Description: $("#defaultval3").val(),
        Price: $("#defaultval4").val(),   
        Quantity: $("#defaultval5").val(),      
      }).then((snap) => {
        const key = snap.key;
        while (i<=counter) {
            inventoryRef.child(key).update({
                [$("#addedkey"+i).val()]: $("#addedval"+i).val(),
            });
            i++;
        }
    }).catch(function(error){
        // Handle Errors here.
        let errorMessage = error.message;
        window.alert(errorMessage);
    });
}