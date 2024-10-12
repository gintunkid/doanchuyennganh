const { MongoClient } = require('mongodb');

// URL kết nối đến MongoDB (Localhost)
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

// Tên của cơ sở dữ liệu
const dbName = 'doanchuyennganh-13';

async function main() {
    // Kết nối đến MongoDB
    await client.connect();
    console.log('Kết nối thành công đến máy chủ MongoDB');
    
    const db = client.db(dbName);
    
    // Tạo một collection (bảng dữ liệu)
    const collection = db.collection('myFirstCollection');
    
    // Chèn dữ liệu vào collection
    const insertResult = await collection.insertOne({ name: "Alice", age: 25 });
    console.log('Kết quả thêm dữ liệu:', insertResult);
    
    // Đóng kết nối
    await client.close();
}

main().catch(console.error);
