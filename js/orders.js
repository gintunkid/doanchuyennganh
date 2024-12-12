 // Import Firebase modules
 import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
 import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
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
 const auth = getAuth(app);
 //Hello
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
         orderDiv.innerHTML = `
             <div class="order-header">
                 <h2>ID Đơn hàng: ${order.id}</h2>
                 <span class="status">${order.status || 'Đang xử lý'}</span>
             </div>
             <div class="customer-info" style="float:left,display:absolute">
                 <p><strong>Họ và tên:</strong> ${order.fullName || 'Chưa cập nhật'}</p>
                 <p><strong>Số điện thoại:</strong> ${order.phone || 'Chưa cập nhật'}</p>
                 <p><strong>Địa chỉ:</strong> ${order.address || 'Chưa cập nhật'}</p>
                 <p><strong>Quận:</strong> ${order.district || 'Chưa cập nhật'}</p>
                 <p><strong>Tỉnh:</strong> ${order.province || 'Chưa cập nhật'}</p>
                 <p><strong>Phương thức thanh toán:</strong> ${order.payment}</p>
             </div>
             <div class="product-list">
                 ${order.items.map(item => `
                     <div class="product">
                         <span>${item.name}</span>
                         <span>Số lượng: ${item.quantity}</span>
                         <span>Thành tiền: ${item.subtotal} đ</span>
                     </div>
                 `).join('')}
             </div>
             <div class="total">Tổng tiền: ${order.total} đ</div>
         `;
         ordersContainer.appendChild(orderDiv);
     });        
 }

// Hàm hủy đơn hàng
async function cancelOrder(orderId) {
 try {
     // Lấy tài liệu đơn hàng cần hủy từ Firestore
     const orderDocRef = doc(db, "orders", orderId);
     
     // Cập nhật trạng thái đơn hàng thành "Đã hủy"
     await updateDoc(orderDocRef, {
         status: "Đã hủy"
     });

     console.log("Đơn hàng đã được hủy");
     alert("Đơn hàng đã được hủy thành công!");

     // Sau khi hủy, bạn có thể reload lại danh sách đơn hàng hoặc thực hiện thao tác khác.
     location.reload(); // Reload lại trang để cập nhật trạng thái mới
 } catch (e) {
     console.error("Lỗi khi hủy đơn hàng: ", e);
     alert("Có lỗi xảy ra. Vui lòng thử lại.");
 }
}


 // Call the fetchUser Orders function when the user is authenticated
 onAuthStateChanged(auth, (user) => {
     if (user) {
         const userEmail = user.email; // Get the current user's ID
         fetchUserOrders(userEmail); // Fetch orders for the current user
     } else {
         console.log("Người dùng chưa đăng nhập.");
         // Optionally, you can redirect to login page or show a message
     }
 });