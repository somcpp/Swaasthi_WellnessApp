// script.js

// Sample products data (in practice, this would be fetched from products.json)
const products = [
    {
        "id": 1,
        "name": "Ashwagandha Capsules",
        "description": "Ashwagandha (Withania somnifera) is a cornerstone of Ayurvedic medicine, celebrated as an adaptogen that helps the body cope with stress and fatigue...",
        "price": 250,
        "uses": "Reduces stress and anxiety, improves sleep, enhances stamina, supports immunity, balances hormones.",
        "image": "products/Aswagnadha.jpg"
    },
    {
        "id": 2,
        "name": "Triphala Powder",
        "description": "Triphala is a time-honored Ayurvedic blend of three fruits: Amalaki, Bibhitaki, and Haritaki...",
        "price": 150,
        "uses": "Aids digestion, detoxifies the body, supports weight loss, improves eyesight, enhances skin health.",
        "image": "products/Triphala.jpg"
    },
    {
        "id": 3,
        "name": "Tulsi Drops",
        "description": "Tulsi (Ocimum sanctum), known as Holy Basil, is a sacred herb in Ayurveda with profound healing properties...",
        "price": 100,
        "uses": "Supports respiratory health, boosts immunity, reduces stress, purifies blood, fights infections.",
        "image": "products/tulsi.jpg"
    },
    {
        "id": 4,
        "name": "Shilajit Resin",
        "description": "Shilajit is a mineral-rich resin sourced from the Himalayas, revered in Ayurveda for its rejuvenating and revitalizing effects...",
        "price": 500,
        "uses": "Increases energy and stamina, enhances cognition, supports male vitality, aids detoxification.",
        "image": "products/silajit.jpg"
    },
    {
        "id": 5,
        "name": "Neem Tablets",
        "description": "Neem (Azadirachta indica) is a versatile Ayurvedic herb known for its antibacterial, antifungal, and blood-purifying properties...",
        "price": 200,
        "uses": "Purifies blood, treats skin disorders, supports liver health, regulates blood sugar, boosts immunity.",
        "image": "products/neem.jpg"
    },
    {
        "id": 6,
        "name": "Brahmi Syrup",
        "description": "Brahmi (Bacopa monnieri) is a renowned Ayurvedic herb for brain health and cognitive enhancement...",
        "price": 180,
        "uses": "Enhances memory, improves concentration, reduces anxiety, supports nervous system, protects brain cells.",
        "image": "products/Brahmi.jpg"
    },
    {
        "id": 7,
        "name": "Giloy Juice",
        "description": "Giloy (Tinospora cordifolia), also known as Guduchi, is a powerful Ayurvedic herb celebrated for its immune-boosting and detoxifying properties...",
        "price": 220,
        "uses": "Boosts immunity, reduces fever, detoxifies liver, manages diabetes, relieves arthritis.",
        "image": "products/giloy.jpg"
    },
    {
        "id": 8,
        "name": "Amla Candy",
        "description": "Amla (Emblica officinalis), or Indian Gooseberry, is a superfood in Ayurveda, packed with vitamin C and antioxidants...",
        "price": 120,
        "uses": "Improves digestion, boosts immunity, enhances skin and hair, supports metabolism, fights oxidative stress.",
        "image": "products/amla candy.jpg"
    },
    {
        "id": 9,
        "name": "Arjuna Capsules",
        "description": "Arjuna (Terminalia arjuna) is an Ayurvedic herb prized for its heart-healthy properties...",
        "price": 300,
        "uses": "Supports heart health, regulates blood pressure, reduces cholesterol, strengthens heart muscle, manages stress.",
        "image": "products/arjuna.jpg"
    },
    {
        "id": 10,
        "name": "Moringa Powder",
        "description": "Moringa (Moringa oleifera), often called the 'drumstick tree,' is a nutrient-dense Ayurvedic superfood...",
        "price": 180,
        "uses": "Boosts energy, supports immunity, reduces inflammation, improves bone health, prevents anemia.",
        "image": "products/Moringa.jpg"
    },
    {
        "id": 11,
        "name": "Safed Musli Capsules",
        "description": "Safed Musli (Chlorophytum borivilianum) is a potent Ayurvedic herb known for its aphrodisiac and rejuvenating properties...",
        "price": 450,
        "uses": "Enhances male vitality, improves stamina, supports reproductive health, boosts immunity, reduces fatigue.",
        "image": "products/Safed.jpg"
    },
    {
        "id": 12,
        "name": "Haritaki Powder",
        "description": "Haritaki (Terminalia chebula) is one of the three fruits in Triphala and a standalone powerhouse in Ayurveda...",
        "price": 140,
        "uses": "Aids digestion, detoxifies body, improves metabolism, enhances cognition, balances doshas.",
        "image": "products/Haritaki.jpg"
    },
    {
        "id": 13,
        "name": "Guggul Tablets",
        "description": "Guggul (Commiphora wightii) is an Ayurvedic resin valued for its cholesterol-lowering and anti-inflammatory properties...",
        "price": 350,
        "uses": "Lowers cholesterol, supports weight loss, reduces inflammation, improves thyroid function, relieves arthritis.",
        "image": "products/guggul.jpg"
    },
    {
        "id": 14,
        "name": "Karela Juice",
        "description": "Karela (Momordica charantia), or bitter melon, is a traditional Ayurvedic remedy for blood sugar regulation...",
        "price": 190,
        "uses": "Regulates blood sugar, improves liver function, boosts digestion, detoxifies body, supports metabolism.",
        "image": "products/Karela Juice.jpg"
    }
];

// Cart initialization
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
    }
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showAddedToCartNotification(product.name);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCartItems();
}

function showAddedToCartNotification(productName) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `<span>${productName} added to cart!</span>`;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
}

function renderCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty. <a href="store.html">Continue shopping</a></p>';
        cartTotalElement.textContent = 'Total: ₹0';
    } else {
        let total = 0;
        cartItemsContainer.innerHTML = cart.map(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            return `
                <div class="cart-item">
                    <div class="item-info">
                        <span class="item-name">${item.name}</span>
                        <div class="item-controls">
                            <button onclick="updateQuantity(${item.id}, -1)">-</button>
                            <span class="item-quantity">${item.quantity}</span>
                            <button onclick="updateQuantity(${item.id}, 1)">+</button>
                        </div>
                    </div>
                    <div class="item-right">
                        <span class="item-total">₹${itemTotal}</span>
                        <button class="remove-btn" onclick="removeFromCart(${item.id})">×</button>
                    </div>
                </div>
            `;
        }).join('');
        cartTotalElement.textContent = `Total: ₹${total}`;
    }
    
    updateCheckoutButtonState();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        renderCartItems();
    }
}

function updateCheckoutButtonState() {
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.disabled = cart.length === 0;
    }
}

function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    alert(`Order confirmed! Total: ₹${cart.reduce((total, item) => total + (item.price * item.quantity), 0)}`);
    cart = [];
    localStorage.removeItem('cart');
    updateCartCount();
    renderCartItems();
}

// Medicine display functions
function displayMedicines(productsToShow) {
    const container = document.getElementById('medicine-cards');
    if (!container) return;
    
    container.innerHTML = productsToShow.map(product => `
        <div class="medicine-card">
            <div class="image-placeholder">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <h3>${product.name}</h3>
            <p class="description">${product.description}</p>
            <span class="read-more" onclick="toggleDescription(this)">Read More</span>
            <div class="price">₹${product.price}</div>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        </div>
    `).join('');
}

function toggleDescription(element) {
    const description = element.previousElementSibling;
    description.classList.toggle('expanded');
    element.textContent = description.classList.contains('expanded') ? 'Read Less' : 'Read More';
}

function searchMedicines() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;
    
    const searchTerm = searchInput.value.toLowerCase();
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.uses.toLowerCase().includes(searchTerm)
    );
    displayMedicines(filteredProducts);
}

// Initialize
window.onload = function() {
    updateCartCount();
    renderCartItems();
    updateCheckoutButtonState();
    
    // Store page specific initialization
    if (document.getElementById('medicine-cards')) {
        displayMedicines(products);
        
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') searchMedicines();
            });
        }
    }
    
    // Cart icon navigation
    const cartIcon = document.querySelector('.cart');
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'cart.html';
        });
    }
};