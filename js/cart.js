function updateOrderHistory(order, position) {
    const ordersContainer = document.querySelector('.profile__orders');
    let totalSum = 0;

    order.items.forEach(item => {
        totalSum += item.productPrice * item.quantity;
    });

    let orderHTML = `
    <div class="order">
        <div class="order__header">
            <h3 class="order__date">Заказ от ${new Date(order.date).toLocaleTimeString()} ${new Date(order.date).toLocaleDateString()}</h3>
            <h4 class="order__total"><b>Итого</b>: ${totalSum.toLocaleString()} ₽</h4>
        </div>
        <div class="order__details">
            <p class="order__customer">Имя: ${order.customer}</p>
            <p class="order__phone">Телефон: ${order.phoneNumber}</p>
            <p class="order__address">Адрес: ${order.address}</p>
            <p class="order__delivery">Способ доставки: ${order.delivery}</p>
            <p class="order__payment">Способ оплаты: ${order.payment}</p>
        </div>
        <ul class="order__items">
`;

    order.items.forEach(item => {
        orderHTML += `
        <li class="order__item">
            <span class="order__item-name">${item.productName}</span>
            <span class="order__item-price">${item.quantity} x ${item.productPrice} ₽</span>
        </li>`;
    });

    orderHTML += `</ul></div>`;
    ordersContainer.insertAdjacentHTML(position, orderHTML);
}

(() => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.querySelector('.cart__table tbody');
    const cartTotalContainer = document.querySelector('.cart__total-container');
    const totalElement = document.createElement('span');
    totalElement.classList.add('cart__total-price');

    function calculateSumPrices() {
        let total = 0;
        cart.forEach(item => {
            total += item.productPrice * item.quantity;
        });
        totalElement.textContent = `${total.toLocaleString()} ₽`;
    }

    document.getElementById('checkout-form').addEventListener('submit', function (event) {
        event.preventDefault();

        const order = {
            customer: document.getElementById('customer-name').value,
            phoneNumber: document.getElementById("phone-number").value,
            address: document.getElementById('delivery-address').value,
            delivery: document.getElementById('delivery-method').value,
            payment: document.getElementById('payment-method').value,
            items: cart,
            date: new Date().toString(),
        };

        let orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.unshift(order);
        localStorage.setItem('orders', JSON.stringify(orders));

        updateOrderHistory(order,  'afterbegin');

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
                localStorage.setItem('cart', JSON.stringify(cart));
                calculateSumPrices();
            }
        } else if (e.target.classList.contains('quantity__increase')) {
            const quantityValue = e.target.previousElementSibling;
            let quantity = parseInt(quantityValue.textContent);

            quantity++;
            quantityValue.textContent = quantity;
            const product = cart.find(item => item.productName === productName);
            product.quantity = quantity;
            localStorage.setItem('cart', JSON.stringify(cart));
            calculateSumPrices();
        } else if (e.target.classList.contains('cart__item-remove')) {
            const index = cart.findIndex(item => item.productName === productName);
            if (index !== -1) {
                cart.splice(index, 1);
                e.target.closest('.cart__item').remove();
                localStorage.setItem('cart', JSON.stringify(cart));
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
    console.log(orders)
    const ordersContainer = document.querySelector('.profile__orders');

    ordersContainer.innerHTML = '';

    orders.forEach(order => updateOrderHistory(order, "beforeend"));
})();