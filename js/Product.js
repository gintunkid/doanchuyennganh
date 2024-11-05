// Product.js
import { db } from './firebase-config.js';
export { addProducts, displayProducts,viewProductDetail };

// Thêm sản phẩm vào Firebase
async function uploadImageAndGetURL(imageFile, imageName) {
    const storage = firebase.storage();
    const storageRef = storage.ref('images/' + imageName);
    
    await storageRef.put(imageFile);
    const downloadURL = await storageRef.getDownloadURL();
    return downloadURL;
}
// Thêm sản phẩm vào Firebase
async function addProducts() {
    try {
        const db = firebase.firestore();
        for (const product of sampleProducts) {
            // Lấy file ảnh từ URL (Lưu ý: Đây chỉ là ví dụ, trong thực tế bạn cần có cách khác để lấy file ảnh)
            const imageResponse = await fetch(product.imageUrl);
            const imageBlob = await imageResponse.blob();
            const imageName = product.imageUrl.split('/').pop();
            
            // Tải ảnh lên Storage và lấy URL
            const imageUrl = await uploadImageAndGetURL(imageBlob, imageName);
            
            // Thêm sản phẩm vào Firestore với URL ảnh mới
            await db.collection("product").doc("sach").collection("comic").add({
                ...product,
                imageUrl: imageUrl, // Sử dụng URL mới từ Storage
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
        console.log("Products added successfully!");
    } catch (error) {
        console.error("Error adding products: ", error);
    }
}


// Lấy và hiển thị sản phẩm
// Trong hàm displayProducts, sửa lại phần tạo HTML:
async function displayProducts() {
    try {
        const db = firebase.firestore();
        const snapshot = await db.collection("product").doc("sach").collection("comic").get();
        const container = document.querySelector('.cartegory-right-content');
        container.innerHTML = '';

        snapshot.forEach((doc) => {
            const product = doc.data();
            const productId = doc.id; // Lấy ID của sản phẩm


            const priceFormatted = (typeof product.price === 'number' && !isNaN(product.price))
                ? product.price.toLocaleString('vi-VN')
                : 'Giá không xác định';

            const productHTML = `
                <div class="cartegory-right-content-item" onclick="viewProductDetail('${productId}')">
                    <img src="${product.imageURL}" >
                    <h1>${product.name}</h1>
                    <p>${priceFormatted}<sup>đ</sup></p>
                </div>
            `;
            container.innerHTML += productHTML;
        });
    } catch (error) {
        console.error("Error getting products: ", error);
    }
}

// Thêm hàm để xử lý việc chuyển trang
function viewProductDetail(productId) {
    window.location.href = `../html-cartegory/product-detail.html?id=${productId}`;
}