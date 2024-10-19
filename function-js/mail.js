const mails = {
    "1": {
        subject: "Welcome!",
        sender: "admin@example.com",
        body: "Welcome to our service! We're excited to have you on board."
    },
    "2": {
        subject: "Meeting Reminder",
        sender: "hr@example.com",
        body: "This is a reminder about the meeting scheduled for tomorrow at 10 AM. Please be on time."
    },
    "3": {
        subject: "Newsletter",
        sender: "news@example.com",
        body: "Here's your weekly newsletter with the latest updates and stories. Enjoy reading!"
    }
};

let currentMailId = null;

function openMail(id) {
    const mail = mails[id];
    if (mail) {
        currentMailId = id;
        document.querySelector('.mail-subject').innerText = mail.subject;
        document.querySelector('.mail-body').innerText = mail.body;
        document.querySelector('.reply-to').innerText = mail.sender;
        document.querySelector('.reply-form').classList.add('hidden');
    }
}

function showReplyForm() {
    if (currentMailId) {
        document.querySelector('.reply-form').classList.remove('hidden');
        document.querySelector('.reply-message').value = '';
    }
}

function hideReplyForm() {
    document.querySelector('.reply-form').classList.add('hidden');
    document.querySelector('.reply-message').value = '';
}

function sendReply() {
    const replyMessage = document.querySelector('.reply-message').value;
    const replyTo = document.querySelector('.reply-to').innerText;
    if (replyMessage.trim()) {
        console.log(`Reply to ${replyTo}: ${replyMessage}`);
        alert('Reply sent!');
        hideReplyForm();
    } else {
        alert('Please write a message before sending.');
    }
}

function deleteMail(event, id) {
    event.stopPropagation();  // Prevent triggering `openMail` when clicking delete
    if (confirm("Are you sure you want to delete this email?")) {
        delete mails[id];
        const mailElement = document.getElementById(`mail-${id}`);
        if (mailElement) {
            mailElement.remove();
        }
        if (currentMailId === id) {
            document.querySelector('.mail-subject').innerText = 'Select a message to read';
            document.querySelector('.mail-body').innerText = '';
            currentMailId = null;
        }
    }
}
