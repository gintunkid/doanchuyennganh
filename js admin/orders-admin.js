import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, where, updateDoc, doc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

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

// Function to fetch orders for the current user
async function fetchUserOrders(userEmail) {
    const ordersCollection = collection(db, "orders");
    const q = query(ordersCollection, where("useremail", "==", userEmail)); // Assuming you store userId in orders
    const ordersSnapshot = await getDocs(q);
    const ordersList = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Display orders in the container
    const ordersContainer = document.querySelector('.container-orders');
    ordersContainer.innerHTML = ""; // Clear existing orders

    if (ordersList.length === 0) {
        ordersContainer.innerHTML = "<p>Không có đơn hàng nào.</p>";
        return;
    }

    ordersList.forEach(order => {
        const orderDiv = document.createElement('div');
        orderDiv.classList.add('order');

        // Hàm tạo dropdown cho trạng thái
        const createStatusDropdown = (status) => {
            const statuses = ["Đang chờ tiếp nhận", "Đang xử lý", "Đang giao hàng", "Đã giao thành công","Đã hủy"];
            return `
                <select class="status-dropdown" data-order-id="${order.id}">
                    ${statuses.map(option => `
                        <option value="${option}" ${option === status ? "selected" : ""}>
                            ${option}
                        </option>
                    `).join('')}
                </select>
            `;
        };

        orderDiv.innerHTML = `
            <div class="order-header">
                <h2>ID Đơn hàng: ${order.id}</h2>
                <span class="status">${order.status || 'Đang xử lý'}</span>
            </div>
            <div class="customer-info">
                <p><strong>Họ và tên:</strong> ${order.fullName || 'Chưa cập nhật'}</p>
                <p><strong>Số điện thoại:</strong> ${order.phone || 'Chưa cập nhật'}</p>
                <p><strong>Địa chỉ:</strong> ${order.address || 'Chưa cập nhật'}</p>
                <p><strong>Phường/Xã/Thị trấn:</strong> ${order.ward ||'Chưa cập nhật'}</p>
                <p><strong>Quận:</strong> ${order.district || 'Chưa cập nhật'}</p>
                <p><strong>Tỉnh:</strong> ${order.province || 'Chưa cập nhật'}</p>
                <p><strong>Phương thức thanh toán:</strong> ${order.payment}</p>
            </div>
            <div class="product-list">
                ${order.items.map(item => `
                    <div class="product">
                        <span>${item.name || 'Không xác định'}</span>
                        <span>Số lượng: ${item.quantity || 0}</span>
                        <span>Thành tiền: ${item.subtotal || 0} đ</span>
                    </div>
                `).join('')}
            </div>
            <div class="total">Tổng tiền: ${order.total || 0} đ</div>
            <div class="order-status">
                ${createStatusDropdown(order.status)}
            </div>
        `;

        ordersContainer.appendChild(orderDiv);
    });

    // Add event listener to update status when dropdown changes
    const statusDropdowns = document.querySelectorAll('.status-dropdown');
    statusDropdowns.forEach(dropdown => {
        dropdown.addEventListener('change', async (event) => {
            const orderId = event.target.getAttribute('data-order-id');
            const newStatus = event.target.value;

            // Update status in Firestore
            const orderRef = doc(db, "orders", orderId);
            await updateDoc(orderRef, {
                status: newStatus
            });

            // Optionally, update the status in the DOM
            const statusElement = event.target.closest('.order').querySelector('.status');
            statusElement.textContent = newStatus;
        });
    });
}

// Lắng nghe sự kiện thay đổi của dropdown email
document.getElementById('emailOptions').addEventListener('change', (event) => {
    const selectedEmail = event.target.value;
    if (selectedEmail) {
        fetchUserOrders(selectedEmail); // Fetch orders for selected email
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
        option.value = user.email; // Assuming you have the email field in the user
        option.textContent = user.email;
        emailSelect.appendChild(option);
    });
}

// Gọi hàm để tải danh sách email khi trang được tải
loadEmails();
