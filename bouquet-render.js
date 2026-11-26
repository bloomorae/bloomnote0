(function (global) {

    // ==========================================
    // LINK ENCODING (unchanged, old links still work)
    // ==========================================

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


    // ==========================================
    // WRAPPER ARTWORK
    // (exact copy of the artwork in arrangement.js)
    // ==========================================

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
                <filter id="${p}Texture">
                    <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" seed="4"/>
                    <feColorMatrix type="saturate" values="0"/>
                    <feComponentTransfer>
                        <feFuncA type="table" tableValues="0 0.08"/>
                    </feComponentTransfer>
                </filter>
            </defs>
            <path d="M 60 95 Q 150 60 240 95 L 190 267 Q 150 292 110 267 Z" fill="#a88b80" opacity=".16" filter="url(#${p}Shadow)"/>
            <path d="M 72 91 Q 54 72 83 53 Q 117 75 150 82 Q 185 72 218 53 Q 246 73 228 96 L 188 253 Q 150 274 112 253 Z" fill="${foldColor}" opacity=".85"/>
            <path d="M 76 91 Q 150 65 224 91 L 184 259 Q 150 283 116 259 Z" fill="url(#${p}Gradient)" stroke="${mainColor}" stroke-width="1.2"/>
            <path d="M 76 91 Q 104 111 150 139 L 116 259 Z" fill="${lightColor}" opacity=".55"/>
            <path d="M 224 91 Q 196 111 150 139 L 184 259 Z" fill="${foldColor}" opacity=".5"/>
            <path d="M 76 91 Q 150 65 224 91 L 184 259 Q 150 283 116 259 Z" filter="url(#${p}Texture)" opacity=".45"/>
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

    // One wrapper layer (back or front)
    function makeWrapperDiv(wrapW, wrapH, transformStr, zIndex, markup) {
        const div = document.createElement("div");
        div.style.position = "absolute";
        div.style.width = `${wrapW}px`;
        div.style.height = `${wrapH}px`;
        div.style.transform = transformStr;
        div.style.transformOrigin = "center center";
        div.style.zIndex = String(zIndex);
        div.style.pointerEvents = "none";

        div.innerHTML = `
            <svg viewBox="0 0 300 310" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                ${markup}
            </svg>
        `;

        return div;
    }


    // ==========================================
    // CROP + FIT (same maths as the editor's snapshot)
    // ==========================================

    // Corners of a rotated box -> the smallest box that holds it
    function rotatedBounds(cx, cy, width, height, degrees) {
        const angle = (degrees * Math.PI) / 180;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const halfW = width / 2;
        const halfH = height / 2;

        const xs = [];
        const ys = [];

        [[-halfW, -halfH], [halfW, -halfH], [halfW, halfH], [-halfW, halfH]]
            .forEach(([px, py]) => {
                xs.push(cx + px * cos - py * sin);
                ys.push(cy + px * sin + py * cos);
            });

        return {
            left: Math.min(...xs),
            right: Math.max(...xs),
            top: Math.min(...ys),
            bottom: Math.max(...ys)
        };
    }

    function fitSnapshot(container, frame, scene, width, height, offsetX, offsetY) {
        const maxHeight = 520;
        const available = Math.max(container.clientWidth - 52, 240);
        const scale = Math.min(available / width, maxHeight / height, 1.6);

        frame.style.width = `${width * scale}px`;
        frame.style.height = `${height * scale}px`;
        scene.style.transformOrigin = "0 0";
        scene.style.transform = `scale(${scale}) translate(${-offsetX}px, ${-offsetY}px)`;
    }


    // ==========================================
    // DRAW THE BOUQUET FROM A RECIPE
    // ==========================================

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

        const frame = document.createElement("div");
        frame.className = "bq-snapshot";
        frame.style.position = "relative";
        frame.style.overflow = "hidden";

        // the scene is the same size as the editor's canvas was
        const scene = document.createElement("div");
        scene.className = "bq-scene";
        scene.style.position = "absolute";
        scene.style.left = "0";
        scene.style.top = "0";
        scene.style.width = `${cw}px`;
        scene.style.height = `${ch}px`;

        // same sizing rules as arrangement.js
        const wrapW = Math.min(cw * 0.78, 300);
        const wrapH = wrapW * (310 / 300);
        const unit = wrapW / 300;
        const baseSizes = { flower: 84, leaf: 130 };

        let left = Infinity;
        let top = Infinity;
        let right = -Infinity;
        let bottom = -Infinity;

        function grow(b) {
            left = Math.min(left, b.left);
            top = Math.min(top, b.top);
            right = Math.max(right, b.right);
            bottom = Math.max(bottom, b.bottom);
        }

        const colors = Array.isArray(recipe.c) && recipe.c.length >= 3
            ? recipe.c.map(hex => (String(hex).startsWith("#") ? String(hex) : `#${hex}`))
            : null;

        // ----- wrapper (back layer under everything, front layer over everything)
        if (colors && Array.isArray(recipe.w)) {
            const [wx, wy, wRot, wScale] = recipe.w;
            const rot = Number(wRot) || 0;
            const wSc = Number(wScale) || 1;
            const transform = `translate(-50%, -50%) rotate(${rot}deg) scale(${wSc})`;
            const cx = ((Number(wx) || 50) / 100) * cw;
            const cy = ((Number(wy) || 70) / 100) * ch;

            // the visible paper (same box the editor uses)
            const k = unit * wSc;
            const angle = (rot * Math.PI) / 180;
            const offset = 20 * k;
            grow(rotatedBounds(
                cx - Math.sin(angle) * offset,
                cy + Math.cos(angle) * offset,
                204 * k, 246 * k, rot
            ));

            const back = makeWrapperDiv(wrapW, wrapH, transform, 1, wrapperBaseMarkup(colors, "vb"));
            back.style.left = `${cx}px`;
            back.style.top = `${cy}px`;
            scene.appendChild(back);

            const front = makeWrapperDiv(wrapW, wrapH, transform, 5000, wrapperFrontMarkup(colors));
            front.style.left = `${cx}px`;
            front.style.top = `${cy}px`;
            scene.appendChild(front);
        }

        // ----- flowers and leaves (array order = layer order, like the editor)
        const names = Array.isArray(recipe.n) ? recipe.n : [];

        recipe.p.forEach((item, index) => {
            if (!Array.isArray(item) || item.length < 6) return;

            const [typeNum, nameIdx, x, y, rot, scale] = item;
            const pieceName = names[nameIdx] || "Pink Rose";
            const pieceType = typeNum === 1 ? "leaf" : "flower";
            const sc = Number(scale) || 1;
            const rotation = Number(rot) || 0;
            const size = (baseSizes[pieceType] || 84) * sc * unit;
            const cx = ((Number(x) || 50) / 100) * cw;
            const cy = ((Number(y) || 50) / 100) * ch;

            grow(rotatedBounds(cx, cy, size * 0.92, size * 0.92, rotation));

            const pieceEl = document.createElement("div");
            pieceEl.style.position = "absolute";
            pieceEl.style.left = `${cx}px`;
            pieceEl.style.top = `${cy}px`;
            pieceEl.style.width = `${size}px`;
            pieceEl.style.height = `${size}px`;
            pieceEl.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
            pieceEl.style.zIndex = String(10 + index);
            pieceEl.style.pointerEvents = "none";

            const img = document.createElement("img");
            img.alt = pieceName;
            img.draggable = false;
            img.style.width = "100%";
            img.style.height = "100%";
            img.style.display = "block";

            if (pieceType === "flower" && typeof FlowerArt !== "undefined") {
                img.src = FlowerArt.create(pieceName);
            } else if (pieceType === "leaf" && typeof LeafArt !== "undefined") {
                img.src = LeafArt.create(pieceName);
            }

            pieceEl.appendChild(img);
            scene.appendChild(pieceEl);
        });

        // ----- crop around the bouquet (same padding as the editor)
        if (!Number.isFinite(left)) {
            left = 0;
            top = 0;
            right = cw;
            bottom = ch;
        } else {
            const pad = 14;
            left = Math.max(0, left - pad);
            top = Math.max(0, top - pad);
            right = Math.min(cw, right + pad);
            bottom = Math.min(ch, bottom + pad);
        }

        const offsetX = Math.round(left);
        const offsetY = Math.round(top);
        const cropW = Math.max(1, Math.round(right - left));
        const cropH = Math.max(1, Math.round(bottom - top));

        frame.appendChild(scene);
        container.appendChild(frame);

        // ----- the note
        const note = document.createElement("div");
        note.className = "attached-note";

        const noteP = document.createElement("p");
        noteP.textContent = recipe.m || "A little happiness, just for you.";
        note.appendChild(noteP);

        container.appendChild(note);

        const applyFit = () =>
            fitSnapshot(container, frame, scene, cropW, cropH, offsetX, offsetY);

        applyFit();
        window.addEventListener("resize", applyFit);
    }

    global.BloomShare = {
        encode,
        decode,
        renderInto
    };

})(window);
