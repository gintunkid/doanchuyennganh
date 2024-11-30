import { db } from "../js/firebase-config";

// Hàm tìm kiếm sản phẩm theo tên trong các collection con
async function searchProductsByNameInNestedCollections(keyword) {
    try {
        const productDocs = await db.collection("product").get();
        const results = [];

        for (const productDoc of productDocs.docs) {
            const subcollections = await productDoc.ref.listCollections();

            for (const subcollection of subcollections) {
                const subcollectionDocs = await subcollection.get();

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
        window.location.href = "../html-cartegory/search.html";

    } catch (error) {
        console.error("Lỗi khi tìm kiếm sản phẩm:", error);
    }
}

// Lắng nghe sự kiện tìm kiếm khi người dùng nhập từ khóa
document.querySelector(".fas.fa-search").addEventListener("click", () => {
    const keyword = document.querySelector('input[type="text"]').value;
    searchProductsByNameInNestedCollections(keyword);
});
