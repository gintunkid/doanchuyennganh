// cart.js

import { db } from './firebase-config.js';

// Khởi tạo giỏ hàng từ localStorage
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

// Lưu giỏ hàng vào localStorage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Hiển thị giỏ hàng
async function displayCart() {
    try {
        const cart = getCart();
        const cartContent = document.querySelector('.cart-content-left table tbody');
        const totalQuantityElement = document.getElementById('total-quantity');
        const totalPriceElement = document.getElementById('total-price');
        const subtotalPriceElement = document.getElementById('subtotal-price');

        if (!cartContent) return;
        cartContent.innerHTML = '';

        let total = 0;
        let totalItems = 0;

        for (const item of cart) {
            try {
                const docRef = db.collection("product").doc("sach").collection("comic").doc(item.id);
                const doc = await docRef.get();
                
                if (doc.exists) {
                    const product = doc.data();
                    const subtotal = product.price * item.quantity;
                    total += subtotal;
                    totalItems += item.quantity;

                    const row = `
                        <tr>
                            <td><img src="${product.imageURL}" alt="${product.name}"></td>
                            <td><p>${product.name}</p></td>
                            <td>
                                <div class="quantity-controls">

                                    <input type="number" value="${item.quantity}" min="1" 
                                           onchange="updateQuantity('${item.id}', this.value)">
                                </div>
                            </td>
                            <td><p>${subtotal.toLocaleString('vi-VN')}đ</p></td>
                            <td><button onclick="removeItem('${item.id}')" class="remove-btn">Xóa</button></td>
                        </tr>
                    `;
                    cartContent.innerHTML += row;
                }
            } catch (error) {
                console.error("Error loading product:", error);
            }
        }

        // Cập nhật tổng tiền và số lượng
        totalPriceElement.textContent = `${total.toLocaleString('vi-VN')}đ`;
        totalQuantityElement.textContent = totalItems.toString();
        subtotalPriceElement.textContent = `${total.toLocaleString('vi-VN')}đ`;

        // Hiển thị/ẩn thông báo giỏ hàng trống
        const emptyCartMessage = document.querySelector('.empty-cart-message');
        if (emptyCartMessage) {
            emptyCartMessage.style.display = cart.length === 0 ? 'block' : 'none';
        }

    } catch (error) {
        console.error("Error displaying cart:", error);
    }
}

// Cập nhật số lượng sản phẩm
function updateQuantity(productId, newQuantity) {
    let cart = getCart();
    const index = cart.findIndex(item => item.id === productId);
    
    if (index !== -1) {
        newQuantity = parseInt(newQuantity);
        if (newQuantity < 1) newQuantity = 1;
        cart[index].quantity = newQuantity;
        saveCart(cart);
        displayCart();
    }
}

// Tăng số lượng sản phẩm
function increaseQuantity(productId) {
    let cart = getCart();
    const index = cart.findIndex(item => item.id === productId);
    if (index !== -1) {
        cart[index].quantity++;
        saveCart(cart);
        displayCart();
    }
}

// Giảm số lượng sản phẩm
function decreaseQuantity(productId) {
    let cart = getCart();
    const index = cart.findIndex(item => item.id === productId);
    if (index !== -1 && cart[index].quantity > 1) {
        cart[index].quantity--;
        saveCart(cart);
        displayCart();
    }
}

// Xóa sản phẩm khỏi giỏ hàng
function removeItem(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    displayCart();
}

// Xóa toàn bộ giỏ hàng
function clearCart() {
    localStorage.removeItem('cart');
    displayCart();
}

// Chuyển đến trang thanh toán
function proceedToCheckout() {
    const cart = getCart();
    if (cart.length === 0) {
        alert('Giỏ hàng của bạn đang trống!');
        return;
    }
    window.location.href = '/html-delivery/delivery.html';
}

// Khởi tạo khi trang được load
document.addEventListener('DOMContentLoaded', () => {
    displayCart();

    // Thêm event listener cho nút thanh toán
    const checkoutButton = document.querySelector('.cart-content-right-button button:last-child');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', proceedToCheckout);
    }
});

// Đặt các hàm vào window object để có thể gọi từ HTML
window.updateQuantity = updateQuantity;
window.increaseQuantity = increaseQuantity;
window.decreaseQuantity = decreaseQuantity;
window.removeItem = removeItem;
window.clearCart = clearCart;
window.proceedToCheckout = proceedToCheckout;