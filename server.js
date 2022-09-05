const express = require('express');
const expressLayouts = require ('express-ejs-layouts');

const server = express();
const port = 8080

// Static Files
server.use('/css', express.static(__dirname + "/css")); // if you see CSS this is where i want you to look, the root is ES6 so it will be ES6 
server.use('/js', express.static(__dirname + "/js")); // adding javascript

// Set Templating Engine
server.use(express.json());// middleware , rendering between client and server. when i get a post request im going to turn it into json
//server.use(expressLayouts());
server.set('view engine', 'ejs'); // middleware, we want to use ejs as our new view engine

// Declaration
const navbar = ['Motherhood', 'HealthandWellness', 'Dailyroutineandschedule','Community' ];

// Navigation
server.get('/', (req,res) => {
   res.render('pages',{template:'landing',isAuthenticated:false, title:'Supermoms', navbar, });
});


server.post('/Login', (req,res) => {
   res.json({redirectURL:'/welcome'});
});

server.get('/welcome', (req,res) => {
   res.render('pages', {template:'welcome',isAuthenticated:true ,title:'welcome', navbar,});
   });    
   

   server.post('/signup', (req,res) => {
      res.json({redirectURL:'/registration'});
   });
   
   server.get('/registration', (req,res) => {
   res.render('pages', {template:'registration',isAuthenticated:true ,title:'registration', navbar,});
   });    
   

server.get('/logout', (req,res) => {
    res.json({redirectURL:'/'});
 });

// object takes in arguments = 1. where am i looking for my view (pages) and the other one is an object with variables. 
server.get('/motherhood', (req,res) => {
   res.render('pages', {template:'motherhood',isAuthenticated:true , title:'motherhood', navbar});
   });    
   
server.get('/healthandwellness', (req,res) => {
      res.render('pages', {template:'healthandwellness', isAuthenticated:true,title:'health and wellness',navbar});
      });
      
   
server.get('/dailyroutineandschedule', (req,res) => {
      res.render('pages', { template:'dailyroutineandschedule', isAuthenticated:true, title: 'dailyroutineandschedule', navbar,})
      });
         

server.get('/community', (req,res) => {
         res.render('pages', {template:'community',isAuthenticated:true, navbar, title: 'community'});
         });
   

//server.listen( port,() => console.info(`Server listenting on port ${port}`))



//server.get('/', (req,res) => {
  //  res.render('pages',{template:'landing'}); // we want it to render inside pages, and the template that we want it to render is landing , passing an object with a key valuse pair to that page. the template is equal to landing. 
 //});

 //server.get('/welcome', (req,res) => {
   // res.render('pages',{template:'gallery', isAuthenticated:true, navs}); // changed route
//});


//Listen on Port 8080
server.listen(8080,() => {
console.log('The server is listening at PORT 8080')
});



//const navs = ['About', 'Contact', 'Gallery' ];