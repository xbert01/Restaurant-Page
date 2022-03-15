//Products
const cartContainer = document.querySelector('.cart-container');
const productList=document.querySelector('.product-list'); // my product list
const cartList = document.querySelector('.cart-list');
const cartTotalValue = document.getElementById('cart-total-value');
const cart = document.querySelector('.cart');
const addToCartBtn = document.querySelector('.add-to-cart-btn');
//const cartButton = document.getElementById('.cart-btn');

const cartCountInfo = document.getElementById('cart-count-info');

let cartItemID = 1;

//Navbar
let menu = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');
let close = document.querySelector('#close-cart-btn');

function eventListeners() {
    window.addEventListener('DOMContentLoaded', () => {
        loadJSON();
        loadCart();
    });
    document.getElementById('cart-btn').addEventListener('click', () => {
        cartContainer.classList.toggle('show-cart-container');
        navbar.classList.remove('active');
        close.classList.toggle('active');
    });

    close.onclick = () => {
        cartContainer.classList.remove('show-cart-container');
        close.classList.remove('active');
    }

    productList.addEventListener('click', purchaseProduct);
    
    cartList.addEventListener('click', deleteProduct);
    
    // product List 
    menu.onclick = () => {
    navbar.classList.toggle('active');
    }

    window.onscroll = () => {
        navbar.classList.remove('active');
    }
    
}
eventListeners();

//update cart
function updateCartInfo() {
    let cartInfo = findCartInfo();
    cartCountInfo.textContent = cartInfo.productCount;
    cartTotalValue.textContent = cartInfo.total
}


//Dark Mode
let darkmode = document.querySelector('#darkmode');

darkmode.onclick = () => {
    if (darkmode.classList.contains('bx-moon')) {
        darkmode.classList.replace('bx-moon', 'bx-sun');
        document.body.classList.add('active');
    }
    else {
    (darkmode.classList.replace('bx-sun', 'bx-moon'));
    document.body.classList.remove('active');
    }
   
}

//Scroll Reveal 
const sr = ScrollReveal({
    origin: 'top',
    distance: '40px',
    duration: 2000,
    reset: true
});

sr.reveal('.home-text,.home-img,.about-img,.about-text,.product-list,.s-box,.connect-text,.btn,.contact-box',{interval:200})

// Basket 



//Load products from json

function loadJSON() {
    fetch('menu.json')
    .then(response => response.json())
    .then(data => {
        let html = '';
        data.forEach(product => {
            
            html+= `
         <div class="product-item">
             <div class="product-img">
                 <img src="${product.imgSrc}" alt="product image" />
                 <button type="button" class="add-to-cart-btn">
                   <i class="bx bx-cart-alt"></i>
                 </button>
             </div>
             <h2 class="product-name">${product.name}</h2>
              <h3 class="product-brand">Just Ramen</h3>
             <span class="product-price">${product.price}$</span>
        </div>
        `;
        });
        productList.innerHTML=html;
    })
}

// purchase
function purchaseProduct(e){
    //console.log(e.target);
    
    if (e.target.classList.contains('add-to-cart-btn' )) {
        //console.log(e.target)  
      let product = e.target.parentElement.parentElement;
      getProductInfo(product);
  }
  else if (e.target.classList.contains('bx-cart-alt')) {
    let product = e.target.parentElement.parentElement.parentElement;
    getProductInfo(product);
  }
  
}

//get product info after add to cart
function getProductInfo(product) {
    let productInfo = {
        id: cartItemID,
        imgSrc:product.querySelector('.product-img img').src,
        name: product.querySelector('.product-name').textContent,
        price:product.querySelector('.product-price').textContent
    };
   cartItemID++;
    
    
    addToCartList(productInfo);
    saveProductInStorage(productInfo);
}

//add the selected product to basket

function addToCartList(product) {
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.setAttribute('data-id', `${product.id}`);
    cartItem.innerHTML = `
                <img src="${product.imgSrc}" alt="" />
                <div class="cart-item-info">
                  <h3 class="cart-item-name">${product.name}</h3>
                  <span class="cart-item-price">${product.price}</span>
                </div>
                <button type="button" class="cart-item-del-btn">
                  <i class="bx bx-x"></i>
                </button>
    `;
    cartList.appendChild(cartItem);
}

//save the productin the local storage
function saveProductInStorage(item) {
    let products = getProductFromStorage();
    products.push(item);
   localStorage.setItem('products', JSON.stringify(products));
   updateCartInfo();
}

 // get all the products info

function getProductFromStorage() {
    //console.log(products);
    return localStorage.getItem('products') ? JSON.parse
    (localStorage.getItem('products')) : [];
    //returns empty array if there isn't any product info
}

//load cart product
function loadCart() {
    let products = getProductFromStorage();
    if(products.length < 1) {
        cartItemID = 1;
    } else {
        cartItemID = products[products.length-1].id;
        cartItemID++;
    }
    
   products.forEach(product=>addToCartList(product));
   updateCartInfo();
}

//calculate total price 
function findCartInfo() {
    let products = getProductFromStorage();
    let total = products.reduce((acc, product) => {
        let price = parseFloat(product.price.substr(0));
        return acc+= price;
    }, 0);
   return {
       total:total.toFixed(2),
       productCount: products.length
   }
}

//delete products from basket and local storage
function deleteProduct(e) {
    let cartItem;
    if(e.target.tagName ==="BUTTON") {
        cartItem = e.target.parentElement;
        cartItem.remove(); //removes from DOM
    } else if (e.target.tagName === "I"){
        cartItem = e.target.parentElement.parentElement;
        cartItem.remove(); //removes from DOM
    }
    let products = getProductFromStorage();
    let updateProducts = products.filter(product => {
        return product.id !== parseInt(cartItem.dataset.id);
    });
    localStorage.setItem('products', 
    JSON.stringify(updateProducts)); //updating product list 
    updateCartInfo();
}
