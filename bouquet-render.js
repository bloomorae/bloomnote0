(function (global) {
    function toBase64Url(str) {
        const bytes = new TextEncoder().encode(str);
        let binary = "";
        for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary)
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "");
    }

    function fromBase64Url(base64Url) {
        let base64 = String(base64Url || "")
            .replace(/-/g, "+")
            .replace(/_/g, "/");
        while (base64.length % 4) {
            base64 += "=";
        }
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return new TextDecoder().decode(bytes);
    }

    async function encode(recipe) {
        return toBase64Url(JSON.stringify(recipe));
    }

    function decode(code) {
        if (!code) return null;
        try {
            return JSON.parse(fromBase64Url(code));
        } catch (err) {
            return null;
        }
    }

    function wrapperBaseMarkup(colors, p) {
        const [mainColor, foldColor, lightColor] = colors;
        return `
            <defs>
                <linearGradient id="${p}Gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="${lightColor}"/>
                    <stop offset="50%" stop-color="${mainColor}"/>
                    <stop offset="100%" stop-color="${foldColor}"/>
                </linearGradient>
                <filter id="${p}Shadow"><feGaussianBlur stdDeviation="4"/></filter>
            </defs>
            <path d="M 60 95 Q 150 60 240 95 L 190 267 Q 150 292 110 267 Z" fill="#a88b80" opacity=".16" filter="url(#${p}Shadow)"/>
            <path d="M 72 91 Q 54 72 83 53 Q 117 75 150 82 Q 185 72 218 53 Q 246 73 228 96 L 188 253 Q 150 274 112 253 Z" fill="${foldColor}" opacity=".85"/>
            <path d="M 76 91 Q 150 65 224 91 L 184 259 Q 150 283 116 259 Z" fill="url(#${p}Gradient)" stroke="${mainColor}" stroke-width="1.2"/>
            <path d="M 76 91 Q 104 111 150 139 L 116 259 Z" fill="${lightColor}" opacity=".55"/>
            <path d="M 224 91 Q 196 111 150 139 L 184 259 Z" fill="${foldColor}" opacity=".5"/>
            <ellipse cx="150" cy="91" rx="74" ry="24" fill="${lightColor}" stroke="${foldColor}" stroke-width="1.5"/>
            <ellipse cx="150" cy="91" rx="59" ry="15" fill="#fffaf5" opacity=".65"/>
        `;
    }

    function wrapperFrontMarkup(colors) {
        const [mainColor, foldColor, lightColor, ribbonColor] = colors;
        return `
            <path d="M 76 91 Q 115 122 150 139 Q 185 122 224 91 L 184 259 Q 150 283 116 259 Z" fill="${mainColor}" opacity="1"/>
            <path d="M 76 91 Q 116 117 150 139" fill="none" stroke="#ffffff" stroke-width="2" opacity=".55"/>
            <path d="M 224 91 Q 184 117 150 139" fill="none" stroke="${foldColor}" stroke-width="2" opacity=".7"/>
            <path d="M 115 239 Q 150 248 185 239" fill="none" stroke="${ribbonColor}" stroke-width="5" stroke-linecap="round"/>
            <path d="M 150 242 C 125 218 110 230 123 246 Q 137 254 150 242" fill="${ribbonColor}" stroke="${foldColor}" stroke-width="1"/>
            <path d="M 150 242 C 175 218 190 230 177 246 Q 163 254 150 242" fill="${ribbonColor}" stroke="${foldColor}" stroke-width="1"/>
            <ellipse cx="150" cy="242" rx="6" ry="7" fill="${lightColor}" stroke="${ribbonColor}" stroke-width="1"/>
            <path d="M 145 247 Q 132 263 136 274 Q 147 268 150 248" fill="${ribbonColor}" opacity=".9"/>
            <path d="M 155 247 Q 168 263 164 274 Q 153 268 150 248" fill="${ribbonColor}" opacity=".9"/>
        `;
    }

    function makeWrapperDiv(colors, transformStr, zIndex, idPrefix, extraMarkup) {
        const div = document.createElement("div");
        div.style.position = "absolute";
        div.style.width = "min(78%, 300px)";
        div.style.aspectRatio = "300 / 310";
        div.style.transform = transformStr;
        div.style.transformOrigin = "center center";
        div.style.zIndex = String(zIndex);
        div.style.pointerEvents = "none";
        div.innerHTML = `
            <svg viewBox="0 0 300 310" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                ${wrapperBaseMarkup(colors, idPrefix)}
                ${extraMarkup || ""}
            </svg>
        `;
        return div;
    }

    function renderInto(container, recipe) {
        if (!container) return;
        container.innerHTML = "";

        if (!recipe || !Array.isArray(recipe.p)) {
            container.innerHTML =
                '<p class="bouquet-placeholder">Couldn\'t load this bouquet ♡</p>';
            return;
        }

        const cw = Number(recipe.cw) || 900;
        const ch = Number(recipe.ch) || 570;

        const stage = document.createElement("div");
        stage.style.position = "relative";
        stage.style.width = "100%";
        stage.style.maxWidth = `${Math.min(cw, 700)}px`;
        stage.style.aspectRatio = `${cw} / ${ch}`;
        stage.style.margin = "0 auto";
        stage.style.overflow = "hidden";
        stage.style.borderRadius = "14px";

        const wrapW = Math.min(cw * 0.78, 300);
        const unit = wrapW / 300;
        const colors = Array.isArray(recipe.c) && recipe.c.length >= 3
            ? recipe.c.map(hex => (String(hex).startsWith("#") ? String(hex) : `#${hex}`))
            : null;

        if (colors && Array.isArray(recipe.w)) {
            const [wx, wy, wRot, wScale] = recipe.w;
            const wTransform = `translate(-50%, -50%) rotate(${Number(wRot) || 0}deg) scale(${Number(wScale) || 1})`;

            const back = makeWrapperDiv(colors, wTransform, 1, "vb");
            back.style.left = `${Number(wx) || 50}%`;
            back.style.top = `${Number(wy) || 70}%`;
            stage.appendChild(back);

            const front = makeWrapperDiv(colors, wTransform, 5000, "vf", wrapperFrontMarkup(colors));
            front.style.left = `${Number(wx) || 50}%`;
            front.style.top = `${Number(wy) || 70}%`;
            stage.appendChild(front);
        }

        const names = Array.isArray(recipe.n) ? recipe.n : [];
        const baseSizes = { flower: 84, leaf: 130 };

        recipe.p.forEach((item, index) => {
            if (!Array.isArray(item) || item.length < 6) return;
            const [typeNum, nameIdx, x, y, rot, scale] = item;
            const pieceName = names[nameIdx] || "Pink Rose";
            const pieceType = typeNum === 1 ? "leaf" : "flower";
            const sc = Number(scale) || 1;
            const size = (baseSizes[pieceType] || 84) * sc * unit;

            const pieceEl = document.createElement("div");
            pieceEl.style.position = "absolute";
            pieceEl.style.left = `${Number(x) || 50}%`;
            pieceEl.style.top = `${Number(y) || 50}%`;
            pieceEl.style.width = `${size}px`;
            pieceEl.style.height = `${size}px`;
            pieceEl.style.transform = `translate(-50%, -50%) rotate(${Number(rot) || 0}deg)`;
            pieceEl.style.zIndex = String(10 + index);
            pieceEl.style.pointerEvents = "none";

            const img = document.createElement("img");
            img.alt = pieceName;
            img.style.width = "100%";
            img.style.height = "100%";
            img.style.display = "block";

            if (pieceType === "flower" && typeof FlowerArt !== "undefined") {
                img.src = FlowerArt.create(pieceName);
            } else if (pieceType === "leaf" && typeof LeafArt !== "undefined") {
                img.src = LeafArt.create(pieceName);
            }

            pieceEl.appendChild(img);
            stage.appendChild(pieceEl);
        });

        container.appendChild(stage);

        const note = document.createElement("div");
        note.className = "attached-note";

        const noteP = document.createElement("p");
        noteP.textContent = recipe.m || "A little happiness, just for you.";
        note.appendChild(noteP);

        container.appendChild(note);
    }

    global.BloomShare = {
        encode,
        decode,
        renderInto
    };
})(window);