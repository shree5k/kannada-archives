let currentContent = null; // To keep track of the current content

const meanings = {
    "ಹೊನ್ನಗಿಂಡಿಯ": "ಹೆಸರಿನ ಹೂವು / flower of the golden shower tree",
    "ಯಕ್ಷಲೋಕ": "ದೇವತೆಯ ಸ್ಥಳ / world of supernatural beings",
    "ದಿಗಂತದಿ": "in the horizon",
    "ಮೈಸಿರಿ": "clouds",
    "ವೈಮಾನಿಕ": "ದೇವತೆ",
    "ತೀಡಿ": "gentle breeze",
    "ಲೀಲಾಮಾತ್ರ": "merely a play",
    // Add more words and their meanings here
};

async function loadNames() {
    try {
        const response = await fetch('data.json?v=' + new Date().getTime());
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        const container = document.querySelector('.main-container');
        container.innerHTML = ''; // Clear previous content
        data.items.forEach(item => {
            const div = document.createElement('div');
            div.className = 'list-item';
            div.innerHTML = `<a href="#" onclick="showContent('${item.content.replace(/'/g, "\\'")}', '${item.name}')">${item.name}</a>`;
            container.appendChild(div);
        });
    } catch (error) {
        const container = document.querySelector('.main-container');
        container.innerHTML = 'Error loading names: ' + error.message;
        console.error('Error fetching data:', error);
    }
}

async function showContent(contentFile, name) {
    const container = document.querySelector('.main-container');
    if (currentContent) {
        // If content is already displayed, go back to the list
        currentContent = null;
        loadNames(); // Reload names
    } else {
        // Fetch the content from the text file with cache busting
        try {
            const response = await fetch(contentFile + '?v=' + new Date().getTime());
            if (!response.ok) throw new Error('Network response was not ok');
            const content = await response.text();
            currentContent = content;
            const tooltipContent = replaceWithTooltips(content);
            container.innerHTML = `<a onclick="showNames()" class="visited-link" style="cursor: pointer;">${name}</a><p>${tooltipContent}</p>`;
        } catch (error) {
            container.innerHTML = 'Error loading content: ' + error.message;
            console.error('Error fetching content:', error);
        }
    }
}

function replaceWithTooltips(content) {
    // Ensure meanings object is defined and accessible
    const words = Object.keys(meanings).join('|'); 
    const regex = new RegExp(`(${words})`, 'g'); 

    return content.replace(regex, (match) => {
        return `<span class="tooltip">${match}<span class="tooltiptext">${meanings[match]}</span></span>`;
    });
}

function showNames() {
    currentContent = null; // Reset current content
    loadNames(); // Reload names
}

window.onload = loadNames; // Load names when the page loads
