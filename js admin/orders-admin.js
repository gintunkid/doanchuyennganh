import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

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

// Hàm để lấy danh sách đơn hàng theo email
async function getOrdersByEmail(email) {
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, where("useremail", "==", email));
    const snapshot = await getDocs(q);
    
    const ordersTableBody = document.querySelector('.recentOrders table tbody');
    ordersTableBody.innerHTML = ''; // Xóa nội dung cũ

    snapshot.forEach((doc) => {
        const order = doc.data();
        
        // Giả sử order.items là một mảng chứa thông tin sản phẩm
        order.items.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${order.orderId}</td>
                <td>${order.useremail}</td>
                <td>${item.name}</td> <!-- Tên sản phẩm -->
                <td>${item.quantity}</td> <!-- Số lượng -->
                <td>${item.subtotal} đ</td> <!-- Thành tiền -->
                <td>${order.status || 'Đang xử lý'}</td> <!-- Trạng thái -->
            `;
            ordersTableBody.appendChild(row);
        });
    });
}

// Lắng nghe sự kiện thay đổi của dropdown
document.getElementById('emailOptions').addEventListener('change', (event) => {
    const selectedEmail = event.target.value;
    if (selectedEmail) {
        getOrdersByEmail(selectedEmail);
    }
});

// Hàm để lấy danh sách email từ Firestore (nếu cần)
async function loadEmails() {
    const usersRef = collection(db, "user");
    const snapshot = await getDocs(usersRef);
    const emailSelect = document.getElementById('emailOptions');

    snapshot.forEach((doc) => {
        const user = doc.data();
        const option = document.createElement('option');
        option.value = user.email; // Giả sử bạn có trường email trong user
        option.textContent = user.email;
        emailSelect.appendChild(option);
    });
}

// Gọi hàm để tải danh sách email khi trang được tải
loadEmails();