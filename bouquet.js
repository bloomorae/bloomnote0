
const bouquets = [
  {
    id: "blush",
    name: "Blush Romance",
    description: "Soft pinks and delicate rose tones",
    colors: ["#d98f9b", "#efb5b5", "#f4d0c9", "#c77983"]
  },
  {
    id: "lavender",
    name: "Lavender Dream",
    description: "A dreamy mix of lilac and violet",
    colors: ["#9c83b8", "#c1a6d2", "#e0c9e4", "#846b9e"]
  },
  {
    id: "peach",
    name: "Peach Petals",
    description: "Warm peach and sunset shades",
    colors: ["#e99c80", "#f3bd9e", "#f6d6b8", "#d77e70"]
  },
  {
    id: "red",
    name: "Velvet Love",
    description: "Deep reds with romantic pinks",
    colors: ["#a94e59", "#c66c76", "#e5a0a0", "#843d4a"]
  },
  {
    id: "yellow",
    name: "Golden Morning",
    description: "Sunny yellows and creamy whites",
    colors: ["#e8bd65", "#f3d88f", "#f8e8bd", "#d99d4f"]
  },
  {
    id: "white",
    name: "Pure Elegance",
    description: "Ivory, cream and soft whites",
    colors: ["#e9dfc9", "#f7f0df", "#d8cbb9", "#fff8e9"]
  },
  {
    id: "blue",
    name: "Blue Skies",
    description: "Powder blue and gentle periwinkle",
    colors: ["#88a9c9", "#abc5dc", "#d2dfeb", "#778eb4"]
  },
  {
    id: "pastel",
    name: "Pastel Wishes",
    description: "A sweet blend of pastel colours",
    colors: ["#e5a7b7", "#b8a4cf", "#f0c5a7", "#a9c5ae"]
  },
  {
    id: "coral",
    name: "Coral Sunset",
    description: "Coral, apricot and warm pink",
    colors: ["#e57f70", "#f0a18a", "#f5c1a2", "#c96d69"]
  },
  {
    id: "garden",
    name: "Garden Whimsy",
    description: "A colourful garden-inspired mix",
    colors: ["#d98ca2", "#e7bd75", "#a8a1c9", "#d99b80"]
  }
];

const grid = document.getElementById("bouquet-grid");
const selectionText = document.getElementById("selection-text");
const continueButton = document.getElementById("continue-button");
const backButton = document.getElementById("back-button");

let selectedBouquet = null;


// Styling for the Add buttons
const buttonStyles = document.createElement("style");

buttonStyles.textContent = `
  .add-button {
    margin-top: 15px;
    padding: 10px 27px;
    border: 1px solid #bd8989;
    border-radius: 25px;
    background: #fff8f5;
    color: #9b7070;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    cursor: pointer;
    transition: .2s ease;
  }

  .add-button:hover {
    background: #f3e3df;
    transform: translateY(-2px);
  }

  .bouquet-card.selected .add-button {
    background: #b98284;
    color: white;
    border-color: #b98284;
  }
`;

document.head.appendChild(buttonStyles);


// Creates an empty watercolor-style bouquet wrapper.
function createWrapperIllustration(colors, index) {
  const mainColor = colors[0];
  const foldColor = colors[1];
  const lightColor = colors[2];
  const ribbonColor = colors[3];

  const gradientId = `paperGradient${index}`;
  const shadowId = `paperShadow${index}`;
  const textureId = `paperTexture${index}`;

  return `
    <svg viewBox="0 0 300 310"
         xmlns="http://www.w3.org/2000/svg">

      <defs>

        <linearGradient id="${gradientId}"
                        x1="0%" y1="0%"
                        x2="100%" y2="100%">

          <stop offset="0%" stop-color="${lightColor}"/>
          <stop offset="50%" stop-color="${mainColor}"/>
          <stop offset="100%" stop-color="${foldColor}"/>

        </linearGradient>

        <filter id="${shadowId}">
          <feGaussianBlur stdDeviation="4"/>
        </filter>

        <filter id="${textureId}">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.7"
            numOctaves="2"
            seed="${index + 2}"
          />
          <feColorMatrix type="saturate" values="0"/>
          <feComponentTransfer>
            <feFuncA type="table"
                     tableValues="0 0.08"/>
          </feComponentTransfer>
        </filter>

      </defs>

      <!-- Soft cream watercolor background -->
      <rect width="300" height="310"
            rx="12" fill="#fbf4ef"/>

      <!-- Gentle watercolor wash -->
      <ellipse cx="70" cy="80" rx="45" ry="35"
               fill="${lightColor}" opacity=".18"
               filter="url(#${shadowId})"/>

      <ellipse cx="235" cy="180" rx="50" ry="55"
               fill="${foldColor}" opacity=".15"
               filter="url(#${shadowId})"/>

      <!-- Shadow behind the wrapper -->
      <path
        d="M 60 95 Q 150 60 240 95
           L 190 267 Q 150 292 110 267 Z"
        fill="#a88b80"
        opacity=".16"
        filter="url(#${shadowId})"
      />

      <!-- Back paper folds -->
      <path
        d="M 72 91
           Q 54 72 83 53
           Q 117 75 150 82
           Q 185 72 218 53
           Q 246 73 228 96
           L 188 253
           Q 150 274 112 253 Z"
        fill="${foldColor}"
        opacity=".85"
      />

      <!-- Main empty wrapper -->
      <path
        d="M 76 91
           Q 150 65 224 91
           L 184 259
           Q 150 283 116 259 Z"
        fill="url(#${gradientId})"
        stroke="${mainColor}"
        stroke-width="1.2"
      />

      <!-- Left folded paper layer -->
      <path
        d="M 76 91
           Q 104 111 150 139
           L 116 259
           Z"
        fill="${lightColor}"
        opacity=".55"
      />

      <!-- Right folded paper layer -->
      <path
        d="M 224 91
           Q 196 111 150 139
           L 184 259
           Z"
        fill="${foldColor}"
        opacity=".5"
      />

      <!-- Paper texture -->
      <path
        d="M 76 91
           Q 150 65 224 91
           L 184 259
           Q 150 283 116 259 Z"
        filter="url(#${textureId})"
        opacity=".45"
      />

      <!-- Open, empty top of the wrapper -->
      <ellipse
        cx="150" cy="91"
        rx="74" ry="24"
        fill="${lightColor}"
        stroke="${foldColor}"
        stroke-width="1.5"
      />

      <ellipse
        cx="150" cy="91"
        rx="59" ry="15"
        fill="#fffaf5"
        opacity=".65"
      />

      <!-- Front paper fold -->
      <path
        d="M 76 91
           Q 115 122 150 139
           Q 185 122 224 91
           L 184 259
           Q 150 283 116 259 Z"
        fill="${mainColor}"
        opacity=".35"
      />

      <!-- Fold details -->
      <path
        d="M 76 91 Q 116 117 150 139"
        fill="none"
        stroke="#ffffff"
        stroke-width="2"
        opacity=".55"
      />

      <path
        d="M 224 91 Q 184 117 150 139"
        fill="none"
        stroke="${foldColor}"
        stroke-width="2"
        opacity=".7"
      />

      <!-- Ribbon around wrapper -->
      <path
        d="M 115 239 Q 150 248 185 239"
        fill="none"
        stroke="${ribbonColor}"
        stroke-width="5"
        stroke-linecap="round"
      />

      <!-- Ribbon bow -->
      <path
        d="M 150 242
           C 125 218 110 230 123 246
           Q 137 254 150 242"
        fill="${ribbonColor}"
        stroke="${foldColor}"
        stroke-width="1"
      />

      <path
        d="M 150 242
           C 175 218 190 230 177 246
           Q 163 254 150 242"
        fill="${ribbonColor}"
        stroke="${foldColor}"
        stroke-width="1"
      />

      <!-- Ribbon centre -->
      <ellipse
        cx="150" cy="242"
        rx="6" ry="7"
        fill="${lightColor}"
        stroke="${ribbonColor}"
        stroke-width="1"
      />

      <!-- Ribbon tails -->
      <path
        d="M 145 247 Q 132 263 136 274
           Q 147 268 150 248"
        fill="${ribbonColor}"
        opacity=".9"
      />

      <path
        d="M 155 247 Q 168 263 164 274
           Q 153 268 150 248"
        fill="${ribbonColor}"
        opacity=".9"
      />

    </svg>
  `;
}


// Displays all 10 wrappers.
function renderBouquets() {
  grid.innerHTML = bouquets.map((bouquet, index) => `
    <article class="bouquet-card" data-id="${bouquet.id}">

      <div class="artwork">
        ${createWrapperIllustration(bouquet.colors, index)}
      </div>

      <div class="card-info">
        <h2>${bouquet.name}</h2>
        <p>${bouquet.description}</p>

        <button class="add-button" type="button"
                data-id="${bouquet.id}">
          Add
        </button>
      </div>

    </article>
  `).join("");


  // Only ONE wrapper can be added.
  document.querySelectorAll(".add-button").forEach(button => {

    button.addEventListener("click", () => {

      const bouquetId = button.dataset.id;

      selectedBouquet = bouquets.find(
        bouquet => bouquet.id === bouquetId
      );

      // Remove previous selection.
      document.querySelectorAll(".bouquet-card").forEach(card => {
        card.classList.remove("selected");
      });

      document.querySelectorAll(".add-button").forEach(btn => {
        btn.textContent = "Add";
        btn.setAttribute("aria-pressed", "false");
      });

      // Highlight the newly selected wrapper.
      const selectedCard = document.querySelector(
        `.bouquet-card[data-id="${bouquetId}"]`
      );

      selectedCard.classList.add("selected");

      button.textContent = "Added ✓";
      button.setAttribute("aria-pressed", "true");

      selectionText.textContent =
        `${selectedBouquet.name} selected. Lovely choice!`;

    });

  });
}


// Continue button.
continueButton.addEventListener("click", () => {

  if (!selectedBouquet) {
    alert("Please add one wrapper first!");
    return;
  }

  sessionStorage.setItem(
    "bloomnoteBouquet",
    JSON.stringify(selectedBouquet)
  );

  window.location.href = "arrangement.html";

});


// Back button.
backButton.addEventListener("click", () => {
  window.location.href = "leaves.html";
});


// Start the page.
renderBouquets();
