// stock management page functions
let itemNo = 0

function loadProducts(){
  let typesArr = []
  document.getElementById("product-items").innerHTML = ''
  document.getElementById("product-type").innerHTML = ''
  inventoryRef.once("value").then(function(snapshot){
    snapshot.forEach(function(childSnapshot){
      if(childSnapshot.val().Status == 'active'){
        if(typesArr.length == 0){
          let item = childSnapshot.val().Type
          typesArr.push(item)
        }
        else{
          let flag = i = 0
          while(i<typesArr.length){
            if(childSnapshot.val().Type == typesArr[i]){
              flag = 1
            }
            i++
          }
          if(flag == 0){
            let item = childSnapshot.val().Type
            typesArr.push(item)
          }
        }
        document.getElementById("product-items").insertAdjacentHTML(
          'beforeend',
          "<div class='shop-item'>"+
            "<b class='d-none'>Unique ID: </b>"+
            "<span class='shop-item-title d-none'>"+childSnapshot.key+"</span>"+
            "<b class='ml-5'>Product ID: </b><a class='shop-item-id'>"+childSnapshot.val().ID+"</a>"+
            "<div class='shop-item-details'>"+
              "<div class='form-row'>"+
                "<a class='col-lg-4'><b>Name : </b>"+childSnapshot.val().Name+"</a><a class='col-lg-2'><b>Price : </b>"+childSnapshot.val().Price+"</a><a class='col-lg-2'><b>Quantity : </b>"+childSnapshot.val().Quantity+"</a><br/>"+
              "</div>"+
              "<button class='btn btn-danger delete-item-button float-right ml-2' type='button'>Delete Item</button>"+
              "<button class='btn btn-primary view-item-button float-right' type='button'>Edit Item</button><hr class='mt-5'/>"+
              "</div>"+
          "</div>"
        )
      }
    })
    if (document.readyState == 'loading'){
      document.addEventListener('DOMContentLoaded', ready)
    } 
    else{
      ready()
    }
  }).then(()=>{
    let x = 0
    while(x<typesArr.length){
      document.getElementById("product-type").insertAdjacentHTML(
        'beforeend',
        "<a class='dropdown-item' type='button' onclick='filterbyType(\""+typesArr[x]+"\")'>"+typesArr[x]+"</a>"
      )
      x++
    }
  })
}

function filterbyType(type){
  document.getElementById("product-items").innerHTML = ''
  if(type == 'all'){
    inventoryRef.once("value").then(function(snapshot){
      snapshot.forEach(function(childSnapshot){
        if(childSnapshot.val().Status == 'active'){
          document.getElementById("product-items").insertAdjacentHTML(
            'beforeend',
            "<div class='shop-item'>"+
              "<b class='d-none'>Unique ID: </b>"+
              "<span class='shop-item-title d-none'>"+childSnapshot.key+"</span>"+
              "<b class='ml-5'>Product ID: </b><a class='shop-item-id'>"+childSnapshot.val().ID+"</a>"+
              "<div class='shop-item-details'>"+
                "<div class='form-row'>"+
                  "<a class='col-lg-4'><b>Name : </b>"+childSnapshot.val().Name+"</a><a class='col-lg-2'><b>Price : </b>"+childSnapshot.val().Price+"</a><a class='col-lg-2'><b>Quantity : </b>"+childSnapshot.val().Quantity+"</a><br/>"+
                "</div>"+
                "<button class='btn btn-danger delete-item-button float-right ml-2' type='button'>Delete Item</button>"+
                "<button class='btn btn-primary view-item-button float-right' type='button'>Edit Item</button><hr class='mt-5'/>"+
              "</div>"+
            "</div>"
          )
        }
      })
      if (document.readyState == 'loading'){
        document.addEventListener('DOMContentLoaded', ready)
      } 
      else{
        ready()
      }
    })
  }
  else{
    inventoryRef.once("value").then(function(snapshot){
      snapshot.forEach(function(childSnapshot){
        if(childSnapshot.val().Type == type && childSnapshot.val().Status == 'active'){
          document.getElementById("product-items").insertAdjacentHTML(
            'beforeend',
            "<div class='shop-item'>"+
              "<b class='d-none'>Unique ID: </b>"+
              "<span class='shop-item-title d-none'>"+childSnapshot.key+"</span>"+
              "<b class='ml-5'>Product ID: </b><a class='shop-item-id'>"+childSnapshot.val().ID+"</a>"+
              "<div class='shop-item-details'>"+
                "<div class='form-row'>"+
                  "<a class='col-lg-4'><b>Name : </b>"+childSnapshot.val().Name+"</a><a class='col-lg-2'><b>Price : </b>"+childSnapshot.val().Price+"</a><a class='col-lg-2'><b>Quantity : </b>"+childSnapshot.val().Quantity+"</a><br/>"+
                "</div>"+
                "<button class='btn btn-danger delete-item-button float-right ml-2' type='button'>Delete Item</button>"+
                "<button class='btn btn-primary view-item-button float-right' type='button'>Edit Item</button><hr class='mt-5'/>"+
              "</div>"+
            "</div>"
          )
        }
      })
      if (document.readyState == 'loading'){
        document.addEventListener('DOMContentLoaded', ready)
      } 
      else{
        ready()
      }
    })
  }
}

function ready() {
  let viewItemButtons = document.getElementsByClassName('view-item-button')
  let deleteItemButtons = document.getElementsByClassName('delete-item-button')
  for (let i = 0; i < viewItemButtons.length; i++) {
    let button = viewItemButtons[i]
    button.addEventListener('click', viewItemClicked)
  }
  for (let i = 0; i < deleteItemButtons.length; i++) {
    let button = deleteItemButtons[i]
    button.addEventListener('click', deleteItemClicked)
  }
}

function viewItemClicked(event) {
  let button = event.target
  let shopItem = button.parentElement.parentElement
  let title = shopItem.getElementsByClassName('shop-item-title')[0].innerText
  inventoryRef.child(title).once("value").then(function(snapshot){
    snapshot.forEach(function(childSnapshot){
      if(childSnapshot.key == 'Price'){
        document.getElementById("item-body").insertAdjacentHTML(
          'beforeend',
          "<div class='form-row my-3 mx-5'>"+
            "<div class=''>"+
              "<input class='form-control' id='key"+itemNo+"' value='"+childSnapshot.key+"' readonly>"+
            "</div>"+
            "<div class='col-lg-7'>"+
              "<input class='form-control' id='value"+itemNo+"' value='"+childSnapshot.val()+"'required type='number' step='0.01' min='0'>"+
            "</div>"+
          "</div>"
        )
      }
      else if(childSnapshot.key == 'Quantity'){
        document.getElementById("item-body").insertAdjacentHTML(
          'beforeend',
          "<div class='form-row my-3 mx-5'>"+
            "<div class=''>"+
              "<input class='form-control' id='key"+itemNo+"' value='"+childSnapshot.key+"' readonly>"+
            "</div>"+
            "<div class='col-lg-7'>"+
              "<input class='form-control' id='value"+itemNo+"' value='"+childSnapshot.val()+"'required type='number' min='0'>"+
            "</div>"+
          "</div>"
        )
      }
      else if(childSnapshot.key == 'ID'){
        itemNo--
      }
      else{
        document.getElementById("item-body").insertAdjacentHTML(
          'beforeend',
          "<div class='form-row my-3 mx-5'>"+
            "<div class=''>"+
              "<input class='form-control' id='key"+itemNo+"' value='"+childSnapshot.key+"' readonly>"+
            "</div>"+
            "<div class='col-lg-7'>"+
              "<input class='form-control' id='value"+itemNo+"' value='"+childSnapshot.val()+"'required>"+
            "</div>"+
          "</div>"
        )
      }
      itemNo++
    })
  })
  document.getElementById("item-id").innerHTML = title
  document.getElementById("item-title").innerHTML = shopItem.getElementsByClassName('shop-item-id')[0].innerText
  $('#viewModal').modal({backdrop: 'static', keyboard: false})
  $('#viewModal').modal('show')
}

function clearViewModal(){
  document.getElementById("item-body").innerHTML = ''
}

function update(){
  $('#editItemForm').submit(function(e){     
    e.preventDefault() 
    let title = document.getElementById('item-id').innerText
    while(itemNo>0){
      itemNo--
      inventoryRef.child(title).update({
        [$("#key"+itemNo).val()]: $("#value"+itemNo).val(),
      })
    }
    clearViewModal()
    $('#viewModal').modal('hide')
    Swal.fire({
      position: 'top',
      icon: 'success',
      title: 'Product updated successfully',
      showConfirmButton: false,
      timer: 3000
    })
  })
  loadProducts()
}

function deleteItemClicked(event){
  let button = event.target
  let shopItem = button.parentElement.parentElement
  let title = shopItem.getElementsByClassName('shop-item-title')[0].innerText
  Swal.fire({
    title: 'Are you sure?',
    text: "Do you want to delete the item?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ff0000',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Delete'
  }).then((result) => {
    if (result.value) {
      inventoryRef.child(title).update({
        Status: 'inactive',
      }).then(()=>{
        Swal.fire({
          position: 'top',
          icon: 'success',
          title: 'Product deleted successfully',
          showConfirmButton: false,
          timer: 3000
        })
      })
    }
  })
  loadProducts()
}