import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
    import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

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

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const emailOptions = document.getElementById('emailOptions');
    const tableBody = document.querySelector('tbody');

    async function loadEmails() {
        const usersRef = collection(db, 'user');
        const snapshot = await getDocs(usersRef);
        emailOptions.innerHTML = '<option value="">-- Chọn email --</option>';

        snapshot.forEach(doc => {
            const user = doc.data();
            if (user.useremail) {
                const option = document.createElement('option');
                option.value = user.useremail;
                option.textContent = user.useremail;
                emailOptions.appendChild(option);
            }
        });
    }

    async function loadOrders(userEmail) {
        if (!userEmail) {
            tableBody.innerHTML = '<tr><td colspan="6">Vui lòng chọn email để xem đơn hàng</td></tr>';
            return;
        }

        const ordersRef = collection(db, 'orders');
        const q = query(ordersRef, where('useremail', '==', userEmail));
        const snapshot = await getDocs(q);

        tableBody.innerHTML = '';
        if (snapshot.empty) {
            tableBody.innerHTML = '<tr><td colspan="6">Không có đơn hàng nào cho email này</td></tr>';
            return;
        }

        snapshot.forEach(doc => {
            const order = doc.data();
            const row = document.createElement('tr');
            row.innerHTML = ` 
                <td>${doc.id}</td>
                <td>${order.useremail}</td>
                <td>${order.items ? order.items[0].name : 'N/A'}</td>
                <td>${order.items ? order.items[0].quantity : 'N/A'}</td>
                <td>${order.items ? order.items[0].price : 'N/A'}</td>
                <td>${order.status ? order.status : 'N/A'}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    emailOptions.addEventListener('change', (e) => {
        loadOrders(e.target.value);
    });

    loadEmails();