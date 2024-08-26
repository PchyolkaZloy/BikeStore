(() => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.querySelector('.cart__items');
    const totalElement = document.createElement('div');
    totalElement.classList.add('cart__total');

    function updateCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function calculateSumPrices() {
        let total = 0;
        cart.forEach(item => {
            total += item.productPrice * item.quantity;
        });
        totalElement.textContent = `Итоговая сумма: ${total.toLocaleString()} ₽`;
    }

    document.getElementById('checkout-form').addEventListener('submit', function (event) {
        event.preventDefault();
        const name = document.getElementById('customer-name').value;
        const address = document.getElementById('delivery-address').value;
        const paymentMethod = document.getElementById('payment-method').value;

        const order = {
            customer: name,
            address: address,
            payment: paymentMethod,
            items: cart,
            date: new Date().toString(),
        };

        let orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
        localStorage.removeItem('cart');
        alert('Ваш заказ подтвержден!');
    });

    cartContainer.addEventListener('click', function (e) {
        const productName = e.target.closest('.cart__item').querySelector('h4').textContent;

        if (e.target.classList.contains('quantity__decrease')) {
            const quantityValue = e.target.nextElementSibling;
            let quantity = parseInt(quantityValue.textContent);

            if (quantity > 1) {
                quantity--;
                quantityValue.textContent = quantity;
                const product = cart.find(item => item.productName === productName);
                product.quantity = quantity;
                updateCart();
                calculateSumPrices();
            }
        } else if (e.target.classList.contains('quantity__increase')) {
            const quantityValue = e.target.previousElementSibling;
            let quantity = parseInt(quantityValue.textContent);

            quantity++;
            quantityValue.textContent = quantity;
            const product = cart.find(item => item.productName === productName);
            product.quantity = quantity;
            updateCart();
            calculateSumPrices();
        }
    });

    cartContainer.innerHTML = '';
    cartContainer.appendChild(totalElement);
    calculateSumPrices();

    cart.forEach(item => {
        const productHTML = `
                <div class="cart__item">
                    <img src="${item.productImage}" alt="${item.productName}" class="cart__item-image">
                    <h4>${item.productName}</h4>
                    <p>${item.productPrice.toLocaleString()} ₽</p>
                    <div class="cart-item__quantity">
                        <button class="quantity__decrease">-</button>
                        <span class="quantity__value">${item.quantity || 1}</span>
                        <button class="quantity__increase">+</button>
                    </div>
                    <button class="cart__item-remove">Удалить</button>
                </div>
            `;
        cartContainer.insertAdjacentHTML('beforeend', productHTML);
    });
})();

// Order history
(() => {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const ordersContainer = document.querySelector('.profile__orders');

    ordersContainer.innerHTML = '';
    if (orders.length === 0) {
        let emptyHTML = `
        <h3>Вы еще не сделали ни одного заказа!</h3>`
        ordersContainer.insertAdjacentHTML('beforeend', emptyHTML);

        return;
    }

    let totalSum = 0;
    orders.forEach(order => {
        let orderHTML = `
                <div class="order">
                    <h3>Заказ от ${new Date(order.date).toLocaleTimeString()} ${new Date(order.date).toLocaleDateString()} </h3>
                    <p>Имя: ${order.customer}</p>
                    <p>Адрес: ${order.address}</p>
                    <p>Способ оплаты: ${order.payment}</p>
                    <ul class="order__items">
            `;
        order.items.forEach(item => {
            orderHTML += `<li>${item.productName} - ${item.productPrice} ₽ x ${item.quantity}</li>`;
            totalSum += item.productPrice * item.quantity;
        });

        orderHTML += `</ul><h4>Итого ${totalSum} ₽</h4></div>`;
        ordersContainer.insertAdjacentHTML('beforeend', orderHTML);
    });
})();