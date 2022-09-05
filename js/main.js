// code required
// 1. event listener for toggle menu  
// 2. event listener for splash screen - not working
// 3.event listener for user input
// 4. on click function for user input with name and welcome message 


// login button

const authBtn = document.getElementById('auth');


authBtn.addEventListener('click', e => {
const type = e.target.dataset.type; 
const body = type === 'login' ?  JSON.stringify({login:true}) : null;
const TYPE = type === 'login' ? 'POST' : 'GET';

    fetch(`/${type}`, {
        method: TYPE,
        body,
        headers: {
            'Content-Type': 'application/json'
        }
    }) .then(data => data.json()).then(response => {
        window.location = response.redirectURL;
    });
});


// registration button -NOT WORKING , USED MATT EXAMPLE
const regBtn = document.getElementById('reg');

regBtn.addEventListener('click', e => {
    const type = e.target.dataset.type; 
    const body = type === 'sign up' ?  JSON.stringify({login:true}) : null;
    const TYPE = type === 'sign up' ? 'POST' : 'GET';
    
        fetch(`/${type}`, {
            method: TYPE,
            body,
            headers: {
                'Content-Type': 'application/json'
            }
        }) .then(data => data.json()).then(response => {
            window.location = response.redirectURL;
        });
    });
    


// toggle // only works on landing page, the other pages not active 
const toggleButton = document.getElementsByClassName('toggle-button')[0];
const navbarLinks = document.getElementsByClassName('navbar-links')[0];

toggleButton.addEventListener('click', () => {
  navbarLinks.classList.toggle('active');
});
