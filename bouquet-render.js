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

    function bytesToBase64Url(bytes) {
        let binary = "";
        for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary)
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "");
    }

    function base64UrlToBytes(base64Url) {
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
        return bytes;
    }

    // The browser can squash text for us (built in, nothing to install)
    async function compress(text) {
        const stream = new Blob([new TextEncoder().encode(text)])
            .stream()
            .pipeThrough(new CompressionStream("deflate-raw"));
        return new Uint8Array(await new Response(stream).arrayBuffer());
    }

    async function decompress(bytes) {
        const stream = new Blob([bytes])
            .stream()
            .pipeThrough(new DecompressionStream("deflate-raw"));
        return new TextDecoder().decode(await new Response(stream).arrayBuffer());
    }

    // ==========================================
    // SHORT LINKS
    // A bouquet is packed into a few bytes. Flowers, leaves, wrappers and
    // notes are saved as list numbers instead of their full names.
    //
    // IMPORTANT: only ever ADD new items at the END of these lists.
    // Never reorder or delete items, or links that were already sent
    // would change. If something is not found in a list, the link is still
    // created (the older, longer way), so nothing ever breaks.
    // ==========================================

    const FLOWER_LIST = [
        "Pink Rose", "Red Rose", "White Rose", "Yellow Rose",
        "Peach Rose", "Lavender Rose", "Garden Rose", "English Rose",
        "Coral Rose", "Champagne Rose",

        "Pink Tulip", "Red Tulip", "White Tulip", "Yellow Tulip",
        "Purple Tulip", "Orange Tulip", "Peach Tulip", "Parrot Tulip",
        "Double Tulip", "Fringed Tulip",

        "White Daisy", "Pink Daisy", "Yellow Daisy", "Gerbera Daisy",
        "African Daisy", "Blue Daisy", "Shasta Daisy", "Oxeye Daisy",
        "Painted Daisy", "Swan River Daisy",

        "White Lily", "Pink Lily", "Tiger Lily", "Stargazer Lily",
        "Asiatic Lily", "Oriental Lily", "Calla Lily", "Water Lily",
        "Casa Blanca Lily", "Orange Lily",

        "Pink Peony", "White Peony", "Coral Peony", "Red Peony",
        "Sarah Bernhardt Peony", "Coral Charm Peony", "Bowl of Beauty Peony",
        "Festiva Maxima Peony", "Yellow Peony", "Purple Peony",

        "Pink Orchid", "White Orchid", "Purple Orchid", "Blue Orchid",
        "Moth Orchid", "Dancing Lady Orchid", "Cattleya Orchid",
        "Vanilla Orchid", "Vanda Orchid", "Dendrobium Orchid",

        "Classic Sunflower", "Mini Sunflower", "Red Sunflower",
        "Teddy Bear Sunflower", "Lemon Queen Sunflower",
        "Autumn Beauty Sunflower", "Strawberry Blonde Sunflower",
        "Chocolate Sunflower", "White Sunflower", "Velvet Queen Sunflower",

        "Pink Carnation", "Red Carnation", "White Carnation",
        "Yellow Carnation", "Purple Carnation", "Peach Carnation",
        "Striped Carnation", "Green Carnation", "Mini Carnation",
        "Chabaud Carnation",

        "Pink Dahlia", "White Dahlia", "Red Dahlia", "Purple Dahlia",
        "Cafe au Lait Dahlia", "Dinnerplate Dahlia",
        "Ball Dahlia", "Pompon Dahlia", "Cactus Dahlia", "Yellow Dahlia",

        "Lavender", "Bluebell", "Poppy", "Cosmos",
        "Forget Me Not", "Cornflower", "Buttercup",
        "Anemone", "Sweet Pea", "Baby's Breath"
    ];

    const LEAF_LIST = [
        "Silver Dollar Eucalyptus", "Baby Blue Eucalyptus", "Willow Eucalyptus",
        "Seeded Eucalyptus", "Gunnii Eucalyptus", "Spiral Eucalyptus",
        "Parvifolia Eucalyptus", "Cinerea Eucalyptus", "Nicholii Eucalyptus",
        "Populus Eucalyptus",

        "Boston Fern", "Maidenhair Fern", "Asparagus Fern", "Leatherleaf Fern",
        "Bird's Nest Fern", "Sword Fern", "Lace Fern", "Staghorn Fern",
        "Button Fern", "Holly Fern",

        "Olive Branch", "Ruscus", "Italian Ruscus", "Myrtle Branch",
        "Pistachio Foliage", "Pittosporum", "Bay Laurel", "Rosemary",
        "Boxwood", "Cypress Branch",

        "Monstera Leaf", "Palm Leaf", "Areca Palm", "Fan Palm",
        "Philodendron Leaf", "Calathea Leaf", "Banana Leaf",
        "Bird of Paradise Leaf", "Fiddle Leaf Fig", "Alocasia Leaf",

        "Ivy", "Salal Leaves", "Lamb's Ear", "Dusty Miller", "Smilax Vine",
        "Ginkgo Leaf", "Mint Sprig", "Oak Leaf", "Lily Grass", "Coleus Leaf"
    ];

    // The 10 wrappers (4 colours each, same order as bouquet.js)
    const WRAPPER_LIST = [
        ["d98f9b", "efb5b5", "f4d0c9", "c77983"],
        ["9c83b8", "c1a6d2", "e0c9e4", "846b9e"],
        ["e99c80", "f3bd9e", "f6d6b8", "d77e70"],
        ["a94e59", "c66c76", "e5a0a0", "843d4a"],
        ["e8bd65", "f3d88f", "f8e8bd", "d99d4f"],
        ["e9dfc9", "f7f0df", "d8cbb9", "fff8e9"],
        ["88a9c9", "abc5dc", "d2dfeb", "778eb4"],
        ["e5a7b7", "b8a4cf", "f0c5a7", "a9c5ae"],
        ["e57f70", "f0a18a", "f5c1a2", "c96d69"],
        ["d98ca2", "e7bd75", "a8a1c9", "d99b80"]
    ];

    // The 50 notes (same order as message.js)
    const NOTE_LIST = [
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

    // Leaves are numbered from 128 upwards, flowers from 0 (room to grow)
    const LEAF_START = 128;

    function normalizeColors(list) {
        return list
            .map(hex => String(hex).replace("#", "").toLowerCase())
            .join(",");
    }

    const WRAPPER_KEYS = WRAPPER_LIST.map(normalizeColors);

    // Writes numbers into as few bits as possible
    function BitWriter() {
        const bytes = [];
        let current = 0;
        let used = 0;

        return {
            write(value, bits) {
                for (let i = bits - 1; i >= 0; i--) {
                    current = (current << 1) | ((value >> i) & 1);
                    used++;

                    if (used === 8) {
                        bytes.push(current);
                        current = 0;
                        used = 0;
                    }
                }
            },

            finish() {
                if (used > 0) bytes.push(current << (8 - used));
                return new Uint8Array(bytes);
            }
        };
    }

    function BitReader(bytes) {
        let pos = 0;

        return {
            read(bits) {
                let value = 0;

                for (let i = 0; i < bits; i++) {
                    const byte = bytes[pos >> 3];
                    if (byte === undefined) throw new Error("link is too short");

                    value = (value << 1) | ((byte >> (7 - (pos & 7))) & 1);
                    pos++;
                }

                return value;
            }
        };
    }

    // A whole number from a value, or null if it does not fit
    function toWhole(value, times, max) {
        const n = Math.round(Number(value) * times);
        return Number.isFinite(n) && n >= 0 && n <= max ? n : null;
    }

    // 370 degrees looks exactly like 10 degrees, so keep 0 to 359
    function wholeTurn(degrees) {
        const n = Math.round(Number(degrees) || 0);
        return ((n % 360) + 360) % 360;
    }

    // Recipe -> bytes. Returns null if anything is not in the lists.
    function packRecipe(recipe) {
        try {
            if (!recipe || !Array.isArray(recipe.p) || recipe.p.length > 255) {
                return null;
            }

            const cw = toWhole(recipe.cw, 1, 4095);
            const ch = toWhole(recipe.ch, 1, 4095);
            const note = NOTE_LIST.indexOf(recipe.m);

            if (cw === null || ch === null || note === -1 || note > 63) {
                return null;
            }

            const out = BitWriter();
            out.write(2, 4);
            out.write(cw, 12);
            out.write(ch, 12);

            if (Array.isArray(recipe.c) && Array.isArray(recipe.w)) {
                const id = WRAPPER_KEYS.indexOf(normalizeColors(recipe.c));
                const wx = toWhole(recipe.w[0], 10, 1000);
                const wy = toWhole(recipe.w[1], 10, 1000);
                const ws = toWhole(recipe.w[3], 100, 511);

                if (id === -1 || wx === null || wy === null || ws === null) {
                    return null;
                }

                out.write(1, 1);
                out.write(id, 4);
                out.write(wx, 10);
                out.write(wy, 10);
                out.write(wholeTurn(recipe.w[2]), 9);
                out.write(ws, 9);
            } else {
                out.write(0, 1);
            }

            out.write(note, 6);
            out.write(recipe.p.length, 8);

            const names = Array.isArray(recipe.n) ? recipe.n : [];

            for (const item of recipe.p) {
                if (!Array.isArray(item) || item.length < 6) return null;

                const isLeaf = item[0] === 1;
                const found = (isLeaf ? LEAF_LIST : FLOWER_LIST)
                    .indexOf(names[item[1]]);

                if (found === -1 || found >= LEAF_START) return null;

                const x = toWhole(item[2], 10, 1000);
                const y = toWhole(item[3], 10, 1000);
                const scale = toWhole(item[5], 100, 511);

                if (x === null || y === null || scale === null) return null;

                out.write(isLeaf ? LEAF_START + found : found, 8);
                out.write(x, 10);
                out.write(y, 10);
                out.write(wholeTurn(item[4]), 9);
                out.write(scale, 9);
            }

            return out.finish();
        } catch (err) {
            return null;
        }
    }

    // Bytes -> recipe (the same kind of recipe renderInto already understands)
    function unpackRecipe(bytes) {
        const r = BitReader(bytes);

        if (r.read(4) !== 2) throw new Error("unknown link type");

        const cw = r.read(12);
        const ch = r.read(12);

        let c = null;
        let w = null;

        if (r.read(1) === 1) {
            const colors = WRAPPER_LIST[r.read(4)];
            if (!colors) throw new Error("unknown wrapper");

            c = colors.slice();

            const wx = r.read(10) / 10;
            const wy = r.read(10) / 10;
            const wr = r.read(9);
            const ws = r.read(9) / 100;

            w = [wx, wy, wr, ws];
        }

        const m = NOTE_LIST[r.read(6)];
        if (m === undefined) throw new Error("unknown note");

        const count = r.read(8);
        const names = [];
        const p = [];

        for (let i = 0; i < count; i++) {
            const code = r.read(8);
            const isLeaf = code >= LEAF_START;
            const name = isLeaf
                ? LEAF_LIST[code - LEAF_START]
                : FLOWER_LIST[code];

            if (name === undefined) throw new Error("unknown flower or leaf");

            let nameIndex = names.indexOf(name);

            if (nameIndex === -1) {
                names.push(name);
                nameIndex = names.length - 1;
            }

            const x = r.read(10) / 10;
            const y = r.read(10) / 10;
            const rot = r.read(9);
            const scale = r.read(9) / 100;

            p.push([isLeaf ? 1 : 0, nameIndex, x, y, rot, scale]);
        }

        return { v: 1, cw, ch, c, w, n: names, p, m };
    }


    // New links start with "p." (packed). Older links ("z." squashed, or
    // plain) still open fine.
    async function encode(recipe) {
        const packed = packRecipe(recipe);

        if (packed) {
            return "p." + bytesToBase64Url(packed);
        }

        const json = JSON.stringify(recipe);

        if (typeof CompressionStream === "undefined") {
            return toBase64Url(json);
        }

        try {
            return "z." + bytesToBase64Url(await compress(json));
        } catch (err) {
            return toBase64Url(json);
        }
    }

    async function decode(code) {
        if (!code) return null;

        try {
            const text = String(code);

            if (text.startsWith("p.")) {
                return unpackRecipe(base64UrlToBytes(text.slice(2)));
            }

            if (text.startsWith("z.")) {
                if (typeof DecompressionStream === "undefined") return null;
                return JSON.parse(await decompress(base64UrlToBytes(text.slice(2))));
            }

            return JSON.parse(fromBase64Url(text));
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
