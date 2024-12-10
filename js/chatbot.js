// Lưu tin nhắn vào sessionStorage
function saveChatHistory() {
    const messageArea = document.getElementById("messages");
    if (messageArea) {
        const messages = messageArea.innerHTML;
        sessionStorage.setItem("chatHistory", messages);
    }
}

// Tải lại lịch sử trò chuyện từ sessionStorage khi mở lại trang
function loadChatHistory() {
    const messageArea = document.getElementById("messages");
    if (messageArea) {
        const savedMessages = sessionStorage.getItem("chatHistory");
        if (savedMessages) {
            messageArea.innerHTML = savedMessages;
        }
    }
}

// Hàm để chuyển đổi trạng thái của chatbox (hiện/ẩn)
function toggleChat() {
    const chatbox = document.getElementById("chatbox");
    const messageArea = document.getElementById("messages");

    if (chatbox && messageArea) {
        if (chatbox.style.display === "block") {
            chatbox.style.display = "none";
        } else {
            chatbox.style.display = "block";
            if (messageArea.innerHTML === "") {
                // Gửi câu hỏi ban đầu khi mở chat
                sendBotMessage(
                    "Book Haven là một trang web bán sách trực tuyến, chuyên cung cấp các cuốn sách đa dạng từ nhiều thể loại khác nhau, bao gồm các sách tự xuất bản của tác giả. Với sứ mệnh hỗ trợ các tác giả tự xuất bản, Book Haven không chỉ cung cấp nền tảng xuất bản dễ dàng mà còn giúp các tác giả xây dựng thương hiệu và tăng cường sự hiện diện trực tuyến."
                );
                displayQuestions(); // Hiển thị câu hỏi sau khi mở chat
            }
            scrollToBottom(); // Cuộn xuống dưới khi mở chat
        }
    }
}

// Hàm gửi tin nhắn của bot
function sendBotMessage(message) {
    const messageArea = document.getElementById("messages");
    if (messageArea) {
        const botMessage = document.createElement("div");
        botMessage.classList.add("bot-message");
        botMessage.innerText = message;
        messageArea.appendChild(botMessage);

        // Cuộn xuống dưới khi có tin nhắn mới
        messageArea.scrollTop = messageArea.scrollHeight;
    }
}

// Hàm tạo câu hỏi và thêm vào chatbox
function displayQuestions() {
    const messageArea = document.getElementById("messages");
    if (messageArea) {
        const questions = [
            { text: "Sách đang bán chạy nhất ở đây là gì?", answer: "Sách bán chạy nhất hiện nay là 'Cô gái đến từ hôm qua' của tác giả Nguyễn Nhật Ánh." },
            { text: "Chính sách bảo hành ở đây là gì?", answer: "Sách không có chính sách bảo hành, nhưng có thể đổi trả trong vòng 7 ngày nếu sách bị lỗi." },
            { text: "Shop có bán sách chính hãng không?", answer: "Tất cả sách bán tại Book Haven đều là sách chính hãng." }
        ];

        questions.forEach((question) => {
            const button = document.createElement("button");
            button.innerText = question.text;
            button.onclick = function () {
                sendAnswer(question.answer, button);
            };
            messageArea.appendChild(button); // Thêm câu hỏi vào messageArea
        });
    }
}

function sendAnswer(answer, questionButton) {
    const messageArea = document.getElementById("messages");
    if (messageArea) {
        const botMessage = document.createElement("div");
        botMessage.classList.add("bot-message");
        botMessage.innerText = answer;

        messageArea.appendChild(botMessage);

        // Cuộn xuống cuối cùng để thấy tin nhắn mới
        messageArea.scrollTop = messageArea.scrollHeight;

        // Xóa câu hỏi đã được nhấn
        if (questionButton) {
            questionButton.remove();
        }
    }
}

// Hàm kiểm tra và gửi câu trả lời từ người dùng
function sendMessage() {
    const userInput = document.getElementById("userInput");
    if (userInput && userInput.value.trim()) {
        const messageArea = document.getElementById("messages");

        // Tạo một container cho tin nhắn người dùng
        const messageContainer = document.createElement("div");
        messageContainer.classList.add("user-message");

        const userMessage = document.createElement("div");
        userMessage.classList.add("message-text");
        userMessage.innerText = userInput.value;

        messageContainer.appendChild(userMessage);
        messageArea.appendChild(messageContainer);

        // Gửi câu trả lời tự động từ bot dựa trên câu hỏi của người dùng
        autoReply(userInput.value);

        // Làm sạch input sau khi gửi
        userInput.value = "";
        saveChatHistory(); // Lưu lịch sử
    }
}

// Hàm trả lời tự động từ bot dựa trên câu hỏi của người dùng
function autoReply(userInput) {
    const messageArea = document.getElementById("messages");
    if (messageArea) {
        let botResponse = "Xin lỗi, tôi không hiểu câu hỏi của bạn. Vui lòng liên hệ hỗ trợ.";

        // Kiểm tra từ khóa
        if (/sách bán chạy|sách hot|best seller/.test(userInput.toLowerCase())) {
            botResponse = "Sách bán chạy nhất hiện nay là 'Cô gái đến từ hôm qua' của tác giả Nguyễn Nhật Ánh.";
        } else if (/bảo hành|đổi trả/.test(userInput.toLowerCase())) {
            botResponse = "Sách không có chính sách bảo hành, nhưng có thể đổi trả trong vòng 7 ngày nếu sách bị lỗi.";
        } else if (/sách chính hãng/.test(userInput.toLowerCase())) {
            botResponse = "Tất cả sách bán tại Book Haven đều là sách chính hãng.";
        } else if (/ship|giao hàng/.test(userInput.toLowerCase())) {
            botResponse = "Thời gian ship hàng là 2-3 ngày kể từ khi nhận được đơn hàng.";
        }

        sendBotMessage(botResponse);
    }
}

// Hàm cuộn xuống dưới cùng của khung chat
function scrollToBottom() {
    const messageArea = document.getElementById("messages");
    if (messageArea) {
        messageArea.scrollTop = messageArea.scrollHeight;
    }
}

// Thêm sự kiện nhấn phím Enter
document.getElementById("userInput").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Ngăn việc Enter tạo dòng mới
        sendMessage(); // Gọi hàm gửi tin nhắn
    }
});

// Thêm sự kiện nhấn nút "Gửi"
document.getElementById("sendBtn").onclick = sendMessage;

window.onload = loadChatHistory;
