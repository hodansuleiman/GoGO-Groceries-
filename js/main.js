
//REGISTRATION PAGE
//let loginForm = document.querySelector('.login-form');


// after user clicks register send register information to server.
function register () // from register on cl;ick handler making the call to the server sending all registration data from form
{
    // construct user object
    const user = {
        firstName: document.querySelector("#firstName").value,
        lastName: document.querySelector("#lastName").value,
        email: document.querySelector("#emailAddress").value,
        password: document.querySelector("#password").value,
        confirmPassword: document.querySelector("#confirmPassword").value,
    }
    // post to server with user object:
    fetch ("/register",    // format 
    {
        method:"POST", // format
        headers: {
            "Content-Type":"application/json"
        },
        body : JSON.stringify(user)
    }
    ).then((res)=> res.json())
    .then(data=>{
        console.log ("RES", data);
        document.location.replace("/shop"); // redirect to shop page
    });
}


// function to adjust quanity amount filter to index and grab amount. 
function adjustQuanity (idx, amount)
{
    // get quantity for item
    const qtyId = document.querySelector("#qty"+idx);
    let val =parseInt(qtyId.textContent) + amount; // convert to int and add amount.

    if(val < 0 || val >10) // if amount < 0 or amount >10 it is an invalid range.
    {
        alert("Quantity must be between 1 and 10");
        return;
    }
    console.log("QTY", val);
    qtyId.textContent = val ; // set the quantity field to the new value.
}

// shopping cart 
let shoppingCart=[]; // initialize shopping cart array
// add to cart:
function addToCart(productId, index)
{
    console.log("shoppingCart", shoppingCart);
 
    // get quantity for item
    const qty = parseInt(document.querySelector("#qty"+index).textContent);
    if(qty<1||qty>10)// if amount < 0 or amount >10 it is an invalid range.
    {
        alert("Quantity must be between 1 and 10");
        return;
    }
    const idx = getItemIndex(productId); // get item from shopping if exists.
    if(idx >-1) // if idx > -1 item found at index idx
    {
        // update quantity.
        shoppingCart[idx].qty=qty;
        return;
    }
    // item not in shopping cart, add to shopping cart:
    const item = JSON.parse(document.querySelector("#item"+index).value); // get item data from hidden field and convert to JavaScript object
    console.log (item);
    // construct cart item:
    const cart = {productId:productId, qty:qty, price:item.price.regular, description:item.description};
    console.log(cart);
    // push new item to cart:
    shoppingCart.push(cart);

    
    // calculate new total:
    let total=0; 
    for(let i in shoppingCart) // loop through cart to sum up new total:
    {
        console.log ("SUM TOTAL:",shoppingCart[i])
        let amt = (shoppingCart[i].qty * shoppingCart[i].price); // quantity * price
        console.log("AMT:", amt);
        total+= amt;
    }
    console.log(total);
    // update total div on page:
    document.querySelector("#divTotal").textContent = "Total: $" + total;
    sessionStorage.setItem('shoppingCart', JSON.stringify(shoppingCart))
    
}

// search for item based on productId
function getItemIndex (productId)
{
    for (let i in shoppingCart)
    {
        if (shoppingCart[i].productId===productId) // if found return the index.
        {
            return i;
        }
    }
    return -1; // not found return -1 indicating not found.oppi
}

function checkout() // click on checkout button 
{
    console.log ("CHECKOUT:", shoppingCart);
    // put shopping in session storage for access on payment page:
    sessionStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
   // shoppingCart.push('/shoppinglist');
   
    window.location.replace("/shoppinglist");
    
}



// MOVING CUSTOMER SHOPPING CART INTO SHOPPING LIST PAGE 
let GC_SHOPPINLIST_REF = document.querySelector("#divTbodyCart"); // reference to link divTbodyCart to see if it exits in document 
function pageLoad()  // called automatically when page loads. Reason (for seperate file is main.js is generic javascript ) is after page loads we need to generate dynimaic content (shoppinglist)
{
    console.log ("shoppinglist.pageLoad");
    if(GC_SHOPPINLIST_REF)
        shoppingList();
}
function shoppingList()
{

    // <tr><td>Description</td><td>Price</td><td>QTy</td><td>Total</td></tr>
    const cart = JSON.parse(sessionStorage.getItem("shoppingCart")); // converting shopping cart string from an string to an object array .
    let list=""; // generate table 
    console.log ("CART:", cart);
    for (let i in cart) // forloop - start at at index 
    {

        const item= cart[i]; // getting item at index index I. starting with 0 and looping through. 
        const total = item.price * item.qty;
        let tr =`<tr><td>${item.description}</td><td>${item.price}</td><td>${item.qty}</td><td>${total}</td></tr>`;
      //  let li = `<li>${item.description} - ${item.price} - ${item.qty}</li>` // building LI row retaining item descritption , price, and qty. 
        list+=tr; // list = list +li; combines strings together (shopping cart list + LI row)
    }
    GC_SHOPPINLIST_REF.innerHTML=list; // selecting and referencing div on page, and  adding  inner HTML content which is list and closing OL. 
}
function logout ()
{
    console.log("logout");
    sessionStorage.removeItem("shoppingCart"); // when logout remove from session storage 
    window.location.replace("/"); // replace back to root
}
pageLoad();




//ABOUT PAGE - CUSTOMER -SLIDER 
var swiper = new Swiper(".product-slider", {
    loop:true,
    spaceBetween: 20,
    autoplay: {
        delay: 7500,
        disableOnInteraction: false,
    },
    centeredSlides: true,
    breakpoints: {
      0: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 2,
      },
      1020: {
        slidesPerView: 3,
      },
    },
});

var swiper = new Swiper(".review-slider", {
    loop:true,
    spaceBetween: 20,
    autoplay: {
        delay: 7500,
        disableOnInteraction: false,
    },
    centeredSlides: true,
    breakpoints: {
      0: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 2,
      },
      1020: {
        slidesPerView: 3,
      },
    },
});

