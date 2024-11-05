// product-detail.js

// Lấy ID sản phẩm từ URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

// Hiển thị chi tiết sản phẩm
async function loadProductDetail() {
    try {
        const db = firebase.firestore();
        const doc = await db.collection("product").doc("sach").collection("comic").doc(productId).get();
        
        if (doc.exists) {
            const product = doc.data();
            
            // Cập nhật thông tin sản phẩm trong HTML
            document.getElementById('product-image').src = product.imageURL;
            document.getElementById('product-name').textContent = product.name;
            document.getElementById('product-price').textContent = 
                `${product.price.toLocaleString('vi-VN')}đ`;
            document.getElementById('product-description').textContent = 
                product.description || 'Không có mô tả';
        } else {
            console.log("Không tìm thấy sản phẩm!");
        }
    } catch (error) {
        console.error("Error loading product detail: ", error);
    }
}

// Xử lý số lượng
function increaseQuantity() {
    const quantityInput = document.getElementById('quantity');
    quantityInput.value = parseInt(quantityInput.value) + 1;
}

function decreaseQuantity() {
    const quantityInput = document.getElementById('quantity');
    if (parseInt(quantityInput.value) > 1) {
        quantityInput.value = parseInt(quantityInput.value) - 1;
    }
}

// Xử lý mua hàng
function buyNow() {
    const quantity = document.getElementById('quantity').value;
    // Chuyển đến trang thanh toán với thông tin sản phẩm
    window.location.href = `/checkout.html?id=${productId}&quantity=${quantity}`;
}

function addToCart() {
    const quantity = document.getElementById('quantity').value;
    // Thêm vào giỏ hàng (có thể lưu trong localStorage hoặc database)
    // ... code xử lý thêm vào giỏ hàng
    alert('Đã thêm vào giỏ hàng!');
}

// Load chi tiết sản phẩm khi trang được tải
document.addEventListener('DOMContentLoaded', loadProductDetail);