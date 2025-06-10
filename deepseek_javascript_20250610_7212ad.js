document.addEventListener('DOMContentLoaded', function() {
    // Cart functionality
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = document.querySelector('.cart-count');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartEmpty = document.getElementById('cart-empty');
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    const deliveryFee = 2.99;

    // Update cart count
    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Update cart display
    function updateCartDisplay() {
        if (cart.length === 0) {
            cartEmpty.style.display = 'flex';
            cartItemsContainer.style.display = 'none';
        } else {
            cartEmpty.style.display = 'none';
            cartItemsContainer.style.display = 'block';
            
            // Calculate subtotal
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const total = subtotal + deliveryFee;
            
            subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
            totalElement.textContent = `$${total.toFixed(2)}`;
            
            // Render cart items
            cartItemsContainer.innerHTML = cart.map(item => `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-image">
                        <img src="images/food-items/${item.id}.jpg" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <div class="cart-item-title">
                            <h4>${item.name}</h4>
                            <span class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                        <div class="cart-item-actions">
                            <div class="quantity-control">
                                <button class="decrease">-</button>
                                <span class="quantity">${item.quantity}</span>
                                <button class="increase">+</button>
                            </div>
                            <span class="remove-item">Remove</span>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }

    // Add to cart
    document.querySelectorAll('.btn-add').forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const name = this.getAttribute('data-name');
            const price = parseFloat(this.getAttribute('data-price'));
            
            // Check if item already in cart
            const existingItem = cart.find(item => item.id === id);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id,
                    name,
                    price,
                    quantity: 1
                });
            }
            
            updateCartCount();
            updateCartDisplay();
            
            // Show added notification
            alert(`${name} added to cart!`);
        });
    });

    // Handle cart item actions
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('increase')) {
            const itemElement = e.target.closest('.cart-item');
            const itemId = itemElement.getAttribute('data-id');
            const item = cart.find(item => item.id === itemId);
            item.quantity += 1;
            updateCartCount();
            updateCartDisplay();
        }
        
        if (e.target.classList.contains('decrease')) {
            const itemElement = e.target.closest('.cart-item');
            const itemId = itemElement.getAttribute('data-id');
            const item = cart.find(item => item.id === itemId);
            
            if (item.quantity > 1) {
                item.quantity -= 1;
            } else {
                cart = cart.filter(item => item.id !== itemId);
            }
            
            updateCartCount();
            updateCartDisplay();
        }
        
        if (e.target.classList.contains('remove-item')) {
            const itemElement = e.target.closest('.cart-item');
            const itemId = itemElement.getAttribute('data-id');
            cart = cart.filter(item => item.id !== itemId);
            updateCartCount();
            updateCartDisplay();
        }
    });

    // Initialize cart display
    updateCartCount();
    updateCartDisplay();
});