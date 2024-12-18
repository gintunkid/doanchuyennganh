// Product.js
import { db } from './firebase-config.js';
export { addProducts, displayProducts, viewProductDetail, getProductDetail, searchProductsByName, displaySearchResults };

// Hàm upload ảnh và lấy URL
async function uploadImageAndGetURL(imageFile, categories, subCategories, imageName) {
    const storage = firebase.storage();
    const storageRef = storage.ref(`image/${categories}/${subCategories}/${imageName}`);
    
    await storageRef.put(imageFile);
    const downloadURL = await storageRef.getDownloadURL();
    return downloadURL;
}

// Thêm sản phẩm vào Firebase
async function addProducts(categories, subCategories, products) {
    try {
        const db = firebase.firestore();
        for (const product of products) {
            // Lấy file ảnh từ URL
            const imageResponse = await fetch(product.imageURL);
            const imageBlob = await imageResponse.blob();
            const imageName = `${Date.now()}_${product.imageURL.split('/').pop()}`;
            
            // Tải ảnh lên Storage và lấy URL
            const imageUrl = await uploadImageAndGetURL(imageBlob, categories, subCategories, imageName);
            
            // Thêm sản phẩm vào Firestore với URL ảnh mới
            await db.collection("product").doc(categories).collection(subCategories).add({
                ...product,
                imageURL: imageUrl,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
        console.log(`Products added successfully to ${categories}/${subCategories}!`);
    } catch (error) {
        console.error("Error adding products: ", error);
    }
}

// Lấy và hiển thị sản phẩm cho một categories và subCategories cụ thể
async function displayProducts(categories, subCategories) {
    try {
        const db = firebase.firestore();
        const productsRef = db.collection("product").doc(categories).collection(subCategories);
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
                <div class="cartegory-right-content-item" onclick="viewProductDetail('${productId}', '${categories}', '${subCategories}')">
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

// Tìm kiếm sản phẩm theo tên qua nhiều categories và subCategories
async function searchProductsByName(categories, subCategories, searchTerm) {
    if (!categories || !subCategories || !searchTerm) {
        console.error("Invalid parameters for searchProductsByName:", { categories, subCategories, searchTerm });
        return [];
    }

    try {
        const db = firebase.firestore();
        const results = [];

        // Lặp qua tất cả các categories và subCategories để tìm kiếm
        for (const category of categories) {
            for (const subCategory of subCategories) {
                const productsRef = db.collection("product").doc(category).collection(subCategory);
                const snapshot = await productsRef.get();

                const filteredProducts = snapshot.docs
                    .map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                        category, // Ghi lại category
                        subCategory // Ghi lại subCategory
                    }))
                    .filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()));

                results.push(...filteredProducts);
            }
        }

        return results;
    } catch (error) {
        console.error("Error searching products: ", error);
        return [];
    }
}

// Hiển thị kết quả tìm kiếm
function displaySearchResults(products) {
    const container = document.querySelector('.cartegory-right-content');
    if (!container) {
        console.error("Container element not found");
        return;
    }
    container.innerHTML = '';

    if (products.length === 0) {
        container.innerHTML = '<p>Không tìm thấy sản phẩm nào.</p>';
        return;
    }

    products.forEach(product => {
        const priceFormatted = (typeof product.price === 'number' && !isNaN(product.price))
            ? product.price.toLocaleString('vi-VN')
            : 'Giá không xác định';

        const productHTML = `
            <div class="cartegory-right-content-item" onclick="viewProductDetail('${product.id}', '${product.category}', '${product.subCategory}')">  
                <img src="${product.imageURL}" alt="${product.name}">
                <h1>${product.name}</h1>
                <p>${priceFormatted}<sup>đ</sup></p>
            </div>
        `;
        container.innerHTML += productHTML;
    });
}

// Xử lý sự kiện tìm kiếm
document.getElementById('searchButton').addEventListener('click', async () => {
    const searchTerm = document.getElementById('searchInput').value.trim();
    const categories = ['sach', 'dochoi', 'vpp']; // Thay thế với categories hiện tại
    const subCategories = [
        'comic', 'sachngoaingu', 'tamlikinangsong', 'giaoduc',
        'mohinh', 'butviet', 'dungcuvanphong', 'sanphamgiay'
    ]; // Thay thế với sub-categories hiện tại

    if (searchTerm) {
        const products = await searchProductsByName(categories, subCategories, searchTerm);
        displaySearchResults(products);
    } else {
        alert('Vui lòng nhập từ khóa tìm kiếm!');
    }
});


// Hàm để xử lý việc chuyển trang đến chi tiết sản phẩm
function viewProductDetail(productId, categories, subCategories) {
    window.location.href = `product-detail.html?id=${productId}&categories=${categories}&subCategories=${subCategories}`;
}

// Hàm lấy chi tiết sản phẩm
async function getProductDetail(productId, categories, subCategories) {
    try {
        // Kiểm tra các tham số đầu vào
        if (!productId || !categories || !subCategories) {
            console.error('Missing parameters:', { productId, categories, subCategories });
            return null;
        }

        const db = firebase.firestore();
        const productDoc = await db.collection("product")
                                 .doc(categories)
                                 .collection(subCategories)
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

// Hàm lọc sản phẩm theo giá
async function filterProductsByPrice(categories, subCategories, minPrice, maxPrice) {
    try {
        const db = firebase.firestore();
        const snapshot = await db.collection("product")
                               .doc(categories)
                               .collection(subCategories)
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
async function sortProducts(categories, subCategories, field, direction = 'asc') {
    try {
        const db = firebase.firestore();
        const snapshot = await db.collection("product")
                               .doc(categories)
                               .collection(subCategories)
                               .orderBy(field, direction)
                               .get();

        return snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    } catch (error) {
        console.error("Error sorting products: ", error);
        return [];
    }
}

// Hàm cập nhật sản phẩm
async function updateProduct(categories, subCategories, productId, updateData) {
    try {
        const db = firebase.firestore();
        await db.collection("product")
               .doc(categories)
               .collection(subCategories)
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
async function deleteProduct(categories, subCategories, productId) {
    try {
        const db = firebase.firestore();
        await db.collection("product")
               .doc(categories)
               .collection(subCategories)
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
