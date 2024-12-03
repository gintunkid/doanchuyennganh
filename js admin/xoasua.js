import { initializeApp } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";
import { getFirestore, doc, getDoc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBzjS1Zf-rh1txM7KtoiGm5LkdDaWzTh-U",
    authDomain: "store-music-fae02.firebaseapp.com",
    projectId: "store-music-fae02",
    storageBucket: "store-music-fae02.appspot.com",
    messagingSenderId: "35440000355",
    appId: "1:35440000355:web:8a266ed1a96e7c2f812756"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Lấy ID sản phẩm từ URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id'); // ID sản phẩm được truyền qua URL
const category = urlParams.get('category'); // Lấy category từ URL (ví dụ: 'sach' hoặc 'comic')

// Hàm để tải thông tin sản phẩm
async function loadProductDetail() {
    const docRef = doc(db, `product/sach/${category}`, productId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
        const product = docSnap.data();
        document.getElementById('productId').value = docSnap.id;
        document.getElementById('name').value = product.name;
        document.getElementById('description').value = product.description;
        document.getElementById('price').value = product.price;
        document.getElementById('imageURL').value = product.imageURL;
    } else {
        console.log("Không tìm thấy sản phẩm");
    }
}

// Hàm để xóa sản phẩm
async function deleteProduct() {
    const docRef = doc(db, `product/sach/${category}`, productId);
    await deleteDoc(docRef);
    alert("Sản phẩm đã được xóa");
    window.location.href = 'admin_selecttoadd.html'; // Chuyển hướng về trang danh sách sản phẩm
}

// Hàm để cập nhật sản phẩm
async function updateProduct(event) {
    event.preventDefault();
    const productData = {
        name: document.getElementById('name').value,
        description: document.getElementById('description').value,
        price: parseFloat(document.getElementById('price').value),
        imageURL: document.getElementById('imageURL').value
    };

    const docRef = doc(db, `product/sach/${category}`, productId);
    await updateDoc(docRef, productData);
    alert("Sản phẩm đã được cập nhật");
    window.location.href = 'admin_selecttoadd.html'; // Chuyển hướng về trang danh sách sản phẩm
}

// Gán sự kiện cho nút xóa
document.getElementById('deleteButton').addEventListener('click', deleteProduct);

// Gán sự kiện cho form khi được gửi
document.getElementById('productForm').addEventListener('submit', updateProduct);

// Tải thông tin sản phẩm khi trang được tải
loadProductDetail();