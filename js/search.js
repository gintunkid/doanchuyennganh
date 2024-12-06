import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";

// Cấu hình Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBzjS1Zf-rh1txM7KtoiGm5LkdDaWzTh-U",
    authDomain: "store-music-fae02.firebaseapp.com",
    databaseURL: "https://store-music-fae02-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "store-music-fae02",
    storageBucket: "store-music-fae02.appspot.com",
    messagingSenderId: "35440000355",
    appId: "1:35440000355:web:8a266ed1a96e7c2f812756",
    measurementId: "G-4MEMTBYYMT"
};

// Khởi tạo Firebase và Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Hàm tìm kiếm sản phẩm theo tên trong các collection con
async function searchProductsByNameInNestedCollections(keyword) {
    try {
        const productCollectionRef = collection(db, "product");
        const productDocs = await getDocs(productCollectionRef); // Lấy tất cả các sản phẩm trong collection "product"
        const results = [];

        // Duyệt qua từng document trong collection 'product'
        for (const productDoc of productDocs.docs) {
            const subcollections = await productDoc.ref.listCollections(); // Lấy tất cả các sub-collection

            // Duyệt qua từng sub-collection
            for (const subcollection of subcollections) {
                const subcollectionDocs = await getDocs(subcollection); // Lấy các document từ sub-collection

                // Tìm kiếm từ khóa trong các document của sub-collection
                subcollectionDocs.forEach((doc) => {
                    const data = doc.data();
                    if (data.name && data.name.toLowerCase().includes(keyword.toLowerCase())) {
                        results.push({
                            id: doc.id,
                            ...data,
                            parentDocId: productDoc.id,
                            subcollectionName: subcollection.id
                        });
                    }
                });
            }
        }

        // Lưu kết quả vào sessionStorage
        sessionStorage.setItem("searchResults", JSON.stringify(results));

        // Chuyển hướng đến trang search.html
        window.location.href = "/html-cartegory/search.html";

    } catch (error) {
        console.error("Lỗi khi tìm kiếm sản phẩm:", error);
    }
}

// Lắng nghe sự kiện khi nhấn vào biểu tượng tìm kiếm
document.querySelector(".fas.fa-search").addEventListener("click", () => {
    const keyword = document.querySelector('input[type="text"]').value.trim(); // Lấy giá trị tìm kiếm từ input
    if (keyword) {
        searchProductsByNameInNestedCollections(keyword); // Gọi hàm tìm kiếm
    } else {
        alert("Vui lòng nhập từ khóa tìm kiếm!"); // Hiển thị cảnh báo nếu không có từ khóa tìm kiếm
    }
});

// Lắng nghe sự kiện khi nhấn Enter
document.querySelector("#searchInput").addEventListener("keypress", (e) => {
    if (e.key === 'Enter') {
        const keyword = document.querySelector('input[type="text"]').value.trim();
        if (keyword) {
            searchProductsByNameInNestedCollections(keyword);
        } else {
            alert("Vui lòng nhập từ khóa tìm kiếm!");
        }
    }
});
