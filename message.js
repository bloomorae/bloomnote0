const messages = [
    "A little happiness, just for you.",
    "You make the world a softer place.",
    "Never forget how lovely you are.",
    "May your days bloom with joy.",
    "You deserve all the beautiful things.",
    "A little reminder that you matter.",
    "Keep blooming, wherever life takes you.",
    "The world is lovelier with you in it.",
    "I hope today is gentle with you.",
    "You are someone's favourite kind of sunshine.",

    "If I could gift you a feeling, it would be happiness.",
    "You make ordinary moments feel magical.",
    "A thousand little flowers for you.",
    "Some people feel like sunshine. You're one of them.",
    "Life feels sweeter with you around.",
    "You are my favourite hello.",
    "Wherever you go, take a little happiness with you.",
    "You make my world a little more beautiful.",
    "A little piece of my heart, wrapped in flowers.",
    "Some things are better said with flowers.",

    "So lucky to have found a friend like you.",
    "Here's to our endless little adventures.",
    "Thank you for being my happy place.",
    "Friends like you are rare little flowers.",
    "Life is more fun with you beside me.",
    "A flower for my favourite person to laugh with.",
    "May our friendship always stay in bloom.",
    "You're a lovely part of my story.",
    "Thank you for making memories sweeter.",
    "A little bouquet for a big-hearted friend.",

    "One day at a time, little by little.",
    "Brighter days are finding their way to you.",
    "Give yourself time to bloom.",
    "You are doing better than you think.",
    "May peace find its way to your heart.",
    "Even the quietest flowers bloom beautifully.",
    "Take life gently, dear heart.",
    "There is still so much beauty ahead.",
    "Sending you a pocketful of sunshine.",
    "May tomorrow bring something lovely.",

    "Thank you for being wonderfully you.",
    "Your kindness leaves flowers everywhere.",
    "A little thank-you, wrapped in petals.",
    "You make kindness look effortless.",
    "The world needs more hearts like yours.",
    "For all the little things you do.",
    "You bring beauty without even trying.",
    "A small gift for someone truly wonderful.",
    "May kindness always find you.",
    "With love, warmth, and a thousand blooms."
];

const messageGrid = document.getElementById("message-grid");
const letterPreview = document.getElementById("letter-preview");
const attachButton = document.getElementById("attach-button");
const continueButton = document.getElementById("continue-button");
const selectionStatus = document.getElementById("selection-status");

const bouquetPreview = document.getElementById("bouquet-preview");
const bouquetPlaceholder = document.getElementById("bouquet-placeholder");

let selectedMessage = null;
let attachedMessage = null;

// Display all 50 messages
messages.forEach((message, index) => {
    const card = document.createElement("button");

    card.className = "message-card";
    card.type = "button";
    card.textContent = message;

    card.addEventListener("click", () => {
        document.querySelectorAll(".message-card").forEach(item => {
            item.classList.remove("selected");
        });

        card.classList.add("selected");

        selectedMessage = message;

        letterPreview.innerHTML = "";

        const text = document.createElement("p");
        text.textContent = message;

        letterPreview.appendChild(text);

        attachButton.disabled = false;
        selectionStatus.textContent = "Message selected ♡";
    });

    messageGrid.appendChild(card);
});

// Load the saved bouquet from the arrangement page
const savedBouquet = sessionStorage.getItem("bloomnoteArrangementPreview");

// Shrinks or grows the saved bouquet picture so it fits the preview box
function fitBouquet() {
    const frame = bouquetPreview.querySelector(".bq-snapshot");
    if (!frame) return;

    const scene = frame.querySelector(".bq-scene");

    // size of the part of the canvas that holds the bouquet
    const width = Number(frame.dataset.w);
    const height = Number(frame.dataset.h);
    const offsetX = Number(frame.dataset.x);
    const offsetY = Number(frame.dataset.y);

    // never taller than 520px, and never bigger than the box it sits in
    const maxHeight = 520;
    const available = bouquetPreview.clientWidth || width;

    let scale = Math.min(available / width, maxHeight / height);
    scale = Math.min(scale, 1.6);

    frame.style.width = `${width * scale}px`;
    frame.style.height = `${height * scale}px`;

    scene.style.transform =
        `scale(${scale}) translate(${-offsetX}px, ${-offsetY}px)`;
}

if (savedBouquet) {
    bouquetPlaceholder.style.display = "none";
    bouquetPreview.insertAdjacentHTML("afterbegin", savedBouquet);

    fitBouquet();
    window.addEventListener("resize", fitBouquet);
}

// Attach the selected message
attachButton.addEventListener("click", () => {
    if (!selectedMessage) return;

    const oldNote = bouquetPreview.querySelector(".attached-note");

    if (oldNote) {
        oldNote.remove();
    }

    const note = document.createElement("div");
    note.className = "attached-note";

    const noteText = document.createElement("p");
    noteText.textContent = selectedMessage;

    note.appendChild(noteText);
    bouquetPreview.appendChild(note);

    attachedMessage = selectedMessage;

    continueButton.disabled = false;
    selectionStatus.textContent = "Your little letter is attached ♡";
});

// Save the selected message and continue

continueButton.addEventListener("click", () => {
    if (!attachedMessage) return;

    sessionStorage.setItem(
        "bloomnoteSelectedMessage",
        attachedMessage
    );

    window.location.href = "final.html";
});
