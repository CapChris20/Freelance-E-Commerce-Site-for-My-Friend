$(document).ready(function(){ // ensures the code inside the function runs only after the entire DOM (Document Object Model) has been fully loaded //
    // cache jquery selector 
    const $menuCartElement = $('.menu-cart'); // for menu button //
    const $cartItemsElement = $('.cart-list'); // for list of macarons ordered //
    const $cartElement = $('.cart'); // for cart button//
    const $mainElement = $('.main'); // for main content, such as product list //

    let cart = []; // array for when cart is empty //

    // Function to Add Product to The Cart
    function addToCart(productElement) { // function to add items to cart //
        const $productElement = $(productElement); // checks if product is already in cart //
        const productId = $productElement.data('product'); // const that obtains data based off the product cards
        const productName = $productElement.find('.product-title').text();
        const productPrice = parseFloat($productElement.find('.product-price').text().replace('$',''));
        const productImage = $productElement.find('.product-img').attr('src');

        // his checks if an item already exists in the cart array by matching the productId. //
        let existingItem = cart.find(item => item.id === productId);

        if(existingItem) {
            existingItem.quantity += 1; // increment quantity if item exists
        } 

        // If the item is not found in the cart, this block is executed, and a new item is created with the productId, productName, productPrice, productImage, and a quantity of 1.//
        else {
            const newItem = {
                id : productId,
                name : productName,
                price : productPrice,
                image : productImage,
                quantity: 1
            };
            // Add new item to the cart
            cart.push(newItem); 
        }
        // update cart count 
        updateCartCount();
        // Re-render cart items
        renderCartItems();
    }

    // Function to Update the Cart Count Displayed in the menu cart
    function updateCartCount() {
        const itemCount = cart.reduce((count,item) => count + item.quantity,0);
        $menuCartElement.find('.cart-count').text(itemCount);
    }

    // Function to render the items on the cart
    function renderCartItems() {
        // clear the cart items container
        $cartItemsElement.empty();

        if (cart.length === 0) {
            // display image of empty when the cart is empty
            $cartItemsElement.html (`
                <div class="cart-empty">
                    <img src="empty.svg">
                    <p>Your Cart is Empty</p>
                </div>
            `);
        } else {
            // iterate through the cart and display each item
            $.each(cart, function(index,item){
                const $cartItemElement = $('<div class="cart-item"></div>');
                $cartItemElement.html(`
                    <img class="cart-item-img" src="${item.image}" alt="${item.name}">
                    <div class="cart-item-desc">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-quantity">
                            <button class="change-quantity" data-id="${item.id}" data-action="decrement">-</button>
                            ${item.quantity}
                            <button class="change-quantity" data-id="${item.id}" data-action="increment">+</button>
                        </div>
                    </div>
                    <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                    <button class="cart-item-remove" data-id="${item.id}"><i class="fa solid fa-trash"></i></button>
                `);
                $cartItemsElement.append($cartItemElement);
            })
        }
        // update the order summary / cart action
        updateOrderSummary();
    }

    // Function to Update the order summary (subtotal, tax, total)
    function updateOrderSummary() {
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity,0);
        const tax = subtotal * 0.10; // we assume the tax 10%
        const total = subtotal + tax;

        $('#total-price .cart-amount-value').text(`$${subtotal.toFixed(2)}`);
        $('#tax .cart-amount-value').text(`$${tax.toFixed(2)}`);
        $('#final-price .cart-amount-value').text(`$${total.toFixed(2)}`);
    }


    // event handler 

    // Event listener for Adding product to the cart
    $('.add-to-cart').on('click', function(){
        const productElement = $(this).closest('.product');
        addToCart(productElement);
    });

    // Event listener for Changing The Quantity of the Cart item
    $cartItemsElement.on('click', '.change-quantity', function(){
        const itemId = $(this).data('id');
        const action = $(this).data('action');
        const item = cart.find(item => item.id === itemId);

        if (action === 'increment') {
            item.quantity += 1;
        } else if (action === 'decrement' && item.quantity > 1) {
            item.quantity -= 1;
        }

        updateCartCount();
        renderCartItems();
    });

    // Event Listener for Removing the item from cart
    $cartItemsElement.on('click','.cart-item-remove', function(){
        const itemId = $(this).data('id');
        cart = cart.filter(item => item.id !== itemId);

        updateCartCount();
        renderCartItems();
    });

    // Event Listener for toggling the cart view
    $menuCartElement.on('click', function() {
        $cartElement.toggleClass('collapsed');
        $mainElement.toggleClass('expanded', $cartElement.hasClass('collapsed'));
    });

    renderCartItems(); // initial render of cart items

});
