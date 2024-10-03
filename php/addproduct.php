<?php
include 'db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $title = $_POST['title'];
    $image_url = $_POST['image_url'];
    $price = $_POST['price'];
    $category = $_POST['category'];

    $sql = "INSERT INTO products (title, price, image_url, category) VALUES ('$title', '$price', '$image_url', '$category')";

    if ($conn->query($sql) === TRUE) {
        echo "Sản phẩm đã được thêm thành công!";
    } else {
        echo "Lỗi: " . $sql . "<br>" . $conn->error;
    }

    $conn->close();
}
?>
