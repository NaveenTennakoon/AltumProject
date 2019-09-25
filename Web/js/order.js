inventoryRef.once("value").then(function(snapshot){
    snapshot.forEach(function(childSnapshot){
        document.getElementById("product-items").insertAdjacentHTML(
            'beforeend',
            "<div class='shop-item'>"+
                "<b>Product ID: </b>"+
                "<span class='shop-item-title'>"+childSnapshot.key+"</span>"+
                "<div class='shop-item-details'>"+
                "<b>Name : </b>"+childSnapshot.val().Name+"<br/>"+
                "<b>Price : </b>"+"<a class='shop-item-price'>"+childSnapshot.val().Price+"</a><br/>"+
                    "<button class='btn btn-primary shop-item-button float-right ml-4' type='button'>Add to Order</button>"+
                    "<button class='btn btn-primary view-item-button float-right' type='button'>View Item</button><hr class='mt-5'/>"+
                "</div>"+
            "</div>"
        );
    });
    if (document.readyState == 'loading'){
        document.addEventListener('DOMContentLoaded', ready)
    } 
    else{
        ready()
    }
});

function ready() {
    let removeCartItemButtons = document.getElementsByClassName('btn-danger')
    for (let i = 0; i < removeCartItemButtons.length; i++) {
        let button = removeCartItemButtons[i]
        button.addEventListener('click', removeCartItem)
    }
    let quantityInputs = document.getElementsByClassName('cart-quantity-input')
    for (let i = 0; i < quantityInputs.length; i++) {
        let input = quantityInputs[i]
        input.addEventListener('change', quantityChanged)
    }
    let addToCartButtons = document.getElementsByClassName('shop-item-button');
    for (let i = 0; i < addToCartButtons.length; i++) {
        let button = addToCartButtons[i]
        button.addEventListener('click', addToCartClicked)
    }
    let viewItemButtons = document.getElementsByClassName('view-item-button');
    for (let i = 0; i < viewItemButtons.length; i++) {
        let button = viewItemButtons[i]
        button.addEventListener('click', viewItemClicked)
    }
    document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked)
}

function purchaseClicked() {
    let cartItem = document.getElementsByClassName('cart-item')
    let cartTotal = document.getElementsByClassName('cart-total-price')[0].innerText
    let cartItems = document.getElementsByClassName('cart-items')[0]
    ordersRef.push({
        Customer: firebase.auth().currentUser.uid,
        Total: cartTotal,
        Status: 'Pending',
    }).then((snap) => {
        const key = snap.key;
        console.log(cartItem,length);
        for(let i = 0; i < cartItem.length; i++){
            let cartItemName = document.getElementsByClassName('cart-item-title')[i].innerText
            let cartItemQuantity = document.getElementsByClassName('cart-quantity-input')[i].value
            console.log(key);
            ordersRef.child(key+'/Products').update({
                [cartItemName]: cartItemQuantity,
            })
        }  
        while (cartItems.hasChildNodes()) {
            cartItems.removeChild(cartItems.firstChild)
        }
        updateCartTotal()
    }).catch(function(error){
        // Handle Errors here.
        let errorMessage = error.message;
        window.alert(errorMessage);
    });
}

function clearOrder(){
    let cartItems = document.getElementsByClassName('cart-items')[0]
    while (cartItems.hasChildNodes()) {
        cartItems.removeChild(cartItems.firstChild)
    }
    updateCartTotal()
}

function removeCartItem(event) {
    let buttonClicked = event.target
    buttonClicked.parentElement.parentElement.remove()
    updateCartTotal()
}

function quantityChanged(event) {
    let input = event.target
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }
    updateCartTotal()
}

function viewItemClicked(event) {
    let button = event.target
    let shopItem = button.parentElement.parentElement
    let title = shopItem.getElementsByClassName('shop-item-title')[0].innerText
    inventoryRef.child(title).once("value").then(function(snapshot){
        snapshot.forEach(function(childSnapshot){
            document.getElementById("item-body").insertAdjacentHTML(
                'beforeend',
                "<p><b>"+childSnapshot.key+"</b>: "+childSnapshot.val()+"</p>"
            );
        });
    });
    document.getElementById("item-title").innerHTML = title;
    $('#viewModal').modal('show')
}

function addToCartClicked(event) {
    let button = event.target
    let shopItem = button.parentElement.parentElement
    let title = shopItem.getElementsByClassName('shop-item-title')[0].innerText
    let price = shopItem.getElementsByClassName('shop-item-price')[0].innerText
    addItemToCart(title, price)
    updateCartTotal()
}

function addItemToCart(title, price) {
    let cartRow = document.createElement('div')
    cartRow.classList.add('cart-row')
    let cartItems = document.getElementsByClassName('cart-items')[0]
    let cartItemNames = cartItems.getElementsByClassName('cart-item-title')
    for (let i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText == title) {
            alert('This item is already added to the cart')
            return
        }
    }
    let cartRowContents = 
        `<div class="cart-item cart-column">
            <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column mb-3">
            <input class="cart-quantity-input" type="number" value="1">
            <button class="btn btn-danger ml-4" type="button">REMOVE</button>
        </div><hr/>`
    cartRow.innerHTML = cartRowContents
    cartItems.append(cartRow)
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem)
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)
}

function updateCartTotal() {
    let cartItemContainer = document.getElementsByClassName('cart-items')[0]
    let cartRows = cartItemContainer.getElementsByClassName('cart-row')
    let total = 0
    for (let i = 0; i < cartRows.length; i++) {
        let cartRow = cartRows[i]
        let priceElement = cartRow.getElementsByClassName('cart-price')[0]
        let quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        let price = parseFloat(priceElement.innerText.replace('$', ''))
        let quantity = quantityElement.value
        total = total + (price * quantity)
    }
    total = Math.round(total * 100) / 100
    document.getElementsByClassName('cart-total-price')[0].innerText = '$' + total
}

function clearViewModal(){
    document.getElementById("item-body").innerHTML = '';
}