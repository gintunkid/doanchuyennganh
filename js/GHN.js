// Cấu hình Firebase từ Firebase Console
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
  // Khởi tạo Firebase
  const app = firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  function submitForm() {
    // Lấy thông tin từ các input
    const fullName = document.getElementById("fullName").value;
    const phone = document.getElementById("phone").value;
    const province = document.getElementById("provinceDropdown").value;
    const district = document.getElementById("districtDropdown").value;
    const address = document.getElementById("addressInput").value;

    // Kiểm tra xem tất cả các trường đã được nhập hay chưa
    if (!fullName || !phone || !province || !district || !address) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    // Lưu thông tin vào Firestore
    saveAddressToFirestore(fullName, phone, province, district, address);
}

async function saveAddressToFirestore(fullName, phone, province, district, address) {
    // Lấy thông tin người dùng, ví dụ từ Firebase Authentication (nếu có)
    const userID = "user123";  // Thay thế bằng ID người dùng thực tế (dùng Firebase Auth)

    try {
        const addressRef = db.collection('addresses').doc();  // Tạo một document mới trong collection "addresses"
        
        await addressRef.set({
            user_id: userID,
            full_name: fullName,
            phone: phone,
            address: address,
            district: district,
            province: province,
            created_at: firebase.firestore.FieldValue.serverTimestamp()  // Thêm thời gian tạo
        });

        alert("Địa chỉ đã được lưu thành công!");
    } catch (error) {
        console.error("Lỗi khi lưu địa chỉ:", error);
        alert("Có lỗi xảy ra. Vui lòng thử lại.");
    }
}
