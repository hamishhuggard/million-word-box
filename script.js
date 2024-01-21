document.addEventListener('DOMContentLoaded', function() {
    let currentDate = new Date().toISOString().slice(0, 10);
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.querySelector('button#send');
    const firstDayButton = document.querySelector('button#firstDay');
    const prevDayButton = document.querySelector('button#prevDay');
    const randomDayButton = document.querySelector('button#randomDay');
    const nextDayButton = document.querySelector('button#nextDay');
    const todayButton = document.querySelector('button#today');
    const formatter = new Intl.NumberFormat('en-US', {
        notation: 'compact',
        compactDisplay: 'short'
    });

    sendButton.addEventListener('click', sendMessage);
    firstDayButton.addEventListener('click', goToFirstDay);
    prevDayButton.addEventListener('click', goBackOneDay);
    randomDayButton.addEventListener('click', goToRandomDay);
    nextDayButton.addEventListener('click', goForwardOneDay);
    todayButton.addEventListener('click', goToToday);

    // Add an event listener for keyup on the message input
    messageInput.addEventListener('keyup', function(event) {
        if (event.keyCode === 13) { // 13 is the keycode for the enter key
            sendMessage();
            event.preventDefault(); // Prevents the default space bar action (scrolling/page break)
        }
    });

    displayMessages(currentDate);
    updateWordCounts();

    function sendMessage() {
        let message = messageInput.value.trim(); // Trim to remove leading/trailing white spaces
        if (message) {
            let messages = getMessagesForDate(currentDate);
            messages.push(message);
            localStorage.setItem(currentDate, JSON.stringify(messages));
            displayMessages(currentDate);
            updateWordCounts();
            messageInput.value = '';
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

        // Scroll to the bottom of the chat area
        chatArea.scrollTop = chatArea.scrollHeight;

        // Update the pastWords information
        let present = new Date().toISOString().slice(0, 10);
        let pastDateElem = document.getElementById('pastDate');
        let pastWordsElem = document.getElementById('pastWords');
        let pastWordCountElem = document.getElementById('pastWordCount');

        if (date === present) {
            pastWordsElem.style.display = 'none'; // Hide the element
        } else {
            pastWordCount = messages.join(' ').split(' ').filter(Boolean).length;
            pastDateElem.textContent = date;
            pastWordCountElem.textContent = pastWordCount;;
            pastWordsElem.style.display = 'block'; // Show the element
        }
    }

    function updateWordCounts() {
        let wordsToday = getMessagesForDate(currentDate).join(' ').split(' ').filter(Boolean).length;
        let totalWords = 0;
        for (let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);
            if (key !== "debug") {
                let messages = JSON.parse(localStorage.getItem(key));
                totalWords += messages.join(' ').split(' ').filter(Boolean).length;
            }
        }
        document.getElementById('wordsToday').textContent = wordsToday;
        document.getElementById('totalWords').textContent = totalWords;

        // Update the webpage title with the total word count
        document.title = formatter.format(totalWords) + " Words";
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
