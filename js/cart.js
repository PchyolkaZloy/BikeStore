function updateOrderHistory(order) {
    const ordersContainer = document.querySelector('.profile__orders');
    let totalSum = 0;

    let orderHTML = `
            <div class="order">
                <h3>Заказ от ${new Date(order.date).toLocaleTimeString()} ${new Date(order.date).toLocaleDateString()}</h3>
                <p>Имя: ${order.customer}</p>
                <p>Адрес: ${order.address}</p>
                <p>Способ оплаты: ${order.payment}</p>
                <ul class="order__items">
        `;

    order.items.forEach(item => {
        orderHTML += `<li>${item.productName} - ${item.productPrice} ₽ x ${item.quantity}</li>`;
        totalSum += item.productPrice * item.quantity;
    });

    orderHTML += `</ul><h4>Итого ${totalSum.toLocaleString()} ₽</h4></div>`;
    ordersContainer.insertAdjacentHTML('afterbegin', orderHTML);
}

(() => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.querySelector('.cart__table tbody');
    const cartTotalContainer = document.querySelector('.cart__total-container');
    const totalElement = document.createElement('span');
    totalElement.classList.add('cart__total-price');

    function updateCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function calculateSumPrices() {
        let total = 0;
        cart.forEach(item => {
            total += item.productPrice * item.quantity;
        });
        totalElement.textContent = `${total.toLocaleString()} ₽`;
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
        orders.unshift(order);
        localStorage.setItem('orders', JSON.stringify(orders));

        updateOrderHistory(order);

        localStorage.removeItem('cart');
        cart.length = 0;
        cartContainer.innerHTML = '';
        calculateSumPrices();

        alert('Ваш заказ подтвержден!');
    });


    cartContainer.addEventListener('click', function (e) {
        const productName = e.target.closest('.cart__item').querySelector('.cart__item-details span').textContent;

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
        } else if (e.target.classList.contains('cart__item-remove')) {
            const index = cart.findIndex(item => item.productName === productName);
            if (index !== -1) {
                cart.splice(index, 1);
                e.target.closest('.cart__item').remove();
                updateCart();
                calculateSumPrices();
            }
        }
    });

    cartContainer.innerHTML = '';
    cartTotalContainer.appendChild(totalElement);
    calculateSumPrices();

    cart.forEach(item => {
        const productTrHTML = `
        <tr class="cart__item">
            <td class="cart__item-details">
                <img src="${item.productImage}" alt="${item.productName}" class="cart__item-image">
                <span>${item.productName}</span>
            </td>
            <td class="cart__item-price">${item.productPrice.toLocaleString()} ₽</td>
            <td>
                <div class="cart__item-quantity">
                    <button class="cart__item-button quantity__decrease">-</button>
                    <span class="quantity__value">${item.quantity || 1}</span>
                    <button class="cart__item-button quantity__increase">+</button>
                    <button class="cart__item-remove">X</button>
                </div>
            </td>
        </tr>`;
        cartContainer.insertAdjacentHTML('beforeend', productTrHTML);
    });
})();

// Order history initialization
(() => {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const ordersContainer = document.querySelector('.profile__orders');

    ordersContainer.innerHTML = '';
    if (orders.length === 0) {
        ordersContainer.insertAdjacentHTML('beforeend', `<h3>Вы еще не сделали ни одного заказа!</h3>`);

        return;
    }

    orders.forEach(order => updateOrderHistory(order));
})();