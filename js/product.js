document.addEventListener("DOMContentLoaded", function () {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    document.querySelectorAll('.product').forEach(product => {
        const productName = product.querySelector('.product__name').textContent.trim();
        const productImage = product.querySelector('.product__image').getAttribute('src');

        const priceText = product.querySelector('.product__price').textContent.trim();
        const priceMatch = priceText.match(/(\d+(\s\d{3})*)/);
        const productPrice = priceMatch ? priceMatch[0].replace(/\s/g, '') : '0';

        const addToCartButton = product.querySelector('.product__add-to-cart');

        if (cart.some(item => item.productName === productName)) {
            addToCartButton.disabled = true;
            addToCartButton.textContent = "Добавлено в корзину";
        }

        addToCartButton.addEventListener('click', function () {
            if (!cart.some(item => item.productName === productName)) {
                cart.push({
                    productName: productName,
                    productImage: productImage,
                    productPrice: productPrice,
                    quantity : 1,
                });

                addToCartButton.disabled = true;
                addToCartButton.textContent = "Добавлено в корзину";
                localStorage.setItem('cart', JSON.stringify(cart));
            }
        });
    });
});
