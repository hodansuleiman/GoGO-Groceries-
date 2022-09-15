// function pageLoad()  // called automatically when page loads. Reason (for seperate file is main.js is generic javascript ) is after page loads we need to generate dynimaic content (shoppinglist)
// {
//     console.log ("shoppinglist.pageLoad");
//     shoppingList();
// }
// function shoppingList()
// {
//     const cart = JSON.parse(sessionStorage.getItem("shoppingCart")); // converting shopping cart string from an string to an object array .
//     let list="<ol>"; // generate an OL list for returned object array .
//     for (let i in cart) // forloop - start at at index 
//     {
//         const item= cart[i]; // getting item at index index I. starting with 0 and looping through. 
//         let li = `<li>${item.description} - ${item.price} - ${item.qty}</li>` // building LI row retaining item descritption , price, and qty. 
//         list+=li; // list = list +li; combines strings together (shopping cart list + LI row)
//     }
//     document.querySelector("#divShoppingList").innerHTML=list+"</ol>"; // selecting and referencing div on page, and  adding  inner HTML content which is list and closing OL. 
// }