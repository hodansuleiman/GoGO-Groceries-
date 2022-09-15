const express = require('express');
const { User } = require('./models'); // import and cashing inside user , now have access to the user table in database. 
const bodyParser = require('body-parser'); // Receive HTML form values from client.
const db = require('./models');
const server = express();
const port = 8080

// Static Files
server.use('/css', express.static(__dirname + "/css")); // if you see CSS this is where i want you to look, the root is ES6 so it will be ES6 
server.use('/js', express.static(__dirname + "/js")); // adding javascript

// Set Templating Engine
server.use(express.json());// middleware , rendering between client and server. when i get a post request im going to turn it into json
//server.use(expressLayouts());
server.set('view engine', 'ejs'); // middleware, we want to use ejs as our new view engine
server.use(bodyParser.urlencoded({
   extended:true
}))
// Declaration
const navbar = [
   {href:'Shop', name:'Shop'},
   {href:'About', name: 'About'},
   {href:'Reviews', name: 'Reviews'},
   {href:'Shoppinglist', name: 'Shopping List'}

   
];


//ROUTING 
server.get('/', (req,res) => {  // localhost:8080
   // req is request from client(browser)
   // res is response from server to client (browser).
  
   res.render('pages',{template:'landing',isAuthenticated:false, title:'Gogo Groceries', navbar}); //  servier is rendering which means to give or display to the client 
});

// POST MEANS CLIENT SENDS SOMETHING TO SERVER AND FOR THIS EAMPLE IT IS IS LOG IN INFO
server.post('/login', async (req,res) => {   //login page submits to server // ASYNC IS DEDICATION COMMINICATION , CLIENT IS NOT WAITING FOR RESPONSE. ASYNC = DO NOT WAIT FOR RESONSE. 
   const {email, password}=req.body;  // getting values from login page and putting them in variables , CLIENT INFORMATION IS BEING STORED IN THOSE VARIABLES , REQ WILL STORE EMAIL AND BPDY WILL STORE PASSWORD
   // authenticate against User table
   const user = await User.findOne({where: {email}}) // this is how you do it sql , retrive user record based on email. AWAIT TURNS ASYNC FUNCTION INTO SYNC DIFFERENCE (DEDICATED CONNECTION). AWAIT = WAIT FOR RESPONSE. WE ARE TRYONG TO FIND USER BASED ON EMAIL ADDRESS. 
   
   // User model of the database table User.
   // user is an object of a specific user from the database table based on the email address.
   if(user // user found // CROSS REFERENCING WITH USER MODEL
      && user.password===password)// passwords match
   {

      res.redirect('/shop');
   }else{ // either user not found or password doesn't match.
      res.redirect("/?msg=Invalid Login");
   }

});


server.post('/register', async (req,res) =>{ // client register page posts/sends to server.  The 
   const{
      firstName, lastName, email, password, confirmPassword //  stored in simple javascript variables. 
   } = req.body; // The request is data from the client. Req body is copying into those variables . 
console.log("register", req.body); // debugging we are looking to see if we got the data in the body. 

   // save to database using sql
   const user = await User.create(  // now passing values into user model which means new user into database. Now user is saved. 
      {
   firstName, lastName, email, password
      }
   )
   res.send({  //  last past is response, is to send message back to client. 
      message: `user with id ${user.id} has been created`
   })
})

server.get('/register', (req,res) => {
   res.render('pages', {template:'registration',isAuthenticated:true ,title:'registration', navbar,});
});

server.get('/logout', (req,res) => {
    res.redirect("/");
});


server.get('/shop', (req,res) => {
   res.render('pages', {template:'shop',isAuthenticated:true , title:'shop', navbar});
});   

server.get('/shoppinglist', (req,res) => { 
   res.render('pages',{template:'shoppinglist',isAuthenticated:false, title:'shoppinglist', navbar, });
});
server.get('/shop/shoppinglist', (req,res) => { 
   res.render('pages',{template:'shoppinglist',isAuthenticated:false, title:'shoppinglist', navbar, });
});

   
server.get('/about', (req,res) => {
      res.render('pages', {template:'about', isAuthenticated:true,title:'about',navbar});
});

server.get('/reviews', (req,res) => {
   res.render('pages', {template:'reviews',isAuthenticated:true, navbar, title: 'reviews'});
});


// This will go from the shop page into sub pages for each category upon click
// get shopping request from client
server.get('/shop/:category',async(req,res)=>{
   const title=req.params.category // category such as fruit, meat, etc.
   console.log("shop:", title);
   const listitems = await getItems(title); // all items from API call
   console.log ("LIST ITEMS", listitems);
  res.render('pages', {template:'categoryItemsList',isAuthenticated:true, items:listitems,navbar,title}); // send/render content the thml the page back to client
});


// ASYNC FUNCTION TO GET TOKEN/ CATEGORY ITEMS 
async function getItems (cat) // helper function to call kroger api. cat is value/variable getting passed in from browser. 
{
   const token = await getToken(); //  STEP : 1 getting auth token
   console.log ("TOKEN:", token);
   // url to access kroger api
   const itemURL = `https://api.kroger.com/v1/products/?filter.term=${cat}&filter.locationId=01400943&access_token=${token}`; // variable is passed into url. url to get actual cat itmems from kroger 
 //  console.log ("ItemURL", itemURL);
   const data = await fetch (itemURL); // fetch excutes that url that goes out kroger and gets data from kroger api.
   const temp = await data.json(); // convert to JavaScript object array.

   const items=[]; // create empty array to hold all items.
   for (let i in temp.data) // loop through each item from Kroger build new object array to send to client
   {
        let imageURL=""; // initialize image url variable.
        const row = temp.data[i]; // get row by index.
        for (let j in row.images[0].sizes) // loop through each image to find thumbnail
        {
            if(row.images[0].sizes[j].size==="thumbnail") // if thumbnail
            {
                imageURL=row.images[0].sizes[j].url; // store url to image variable
                break; // end loop
            }
        }
        // construct new object for new array to send to client.
        const item ={productId: row.productId, description:row.description, imageURL:imageURL, price:row.items[0].price}
        items.push (item); // add item to client array.
   }
   return items; // return new items array to requestor.
}


// ASYNC FUNCTION TO GET TOKEN from Kroger
async function getToken() {
   
      // auth string:
      const auth = "aG9kYW4tYWJmNzIyYmViNjdkNjBjYmRkMDM0MjA3MmQ3YmVhOGE4MTY0NjUwMTI4NDQ2NTk5MzYwOmRwaXIzdTVCbFh5RVZMWnFqNVZKYVhXV2lwVENhbmtTWHROSmt5Wkw="; // have to hide file 
      // token url:
      const tokenURL = "https://api.kroger.com/v1/connect/oauth2/token";
      const params = "grant_type=client_credentials&scope=product.compact";
      // get token from Kroger
      const data =await fetch(tokenURL,  { // post to format the call kroger API server 
         method: 'POST',
         headers: {
            'Content-type': 'application/x-www-form-urlencoded' ,
            'authorization': `Basic ${auth}`
         },
         body:params // param required by api server 
      });
      const temp =await data.json();// convert to JavaScript object
      return temp.access_token; // return token to requestor.
  }

  //LISTEN TO PORT 8080
server.listen(8080,() => {
   console.log('The server is listening at PORT 8080')
});
   


/*
server.get('/payment', (req,res) => {
         res.render('pages', {template:'payment',isAuthenticated:true, navbar, title: 'payment'});
         });
// receive payment information from client.
server.post('/payment', (req,res) => {  
   const data = {
      fullName: req.body.fullName,
      email: req.body.email,
      city: req.body.city,
      state: req.body.state,
      zipCode: req.body.zipCode,
      nameOnCard: req.body.nameOnCard,
      creditCardNumber: req.body.creditCardNumber,
      expDate: req.body.t,
      expYear: req.body.expYear,
      cvv: req.body.cvv,
      cart: req.body.cart
  }
  const cart = JSON.parse(data.cart); // convert JSON string to an actual JavaScript object array.
  console.log ("SERVER CART:", cart);
  console.log ("POST PAYMENT", data);

  // INSERT INTO database

   res.redirect("/"); // send client back to root after payment.
   //res.render('pages', {template:'payment',isAuthenticated:true, navbar, title: 'payment'});
});
*/
