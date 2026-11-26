const finalBouquet = document.getElementById("final-bouquet");
const generateButton = document.getElementById("generate-link-button");
const linkStatus = document.getElementById("link-status");

// Get the saved bouquet and selected message
const savedBouquet = sessionStorage.getItem(
    "bloomnoteArrangementPreview"
);

const savedMessage = sessionStorage.getItem(
    "bloomnoteSelectedMessage"
);

// Fit the bouquet inside its preview area
function fitBouquet() {
    const frame = finalBouquet.querySelector(".bq-snapshot");
    if (!frame) return;

    const scene = frame.querySelector(".bq-scene");
    if (!scene) return;

    const width = Number(frame.dataset.w);
    const height = Number(frame.dataset.h);
    const offsetX = Number(frame.dataset.x);
    const offsetY = Number(frame.dataset.y);

    if (!width || !height) return;

    const maxHeight = 520;
    const available = finalBouquet.clientWidth || width;

    let scale = Math.min(
        available / width,
        maxHeight / height
    );

    scale = Math.min(scale, 1.6);

    frame.style.width = `${width * scale}px`;
    frame.style.height = `${height * scale}px`;

    scene.style.transform =
        `scale(${scale}) translate(${-offsetX}px, ${-offsetY}px)`;
}

// Display the saved bouquet and attach its note
function displayFinalBouquet() {
    if (!savedBouquet) {
        finalBouquet.innerHTML = `
            <p class="bouquet-placeholder">
                Your bouquet couldn't be found. Please create it again ♡
            </p>
        `;
        return;
    }

    finalBouquet.innerHTML = savedBouquet;

    // Recreate the same attached vintage-paper note
    const note = document.createElement("div");
    note.className = "attached-note";

    const noteText = document.createElement("p");
    noteText.textContent =
        savedMessage || "A little happiness, just for you.";

    note.appendChild(noteText);
    finalBouquet.appendChild(note);

    fitBouquet();
}

// Load the finished bouquet
displayFinalBouquet();

window.addEventListener("resize", fitBouquet);


// ==========================================
// GENERATE A LINK TO SHARE
// ==========================================

const linkStyles = document.createElement("style");

linkStyles.textContent = `
  .share-link-box {
    margin: 18px auto 0;
    max-width: 520px;
    text-align: center;
  }

  .share-link-row {
    display: flex;
    gap: 8px;
  }

  .share-link-row input {
    flex: 1;
    min-width: 0;
    padding: 12px 14px;
    border: 1px solid #dfc8c0;
    border-radius: 12px;
    background: #ffffff;
    color: #604b46;
    font-size: 12px;
    font-family: Arial, sans-serif;
  }

  .share-link-box button,
  .share-link-box a {
    border: 1px solid #ad7c7b;
    background: #ad7c7b;
    color: #ffffff;
    padding: 11px 20px;
    border-radius: 30px;
    font-size: 13px;
    font-family: inherit;
    text-decoration: none;
    cursor: pointer;
    transition: .2s ease;
  }

  .share-link-box button:hover,
  .share-link-box a:hover {
    background: #916665;
    transform: translateY(-2px);
  }

  .share-link-extra {
    display: flex;
    justify-content: center;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: 12px;
  }

  .share-link-extra button,
  .share-link-extra a {
    background: transparent;
    color: #987570;
    border-color: #dfc8c0;
  }

  .share-link-extra button:hover,
  .share-link-extra a:hover {
    background: #f2e4df;
  }

  .share-local-warning {
    margin-top: 12px;
    font-size: 11px;
    color: #b17e80;
    line-height: 1.6;
  }

  @media (max-width: 520px) {
    .share-link-row {
      flex-direction: column;
    }
  }
`;

document.head.appendChild(linkStyles);

const linkBox = document.createElement("div");
linkBox.className = "share-link-box";
linkBox.hidden = true;

linkBox.innerHTML = `
  <div class="share-link-row">
    <input type="text" id="share-link-input" readonly
           aria-label="Your bouquet link">
    <button type="button" id="share-copy-button">Copy link</button>
  </div>

  <div class="share-link-extra">
    <button type="button" id="share-native-button" hidden>Share…</button>
    <a id="share-whatsapp-link" target="_blank" rel="noopener">
      Send on WhatsApp
    </a>
  </div>

  <p class="share-local-warning" id="share-local-warning" hidden>
    This link only works on this computer until your website is online.
  </p>
`;

linkStatus.insertAdjacentElement("afterend", linkBox);

const shareLinkInput = document.getElementById("share-link-input");
const shareCopyButton = document.getElementById("share-copy-button");
const shareNativeButton = document.getElementById("share-native-button");
const shareWhatsappLink = document.getElementById("share-whatsapp-link");
const shareLocalWarning = document.getElementById("share-local-warning");

function readSavedJson(key, fallback) {
    try {
        const value = sessionStorage.getItem(key);
        return value ? JSON.parse(value) : fallback;
    } catch (error) {
        return fallback;
    }
}

function roundTo(value, digits) {
    const factor = Math.pow(10, digits);
    return Math.round(Number(value) * factor) / factor;
}

// Turns the finished bouquet into a small "recipe" that fits inside a link
function buildShareRecipe() {
    const pieces = readSavedJson("bloomnoteArrangement", []);
    const wrapperState = readSavedJson("bloomnoteWrapper", null);
    const bouquetInfo = readSavedJson("bloomnoteBouquet", null);

    // Fallback if someone opened final.html directly without arrangement pieces
    const fallbackPieces =
        (!Array.isArray(pieces) || pieces.length === 0) && savedBouquet
            ? [[0, 0, 50, 42, 0, 1.1]]
            : null;

    if ((!Array.isArray(pieces) || pieces.length === 0) && !fallbackPieces) {
        return null;
    }

    const size = (savedBouquet || "").match(
        /data-sw="(\d+)"\s+data-sh="(\d+)"/
    );

    const names = [];

    const recipePieces = fallbackPieces
        ? (names.push("Pink Rose"), fallbackPieces)
        : pieces.map(piece => {
            let index = names.indexOf(piece.name);

            if (index === -1) {
                names.push(piece.name);
                index = names.length - 1;
            }

            return [
                piece.type === "leaf" ? 1 : 0,
                index,
                roundTo(piece.x, 1),
                roundTo(piece.y, 1),
                roundTo(piece.rotation, 0),
                roundTo(piece.scale, 2)
            ];
        });

    const hasColors = !!(
        bouquetInfo && Array.isArray(bouquetInfo.colors)
    );

    return {
        v: 1,
        cw: size ? Number(size[1]) : 900,
        ch: size ? Number(size[2]) : 570,
        c: hasColors
            ? bouquetInfo.colors.slice(0, 4).map(
                color => String(color).replace("#", "")
            )
            : null,
        w: hasColors && wrapperState
            ? [
                roundTo(wrapperState.x, 1),
                roundTo(wrapperState.y, 1),
                roundTo(wrapperState.rotation, 0),
                roundTo(wrapperState.scale, 2)
            ]
            : null,
        n: names,
        p: recipePieces,
        m: savedMessage || "A little happiness, just for you."
    };
}

// Generate Link
generateButton.addEventListener("click", async () => {
    if (typeof BloomShare === "undefined") {
        linkStatus.textContent =
            "The sharing file is missing. Please upload bouquet-render.js ♡";
        return;
    }

    const recipe = buildShareRecipe();

    if (!recipe) {
        linkStatus.textContent =
            "Your bouquet couldn't be found. Please create it again ♡";
        return;
    }

    generateButton.disabled = true;

    try {
        const code = await BloomShare.encode(recipe);

        const base = new URL("view.html", window.location.href).href;
        const url = base.split("?")[0].split("#")[0] + "?b=" + code;

        shareLinkInput.value = url;
        linkBox.hidden = false;

        shareWhatsappLink.href =
            "https://wa.me/?text=" +
            encodeURIComponent("I made you a little bouquet ♡ " + url);

        if (navigator.share) shareNativeButton.hidden = false;

        if (window.location.protocol === "file:") {
            shareLocalWarning.hidden = false;
        }

        linkStatus.textContent =
            "Your link is ready ♡ Copy it and send it to someone special.";

        shareLinkInput.focus();
        shareLinkInput.select();
    } catch (error) {
        linkStatus.textContent =
            "Something went wrong. Please try again ♡";
    }

    generateButton.disabled = false;
});

// Copy the link
shareCopyButton.addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(shareLinkInput.value);
    } catch (error) {
        shareLinkInput.select();
        document.execCommand("copy");
    }

    shareCopyButton.textContent = "Copied ✓";
    linkStatus.textContent = "Link copied. Now paste it to a friend ♡";

    setTimeout(() => {
        shareCopyButton.textContent = "Copy link";
    }, 2000);
});

// Share with other apps (mostly on phones)
shareNativeButton.addEventListener("click", () => {
    navigator.share({
        title: "A bouquet for you",
        text: "I made you a little bouquet ♡",
        url: shareLinkInput.value
    }).catch(() => {});
});