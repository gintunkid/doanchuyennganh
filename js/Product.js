// Product.js
import { db } from './firebase-config.js';
export { addProducts, displayProducts, viewProductDetail, getProductDetail, searchProducts };

// Hàm upload ảnh và lấy URL
async function uploadImageAndGetURL(imageFile, category, subCategory, imageName) {
    const storage = firebase.storage();
    const storageRef = storage.ref(`image/${category}/${subCategory}/${imageName}`);
    
    await storageRef.put(imageFile);
    const downloadURL = await storageRef.getDownloadURL();
    return downloadURL;
}

// Thêm sản phẩm vào Firebase
async function addProducts(category, subCategory, products) {
    try {
        const db = firebase.firestore();
        for (const product of products) {
            // Lấy file ảnh từ URL
            const imageResponse = await fetch(product.imageURL);
            const imageBlob = await imageResponse.blob();
            const imageName = `${Date.now()}_${product.imageURL.split('/').pop()}`;
            
            // Tải ảnh lên Storage và lấy URL
            const imageUrl = await uploadImageAndGetURL(imageBlob, category, subCategory, imageName);
            
            // Thêm sản phẩm vào Firestore với URL ảnh mới
            await db.collection("product").doc(category).collection(subCategory).add({
                ...product,
                imageURL: imageUrl,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
        console.log(`Products added successfully to ${category}/${subCategory}!`);
    } catch (error) {
        console.error("Error adding products: ", error);
    }
}

// Lấy và hiển thị sản phẩm cho một category và sub-category cụ thể
async function displayProducts(category, subCategory) {
    try {
        const db = firebase.firestore();
        const productsRef = db.collection("product").doc(category).collection(subCategory);
        const snapshot = await productsRef.get();

        const container = document.querySelector('.cartegory-right-content');
        if (!container) {
            console.error("Container element not found");
            return;
        }
        container.innerHTML = '';

        snapshot.forEach((doc) => {
            const product = doc.data();
            const productId = doc.id;

            const priceFormatted = (typeof product.price === 'number' && !isNaN(product.price))
                ? product.price.toLocaleString('vi-VN')
                : 'Giá không xác định';

            const productHTML = `
                <div class="cartegory-right-content-item" onclick="viewProductDetail('${productId}', '${category}', '${subCategory}')">
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
function viewProductDetail(productId, category, subCategory) {
    window.location.href = `product-detail.html?id=${productId}&category=${category}&subCategory=${subCategory}`;
}

// Hàm lấy chi tiết sản phẩm
async function getProductDetail(productId, category, subCategory) {
    try {
        // Kiểm tra các tham số đầu vào
        if (!productId || !category || !subCategory) {
            console.error('Missing parameters:', { productId, category, subCategory });
            return null;
        }

        const db = firebase.firestore();
        const productDoc = await db.collection("product")
                                 .doc(category)
                                 .collection(subCategory)
                                 .doc(productId)
                                 .get();

        if (productDoc.exists) {
            return { id: productDoc.id, ...productDoc.data() };
        } else {
            console.log("Không tìm thấy sản phẩm!");
            return null;
        }
    } catch (error) {
        console.error("Error getting product detail: ", error);
        return null;
    }
}

// Hàm tìm kiếm sản phẩm
async function searchProducts(query, category, subCategory) {
    try {
        const db = firebase.firestore();
        const snapshot = await db.collection("product")
                               .doc(category)
                               .collection(subCategory)
                               .where("name", ">=", query)
                               .where("name", "<=", query + '\uf8ff')
                               .get();

        return snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    } catch (error) {
        console.error("Error searching products: ", error);
        return [];
    }
}

// Hàm lọc sản phẩm theo giá
async function filterProductsByPrice(category, subCategory, minPrice, maxPrice) {
    try {
        const db = firebase.firestore();
        const snapshot = await db.collection("product")
                               .doc(category)
                               .collection(subCategory)
                               .where("price", ">=", minPrice)
                               .where("price", "<=", maxPrice)
                               .get();

        return snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    } catch (error) {
        console.error("Error filtering products: ", error);
        return [];
    }
}

// Hàm sắp xếp sản phẩm
async function sortProducts(category, subCategory, field, direction = 'asc') {
    try {
        const db = firebase.firestore();
        const snapshot = await db.collection("product")
                               .doc(category)
                               .collection(subCategory)
                               .orderBy(field, direction)
                               .get();

        return snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    } catch (error) {
        console.error("Error sorting products: ", error);
        return [];
    }
}

// Hàm cập nhật sản phẩm
async function updateProduct(category, subCategory, productId, updateData) {
    try {
        const db = firebase.firestore();
        await db.collection("product")
               .doc(category)
               .collection(subCategory)
               .doc(productId)
               .update({
                   ...updateData,
                   updatedAt: firebase.firestore.FieldValue.serverTimestamp()
               });
        console.log("Product updated successfully!");
    } catch (error) {
        console.error("Error updating product: ", error);
    }
}

// Hàm xóa sản phẩm
async function deleteProduct(category, subCategory, productId) {
    try {
        const db = firebase.firestore();
        await db.collection("product")
               .doc(category)
               .collection(subCategory)
               .doc(productId)
               .delete();
        console.log("Product deleted successfully!");
    } catch (error) {
        console.error("Error deleting product: ", error);
    }
}

// Xuất thêm các hàm mới
export { 
    filterProductsByPrice, 
    sortProducts, 
    updateProduct, 
    deleteProduct 
};