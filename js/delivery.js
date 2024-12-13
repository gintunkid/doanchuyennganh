// delivery.js

// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getFirestore, doc, getDoc, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBzjS1Zf-rh1txM7KtoiGm5LkdDaWzTh-U",
    authDomain: "store-music-fae02.firebaseapp.com",
    projectId: "store-music-fae02",
    storageBucket: "store-music-fae02.appspot.com",
    messagingSenderId: "35440000355",
    appId: "1:35440000355:web:8a266ed1a96e7c2f812756",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Hàm để lấy thông tin sản phẩm từ Firestore
async function getProductById(productId) {
    const collections = [
        'product/sach/comic',
        'product/sach/sachngoaingu',
        'product/sach/tamlikinangsong',
        'product/vpp/dungcuvanphong',
        'product/vpp/butviet',
        'product/vpp/sanphamgiay',
        'product/dochoi/giaoduc',
        'product/dochoi/mohinh',
    ];

    for (const collectionPath of collections) {
        const docRef = doc(db, collectionPath, productId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            return docSnap.data(); // Trả về dữ liệu sản phẩm
        }
    }

    console.log("Không tìm thấy sản phẩm");
    return null; // Trả về null nếu không tìm thấy
}

// Hàm để tính phí ship
function calculateShippingFee(district) {
    const shippingFees = {
        "Quận 1": 20000,
        "Quận 2": 40000,
        "Quận 3": 0, // Quận 3 đến Quận 3 thì không tính phí
        "Quận 4": 25000,
        "Quận 5": 25000,
        "Quận 6": 30000,
        "Quận 7": 30000,
        "Quận 8": 30000,
        "Quận 9": 40000,
        "Quận 10": 25000,
        "Quận 11": 25000,
        "Quận 12": 35000,
        "Quận Phú Nhuận":30000,
        "Quận Bình Thạnh":30000,
        "Quận Tân Bình":30000,
        "Quận Bình Tân":35000,
        "Quận Thủ Đức":40000,
        "Quận Gò Vấp":35000,
        "Huyện Bình Chánh":40000,
        "Huyện Nhà Bè":40000,
        "Huyện Cần Giờ":50000,
        "Huyện Củ Chi":50000,
        "Huyện Cần Giờ":50000,
    };

    return shippingFees[district] || 0; // Trả về 0 nếu quận không có trong danh sách
}

// Hàm để hiển thị giỏ hàng trong delivery.html
async function displayCartInDelivery() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const deliveryContentRight = document.querySelector('.delivery-content-right');

    // Xóa nội dung cũ
    deliveryContentRight.innerHTML = '';

    // Tạo bảng để hiển thị giỏ hàng
    const table = document.createElement('table');
    table.id = "cart-table"; // Đặt ID cho bảng
    table.innerHTML = `
        <tr>
            <th>Tên sản phẩm</th>
            <th>Số lượng</th>
            <th>Thành tiền</th>
        </tr>
    `;

    let total = 0;

    for (const item of cart) {
        const product = await getProductById(item.id); // Gọi hàm lấy thông tin sản phẩm
        if (product) {
            const subtotal = product.price * item.quantity;
            total += subtotal;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.name}</td>
                <td>${item.quantity}</td>
                <td>${subtotal.toLocaleString('vi-VN')}đ</td>
            `;
            table.appendChild(row);
        }
    }

    // Thêm tổng tiền vào bảng
    const totalRow = document.createElement('tr');
    totalRow.innerHTML = `
        <td style="font-weight: bold;" colspan="2">Tổng</td>
               <td style="font-weight: bold;">${total.toLocaleString('vi-VN')}đ</td>
    `;
    table.appendChild(totalRow);

    // Lấy quận từ dropdown
    const selectedDistrict = document.getElementById("districtDropdown").value;
    const shippingFee = calculateShippingFee(selectedDistrict);
    
    // Thêm phí ship vào bảng
    const shippingRow = document.createElement('tr');
    shippingRow.innerHTML = `
        <td style="font-weight: bold;" colspan="2">Phí ship</td>
        <td style="font-weight: bold;">${shippingFee.toLocaleString('vi-VN')}đ</td>
    `;
    table.appendChild(shippingRow);

    // Cập nhật tổng tiền bao gồm phí ship
    const grandTotal = total + shippingFee;
    const grandTotalRow = document.createElement('tr');
    grandTotalRow.innerHTML = `
        <td style="font-weight: bold;" colspan="2">Tổng cộng</td>
        <td style="font-weight: bold;">${grandTotal.toLocaleString('vi-VN')}đ</td>
    `;
    table.appendChild(grandTotalRow);

    // Thêm bảng vào giao diện
    deliveryContentRight.appendChild(table);
}

// Hàm để lưu đơn hàng vào Firestore
async function saveOrder(orderData) {
    try {
        const docRef = await addDoc(collection(db, "orders"), orderData);
        console.log("Đơn hàng đã được lưu với ID: ", docRef.id);
        alert("Bạn đã đặt hàng thành công !");
        window.location.href = "../home.html"; // Chuyển hướng về trang chủ (home)
    } catch (e) {
        console.error("Lỗi khi lưu đơn hàng: ", e);
        alert("Có lỗi xảy ra. Vui lòng thử lại.");
    }
}


// Hàm để xử lý khi người dùng nhấn nút thanh toán
async function submitOrder() {
    const fullName = document.getElementById("fullName").value;
    const phone = document.getElementById("phone").value;
    const province = document.getElementById("provinceDropdown").value;
    const district = document.getElementById("districtDropdown").value;
    const ward = document.getElementById("wardInput").value;
    const address = document.getElementById("addressInput").value;
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const user = firebase.auth().currentUser; // Lấy thông tin người dùng hiện tại
    const useremail = user ? user.email : null; // Lấy email của người dùng

    // Tính tổng tiền và tạo mảng items
    let total = 0;
    const items = []; // Mảng để lưu thông tin sản phẩm

    for (const item of cart) {
        const product = await getProductById(item.id); // Gọi hàm lấy thông tin sản phẩm
        if (product) {
            const subtotal = product.price * item.quantity;
            total += subtotal;

            // Thêm thông tin sản phẩm vào mảng items
            items.push({
                name: product.name, // Tên sản phẩm
                quantity: item.quantity, // Số lượng
                price: product.price, // Giá sản phẩm
                subtotal: subtotal, // Thành tiền
            });
        }
    }

    // Lấy phí ship
    const shippingFee = calculateShippingFee(district);
    const grandTotal = total + shippingFee; // Tổng tiền bao gồm phí ship

    // Tạo đối tượng đơn hàng
    const orderData = {
        useremail, 
        fullName,
        phone,
        province:"Thành phố Hồ Chí Minh",
        district,
        ward,
        address,
        items, // Lưu mảng items vào đơn hàng
        total: grandTotal, // Lưu tổng tiền
        shippingFee, // Lưu phí ship
        createdAt: new Date(), // Thêm thời gian tạo đơn hàng
        orderId: `ORDER-${Date.now()}`, // Tạo mã đơn hàng duy nhất
        status: "Đang chờ tiếp nhận", // Trạng thái mặc định
        payment: "Thanh toán khi nhận hàng"
    };

    // Gọi hàm lưu đơn hàng
    await saveOrder(orderData);
}


// Gán sự kiện cho nút thanh toán
document.querySelector('.delivery-content-left-button button:last-child').addEventListener('click', submitOrder);
document.getElementById('districtDropdown').addEventListener('change', function() {
        displayCartInDelivery(); // Cập nhật lại giỏ hàng khi quận thay đổi
    });
// Hiển thị giỏ hàng khi trang được tải
document.addEventListener('DOMContentLoaded', displayCartInDelivery);