// Product.js
import { db } from './firebase-config.js';
export { addProducts, displayProducts, viewProductDetail };

// Hàm upload ảnh và lấy URL
async function uploadImageAndGetURL(imageFile, imageName) {
    const storage = firebase.storage();
    const storageRef = storage.ref('images/' + imageName);
    
    await storageRef.put(imageFile);
    const downloadURL = await storageRef.getDownloadURL();
    return downloadURL;
}

// Thêm sản phẩm vào Firebase
async function addProducts(collectionName, products) {
    try {
        const db = firebase.firestore();
        for (const product of products) {
            // Lấy file ảnh từ URL (Lưu ý: Đây chỉ là ví dụ, trong thực tế bạn cần có cách khác để lấy file ảnh)
            const imageResponse = await fetch(product.imageUrl);
            const imageBlob = await imageResponse.blob();
            const imageName = product.imageUrl.split('/').pop();
            
            // Tải ảnh lên Storage và lấy URL
            const imageUrl = await uploadImageAndGetURL(imageBlob, imageName);
            
            // Thêm sản phẩm vào Firestore với URL ảnh mới
            await db.collection("product").doc("sach").collection(collectionName).add({
                ...product,
                imageUrl: imageUrl, // Sử dụng URL mới từ Storage
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
        console.log(`Products added successfully to ${collectionName}!`);
    } catch (error) {
        console.error("Error adding products: ", error);
    }
}

// Lấy và hiển thị sản phẩm
async function displayProducts(collectionName) {
    try {
        const db = firebase.firestore();
        const snapshot = await db.collection("product")
                               .doc("sach")
                               .collection(collectionName)
                               .get();

        const container = document.querySelector('.cartegory-right-content');
        container.innerHTML = '';

        snapshot.forEach((doc) => {
            const product = doc.data();
            const productId = doc.id;

            const priceFormatted = (typeof product.price === 'number' && !isNaN(product.price))
                ? product.price.toLocaleString('vi-VN')
                : 'Giá không xác định';

            const productHTML = `
                <div class="cartegory-right-content-item" onclick="viewProductDetail('${productId}', '${collectionName}')">
                    <img src="${product.imageURL}" alt="${product.name}">
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

// Hàm để xử lý việc chuyển trang đến chi tiết sản phẩm
function viewProductDetail(productId, collectionName) {
    window.location.href = `../html-cartegory/product-detail.html?id=${productId}&collection=${collectionName}`;
}

// Hàm lấy chi tiết sản phẩm (có thể được sử dụng trong trang chi tiết sản phẩm)
async function getProductDetail(productId, collectionName) {
    try {
        const db = firebase.firestore();
        const productDoc = await db.collection("product")
                                 .doc("sach")
                                 .collection(collectionName)
                                 .doc(productId)
                                 .get();

        if (productDoc.exists) {
            return productDoc.data();
        } else {
            console.log("Không tìm thấy sản phẩm!");
            return null;
        }
    } catch (error) {
        console.error("Error getting product detail: ", error);
        return null;
    }
}

// Hàm tìm kiếm sản phẩm (có thể được sử dụng cho chức năng tìm kiếm)
async function searchProducts(query, collectionName) {
    try {
        const db = firebase.firestore();
        const snapshot = await db.collection("product")
                               .doc("sach")
                               .collection(collectionName)
                               .where("name", ">=", query)
                               .where("name", "<=", query + '\uf8ff')
                               .get();

        return snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    } catch (error) {
        console.error("Error searching products: ", error);
        return [];
    }
}

// Xuất thêm các hàm mới nếu cần
export { getProductDetail, searchProducts };