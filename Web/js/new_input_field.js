counter = 0;
function addInput(divName){
          counter++;
          var newdiv = document.createElement('div');
          newdiv.setAttribute('id', 'div_' + counter);
          newdiv.innerHTML = "<br><div class='form-row'><div class='col-lg-5'><input class='form-control' id='tb_ "+ counter +"' placeholder='Enter key field'> </div><div class='col-lg-7'><input class='form-control' name='myInputs[]' placeholder='Value of key'></div></div>";
             
          document.getElementById(divName).appendChild(newdiv);
     
}


function deleteInput(divName){
    if(0 < counter) {
        document.getElementById(divName).removeChild(document.getElementById('div_' + counter));
        counter--;
    } else {
        alert("No textbox to remove");
    }
}