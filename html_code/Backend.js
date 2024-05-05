var users = JSON.parse(localStorage.getItem('users')) || [];
var currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Function to register a new user
function register() {
    var registerUsername = document.getElementById("registerUsername").value;
    var registerPassword = document.getElementById("registerPassword").value;
    var registerConfirmPassword = document.getElementById("registerConfirmPassword").value;

    if (registerPassword.length < 8) {
        alert("Password must be at least 8 characters long.");
        return;
    }

    if (registerPassword !== registerConfirmPassword) {
        alert("Passwords do not match. Please try again.");
        return;
    }

    if (localStorage.getItem(registerUsername)) {
        alert("Username already exists. Please choose a different username.");
        return;
    }

    localStorage.setItem(registerUsername, registerPassword);

    alert("Registration successful!");
}

document.addEventListener("DOMContentLoaded", function() {
    var submitRegisternButton = document.getElementById("registerEnter");
    if (submitRegisternButton) {
        submitRegisternButton.addEventListener("click", function(event) {
            event.preventDefault();
            register();
        });
    }
});

// Function to handle user login
function login() {
    var loginUsername = document.getElementById("loginUsername").value;
    var loginPassword = document.getElementById("loginPassword").value;

    var storedPassword = localStorage.getItem(loginUsername);

    if (storedPassword === null) {
        alert("Username not found. Please register first.");
        return;
    }

    if (loginPassword !== storedPassword) {
        alert("Incorrect password. Please try again.");
        return;
    }

    currentUser = {
        username: loginUsername,
        password: loginPassword,
        shoppingCart: JSON.parse(localStorage.getItem(loginUsername + "_cart")) || {} // Retrieve shopping cart from localStorage
    };

    localStorage.setItem('loggedIn', 'true'); // Set login flag in local storage
    localStorage.setItem('currentUser', JSON.stringify(currentUser)); // Save current user in local storage
    alert("Login sucsessful");
}

document.addEventListener("DOMContentLoaded", function() {
    var submitLoginButton = document.getElementById("loginEnter");
    if (submitLoginButton) {
        submitLoginButton.addEventListener("click", function(event) {
            event.preventDefault();
            login();
        });
    }

    // Initialize login status when the page loads
    if (localStorage.getItem('loggedIn') === 'true') {
        currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }
});


// Function to handle user logout
function logout() {
    currentUser = null;
    localStorage.removeItem('loggedIn'); // Remove login flag from local storage
    localStorage.removeItem('currentUser'); // Remove current user from local storage
    console.log("Logged out successfully!");
}

// Function to check if a user is logged in
function isLoggedIn() {
    return currentUser !== null;
}

document.addEventListener("DOMContentLoaded", function() {
    var submitLoginButton = document.getElementById("loginEnter");
    if (submitLoginButton) {
        submitLoginButton.addEventListener("click", function(event) {
            event.preventDefault();
            login();
        });
    }

    // Initialize login status when the page loads
    if (localStorage.getItem('loggedIn') === 'true') {
        currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }
});


// Function to handle user logout
function logout() {
    currentUser = null;
    localStorage.removeItem('loggedIn'); // Remove login flag from local storage
    localStorage.removeItem('currentUser'); // Remove current user from local storage
    console.log("Logged out successfully!");
}

// Function to check if a user is logged in
function isLoggedIn() {
    return currentUser !== null;
}

// Function to display shopping cart items
function displayShoppingCart() {
    var cartItemsElement = document.getElementById("cartItems");
    var cartTotalPriceElement = document.getElementById("cartTotalPrice");

    if (!cartItemsElement) {
        console.error("cartItemsElement not found");
        return;
    }

    cartItemsElement.innerHTML = "";

    var totalPrice = 0;

    for (var itemId in currentUser.shoppingCart) {
        if (currentUser.shoppingCart.hasOwnProperty(itemId)) {
            var item = currentUser.shoppingCart[itemId];
            var totalItemPrice = item.price * item.quantity;
            totalPrice += totalItemPrice;

            var cartItemDiv = document.createElement("div");
            cartItemDiv.classList.add("cart-item");

            cartItemDiv.innerHTML = `
                <p><strong>${item.name}</strong> - $${item.price} (${item.quantity}x)</p>
                <select class="quantity-selector" data-item-id="${itemId}" data-item-price="${item.price}">
                    <option value="1" ${item.quantity === 1 ? 'selected' : ''}>1</option>
                    <option value="2" ${item.quantity === 2 ? 'selected' : ''}>2</option>
                    <option value="3" ${item.quantity === 3 ? 'selected' : ''}>3</option>
                    <option value="4" ${item.quantity === 4 ? 'selected' : ''}>4</option>
                    <option value="5" ${item.quantity === 5 ? 'selected' : ''}>5</option>
                    <!-- Add more options as needed -->
                </select>
                <button class="remove-item" data-item-id="${itemId}">Remove</button>
            `;

            cartItemsElement.appendChild(cartItemDiv);
        }
    }

    cartTotalPriceElement.textContent = totalPrice.toFixed(2);
}

document.addEventListener("DOMContentLoaded", function() {
    if (isLoggedIn()) {
        // User is logged in, so display the shopping cart
        displayShoppingCart();
    }
});

// Function to add items to the cart
function addToCart(itemId, itemName, itemPrice, quantity) {
    if (!currentUser || !currentUser.shoppingCart) {
        console.error("User not logged in or shopping cart not initialized.");
        return;
    }
    if (!currentUser.shoppingCart[itemId]) {
        currentUser.shoppingCart[itemId] = {
            name: itemName,
            price: itemPrice,
            quantity: quantity
        };
    } else {
        currentUser.shoppingCart[itemId].quantity += quantity;
    }
    // Update the shopping cart in localStorage
    localStorage.setItem(currentUser.username + "_cart", JSON.stringify(currentUser.shoppingCart));
    localStorage.setItem('currentUser', JSON.stringify(currentUser)); // Save current user in local storage
}

// Function to remove items from the cart
function removeFromCart(itemId) {
    if (!currentUser || !currentUser.shoppingCart) {
        console.error("User not logged in or shopping cart not initialized.");
        return;
    }
    if (currentUser.shoppingCart[itemId]) {
        delete currentUser.shoppingCart[itemId];
    }
    // Update the shopping cart in localStorage
    localStorage.setItem(currentUser.username + "_cart", JSON.stringify(currentUser.shoppingCart));
    localStorage.setItem('currentUser', JSON.stringify(currentUser)); // Save current user in local storage
}

// Function to update the quantity of items in the cart
function updateCartQuantity(itemId, quantity) {
    if (!currentUser || !currentUser.shoppingCart) {
        console.error("User not logged in or shopping cart not initialized.");
        return;
    }
    if (currentUser.shoppingCart[itemId]) {
        currentUser.shoppingCart[itemId].quantity = quantity;
    }
    // Update the shopping cart in localStorage
    localStorage.setItem(currentUser.username + "_cart", JSON.stringify(currentUser.shoppingCart));
    localStorage.setItem('currentUser', JSON.stringify(currentUser)); // Save current user in local storage
}

// Event listener for item buttons to add items to cart
document.addEventListener("DOMContentLoaded", function() {
    var itemButtons = document.querySelectorAll(".item-button");
    itemButtons.forEach(function(button) {
        button.addEventListener("click", function(event) {
            if (!isLoggedIn()) {
                alert("Please log in to add items to the cart.");
                return;
            }
            var parentElement = button.closest('.card');
            if (parentElement) {
                var itemNameElement = parentElement.querySelector('h1');
                if (itemNameElement) {
                    var itemId = button.getAttribute("id");
                    var itemName = itemNameElement.textContent.trim();
                    var itemPrice = itemPrices[itemId];
                    addToCart(itemId, itemName, itemPrice, 1); // Adding one item by default
                    // Update the shopping cart display after adding an item
                    displayShoppingCart();
                } else {
                    console.error("No <h1> element found within the parent element.");
                }
            } else {
                console.error("Parent element of the button not found.");
            }
        });
    });
});

// Event listener for removing items from the cart
document.addEventListener("click", function(event) {
    if (event.target.classList.contains("remove-item")) {
        var itemId = event.target.getAttribute("data-item-id");
        removeFromCart(itemId);
        // Update the shopping cart display after removing an item
        displayShoppingCart();
    }
});

// Event listener for changing quantity in the cart
document.addEventListener("change", function(event) {
    if (event.target.classList.contains("quantity-selector")) {
        var itemId = event.target.getAttribute("data-item-id");
        var newQuantity = parseInt(event.target.value);
        updateCartQuantity(itemId, newQuantity);
        // Update the shopping cart display after changing quantity
        displayShoppingCart();
    }
});

// Display the shopping cart items when the page loads
document.addEventListener("DOMContentLoaded", function() {
    displayShoppingCart();
});



/// CARDS -----------


let thobeShop = document.getElementById("thobeShop");
let keffiyahShop = document.getElementById("keffiyahShop");
let BishtShop = document.getElementById("bishtShop");


let ShopItemsData = [{
    id: "Thobe_item_1",
    name: "White Thobe",
    price: "200",
    desc: "Embrace timeless elegance with our premium white thobe, exquisitely crafted for the modern gentleman",
    img: "Images/products/white_thobe_product_image.jpg",
    num: "item1"
},{
    id: "Thobe_item_2",
    name: "Black Thobe",
    price: "200",
    desc: "Embrace timeless elegance with our premium white thobe, exquisitely crafted for the modern gentleman",
    img: "Images/products/black_thobe.jpg",
    num: "item2"
},

// Keffiyah
{
    id: "Keffiyah",
    name: "Keffiyah Green",
    price: "200",
    desc: "Embrace timeless elegance with our premium white thobe, exquisitely crafted for the modern gentleman",
    img: "Images/products/green_and_white_keffiyah.jpg",
    num: "item3"
},{
    id: "Keffiyah",
    name: "Keffiyah Red",
    price: "200",
    desc: "Embrace timeless elegance with our premium white thobe, exquisitely crafted for the modern gentleman",
    img: "Images/products/red_and_white_keffiyah.jpg",
    num: "item4"
},{
    id: "Keffiyah",
    name: "Keffiyah Black",
    price: "200",
    desc: "Embrace timeless elegance with our premium white thobe, exquisitely crafted for the modern gentleman",
    img: "Images/products/black_and_white_keffiyah.jpg",
    num: "item5"
},

// Bishts
{
    id: "Bisht",
    name: "Gold Bisht",
    price: "200",
    desc: "Embrace timeless elegance with our premium white thobe, exquisitely crafted for the modern gentleman",
    img: "Images/products/bisht.png",
    num: "item6"
},{
    id: "Bisht",
    name: "Bisht White",
    price: "200",
    desc: "Embrace timeless elegance with our premium white thobe, exquisitely crafted for the modern gentleman",
    img: "Images/products/black_bisht.webp",
    num: "item7"
}]

var itemPrices = {
    "item1": 10,
    "item2": 20,
    "item3": 15,
    "item4": 40,
    "item5": 15,
    "item6": 60,
    "item7": 10
};


let thobeShopGenerate = () => {
    let thobeItems = ShopItemsData.filter(item => item.id.includes('Thobe'));

    let thobeShopHTML = thobeItems.map(item => {
        return `<div class="card">
            <img src="${item.img}" max-width="200px" height="200px">
            <h1>${item.name}</h1>
            <p class="price">${item.price} kr</p>
            <p>${item.desc}</p>
            <p><button id="${item.num}" class="item-button">Add to Cart</button></p>
        </div>`;
    }).join('');

    thobeShop.innerHTML = thobeShopHTML;
};


let keffiyahShopGenerate = () => {
    let keffiyahItems = ShopItemsData.filter(item => item.id.includes('Keffiyah'));
    
    let keffiyahHTML = keffiyahItems.map(item => {
        return `<div class="card">
            <img src="${item.img}" max-width="200px"  height="200px" >
            <h1>${item.name}</h1>
            <p class="price">${item.price} kr</p>
            <p>${item.desc}</p>
            <p><button id="${item.num}" class="item-button">Add to Cart</button></p>
        </div>`;
    }).join('');

    keffiyahShop.innerHTML = keffiyahHTML;
};


let bishtShopGenerate = () => {
    let bishtItems = ShopItemsData.filter(item => item.id.includes('Bisht'));
    
    let bishtHTML = bishtItems.map(item => {
        return `<div class="card">
            <img src="${item.img}" max-width="200px" height="200px">
            <h1>${item.name}</h1>
            <p class="price">${item.price} kr</p>
            <p>${item.desc}</p>
            <p><button id="${item.num}" class="item-button">Add to Cart</button></p>
        </div>`;
    }).join('');

    bishtShop.innerHTML = bishtHTML;
};

if (window.location.href.includes("thobe")) {
    thobeShopGenerate();
} 
else if (window.location.href.includes("keffiyah")) {
    keffiyahShopGenerate();
} 
else if (window.location.href.includes("bisht")) {
    bishtShopGenerate();
}