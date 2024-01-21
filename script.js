document.addEventListener('DOMContentLoaded', function() {
    let currentDate = new Date().toISOString().slice(0, 10);
    displayMessages(currentDate);
    updateWordCounts();

    function sendMessage() {
        let message = document.getElementById('messageInput').value;
        if (message) {
            let messages = getMessagesForDate(currentDate);
            messages.push(message);
            localStorage.setItem(currentDate, JSON.stringify(messages));
            displayMessages(currentDate);
            updateWordCounts();
            document.getElementById('messageInput').value = '';
        }
    }

    function getMessagesForDate(date) {
        let messages = localStorage.getItem(date);
        return messages ? JSON.parse(messages) : [];
    }

    function displayMessages(date) {
        let messages = getMessagesForDate(date);
        let chatArea = document.getElementById('chatArea');
        chatArea.innerHTML = messages.map(msg => `<p>${msg}</p>`).join('');
    }

    function updateWordCounts() {
        let wordsToday = getMessagesForDate(currentDate).join(' ').split(' ').filter(Boolean).length;
        let totalWords = 0;
        for (let i = 0; i < localStorage.length; i++) {
            totalWords += localStorage.getItem(localStorage.key(i)).split(' ').filter(Boolean).length;
        }
        document.getElementById('wordsToday').textContent = wordsToday;
        document.getElementById('totalWords').textContent = totalWords;
    }

    // Navigation functions
    function goToFirstDay() {
        let firstDay = localStorage.key(0);
        for (let i = 1; i < localStorage.length; i++) {
            if (localStorage.key(i) < firstDay) {
                firstDay = localStorage.key(i);
            }
        }
        if (firstDay) {
            currentDate = firstDay;
            displayMessages(currentDate);
        }
    }

    function goBackOneDay() {
        let prevDate = new Date(currentDate);
        prevDate.setDate(prevDate.getDate() - 1);
        currentDate = prevDate.toISOString().slice(0, 10);
        displayMessages(currentDate);
    }

    function goToRandomDay() {
        if (localStorage.length > 0) {
            let randomIndex = Math.floor(Math.random() * localStorage.length);
            currentDate = localStorage.key(randomIndex);
            displayMessages(currentDate);
        }
    }

    function goForwardOneDay() {
        let nextDate = new Date(currentDate);
        nextDate.setDate(nextDate.getDate() + 1);
        currentDate = nextDate.toISOString().slice(0, 10);
        displayMessages(currentDate);
    }

    function goToToday() {
        currentDate = new Date().toISOString().slice(0, 10);
        displayMessages(currentDate);
    }
});
