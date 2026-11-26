// ==========================================
// FLOWER DRAWINGS
// (the same watercolour flowers as the collection page,
//  drawn by code from the names you chose)
// ==========================================

const FlowerArt = (() => {

    const flowerGroups = {
        "Roses": [
            "Pink Rose", "Red Rose", "White Rose", "Yellow Rose",
            "Peach Rose", "Lavender Rose", "Garden Rose", "English Rose",
            "Coral Rose", "Champagne Rose"
        ],

        "Tulips": [
            "Pink Tulip", "Red Tulip", "White Tulip", "Yellow Tulip",
            "Purple Tulip", "Orange Tulip", "Peach Tulip", "Parrot Tulip",
            "Double Tulip", "Fringed Tulip"
        ],

        "Daisies": [
            "White Daisy", "Pink Daisy", "Yellow Daisy", "Gerbera Daisy",
            "African Daisy", "Blue Daisy", "Shasta Daisy", "Oxeye Daisy",
            "Painted Daisy", "Swan River Daisy"
        ],

        "Lilies": [
            "White Lily", "Pink Lily", "Tiger Lily", "Stargazer Lily",
            "Asiatic Lily", "Oriental Lily", "Calla Lily", "Water Lily",
            "Casa Blanca Lily", "Orange Lily"
        ],

        "Peonies": [
            "Pink Peony", "White Peony", "Coral Peony", "Red Peony",
            "Sarah Bernhardt Peony", "Coral Charm Peony", "Bowl of Beauty Peony",
            "Festiva Maxima Peony", "Yellow Peony", "Purple Peony"
        ],

        "Orchids": [
            "Pink Orchid", "White Orchid", "Purple Orchid", "Blue Orchid",
            "Moth Orchid", "Dancing Lady Orchid", "Cattleya Orchid",
            "Vanilla Orchid", "Vanda Orchid", "Dendrobium Orchid"
        ],

        "Sunflowers": [
            "Classic Sunflower", "Mini Sunflower", "Red Sunflower",
            "Teddy Bear Sunflower", "Lemon Queen Sunflower",
            "Autumn Beauty Sunflower", "Strawberry Blonde Sunflower",
            "Chocolate Sunflower", "White Sunflower", "Velvet Queen Sunflower"
        ],

        "Carnations": [
            "Pink Carnation", "Red Carnation", "White Carnation",
            "Yellow Carnation", "Purple Carnation", "Peach Carnation",
            "Striped Carnation", "Green Carnation", "Mini Carnation",
            "Chabaud Carnation"
        ],

        "Dahlias": [
            "Pink Dahlia", "White Dahlia", "Red Dahlia", "Purple Dahlia",
            "Cafe au Lait Dahlia", "Dinnerplate Dahlia",
            "Ball Dahlia", "Pompon Dahlia", "Cactus Dahlia", "Yellow Dahlia"
        ],

        "Wildflowers": [
            "Lavender", "Bluebell", "Poppy", "Cosmos",
            "Forget Me Not", "Cornflower", "Buttercup",
            "Anemone", "Sweet Pea", "Baby's Breath"
        ]
    };

    const categoryByName = {};

    Object.entries(flowerGroups).forEach(([category, names]) => {
        names.forEach(name => { categoryByName[name] = category; });
    });

    // =====================================================================
    // FLOWER ARTWORK  (every flower is drawn by code - no image files needed)
    // =====================================================================

    // Palettes are [middle, light, dark]
    const colourPalettes = {
        pink: ["#e9a6b5", "#f4c1c9", "#d989a0"],
        red: ["#bd5266", "#df8490", "#a83e55"],
        white: ["#f5e9df", "#fff5e9", "#e8d8d2"],
        yellow: ["#e9c66e", "#f5dfa0", "#d9ae4f"],
        peach: ["#edaa91", "#f6c7ae", "#df8f7e"],
        lavender: ["#b9a1ce", "#d7c3e5", "#a58abb"],
        purple: ["#9875b5", "#c2a3d7", "#80609f"],
        blue: ["#91b7d1", "#bed7e7", "#729bbd"],
        orange: ["#e79b62", "#f2bd88", "#cf7849"],
        coral: ["#e78c83", "#f3b1a2", "#d77477"],
        green: ["#9cb78d", "#c3d0a5", "#78966e"],
        brown: ["#b58b72", "#d0ad91", "#95715e"],
        cream: ["#efdcb9", "#faf0dc", "#d4bc92"],
        champagne: ["#e8c9ad", "#f6e3d0", "#cfa588"],
        lemon: ["#efe08a", "#f8f0be", "#d6c35f"],
        magenta: ["#cf5b95", "#e891b9", "#a8407a"],
        deepred: ["#8c2b3d", "#b45468", "#661c2c"],
        gold: ["#e8b84a", "#f5d77f", "#c98f2b"]
    };

    // Centre discs are [light, middle, dark]
    const centrePalettes = {
        gold: ["#f9e7a9", "#e0b24d", "#b9822c"],
        orange: ["#f6c36b", "#e08b2f", "#b35f1e"],
        dark: ["#6b4a33", "#3f2a1c", "#25160d"],
        green: ["#d5de9a", "#a9b865", "#7d8f45"],
        navy: ["#7a74ae", "#3b3568", "#221d44"]
    };

    const categoryColours = {
        "Roses": "pink",
        "Tulips": "peach",
        "Daisies": "yellow",
        "Lilies": "white",
        "Peonies": "pink",
        "Orchids": "purple",
        "Sunflowers": "yellow",
        "Carnations": "coral",
        "Dahlias": "pink",
        "Wildflowers": "lavender"
    };

    // Specific flower names that need a particular colour (checked first)
    const nameColourRules = [
        ["strawberry", "coral"], ["autumn", "orange"], ["lemon", "lemon"],
        ["velvet", "deepred"], ["cafe au lait", "champagne"], ["champagne", "champagne"],
        ["teddy", "gold"], ["tiger", "orange"], ["stargazer", "pink"],
        ["casa blanca", "white"], ["calla", "white"], ["festiva", "white"],
        ["water lily", "pink"], ["sarah bernhardt", "pink"], ["bowl of beauty", "pink"],
        ["moth", "white"], ["dancing", "yellow"], ["cattleya", "magenta"],
        ["vanilla", "cream"], ["vanda", "purple"], ["dendrobium", "lavender"],
        ["english", "peach"], ["garden", "magenta"], ["parrot", "magenta"],
        ["fringed", "pink"], ["pompon", "magenta"], ["cactus", "coral"],
        ["dinnerplate", "peach"], ["ball", "orange"], ["chabaud", "coral"],
        ["striped", "pink"], ["gerbera", "coral"], ["african", "purple"],
        ["swan", "lavender"], ["shasta", "white"], ["oxeye", "white"],
        ["painted", "coral"], ["bluebell", "blue"], ["poppy", "red"],
        ["cosmos", "magenta"], ["forget", "blue"], ["cornflower", "blue"],
        ["buttercup", "yellow"], ["anemone", "purple"], ["sweet pea", "pink"],
        ["baby", "white"], ["lavender", "lavender"]
    ];

    const colourWords = [
        "pink", "red", "white", "yellow", "peach", "lavender", "purple",
        "blue", "orange", "coral", "green", "chocolate"
    ];

    function getPaletteName(flower) {
        const name = flower.name.toLowerCase();

        for (const [key, palette] of nameColourRules) {
            if (name.includes(key)) return palette;
        }

        for (const word of colourWords) {
            if (new RegExp("\\b" + word + "\\b").test(name)) {
                return word === "chocolate" ? "brown" : word;
            }
        }

        return categoryColours[flower.category] || "pink";
    }

    function getFlowerColours(flower) {
        return colourPalettes[getPaletteName(flower)];
    }


    // ---------- small helpers ----------
    const n1 = v => v.toFixed(1);

    function hashString(str) {
        let h = 2166136261;
        for (let i = 0; i < str.length; i++) {
            h ^= str.charCodeAt(i);
            h = Math.imul(h, 16777619);
        }
        return h >>> 0;
    }

    // Seeded random numbers: same flower name = same flower every time
    function makeRandom(seed) {
        let a = seed;
        return function () {
            a |= 0;
            a = (a + 0x6D2B79F5) | 0;
            let t = Math.imul(a ^ (a >>> 15), 1 | a);
            t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }

    function hexToRgb(hex) {
        const n = parseInt(hex.slice(1), 16);
        return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    }

    function mix(a, b, t) {
        const A = hexToRgb(a), B = hexToRgb(b);
        return "#" + A.map((v, i) =>
            Math.round(v + (B[i] - v) * t).toString(16).padStart(2, "0")
        ).join("");
    }

    // Everything one flower needs while it is being drawn
    function createContext(flower) {
        const rand = makeRandom(hashString(flower.name));
        const base = getFlowerColours(flower);

        // tiny colour shift so similar flowers are never identical
        const shift = (rand() - 0.5) * 0.22;
        const pal = base.map(c => mix(c, shift > 0 ? "#ffffff" : "#000000", Math.abs(shift)));

        const defs = [];
        const cache = {};
        let uid = 0;

        const x = {
            name: flower.name.toLowerCase(),
            category: flower.category,
            pal,
            defs,
            rr: (a, b) => a + rand() * (b - a),
            ri: (a, b) => Math.floor(a + rand() * (b - a + 1)),
            id: () => "i" + uid++,
            edgeOf: p => mix(p[2], "#6a4a4a", 0.35)
        };

        // Watercolour petal fill: deeper pigment at the base, light at the tip
        x.fill = (level = 0, p = pal) => {
            const key = p[0] + p[1] + p[2] + level;
            if (!cache[key]) {
                const id = x.id();
                const k = Math.min(level * 0.09, 0.5);
                const mid = mix(p[0], p[2], k);
                const light = mix(p[1], p[0], k);
                const dark = mix(p[0], p[2], 0.5 + k);
                defs.push(
                    `<radialGradient id="${id}" cx="50%" cy="100%" r="105%">` +
                    `<stop offset="0%" stop-color="${dark}"/>` +
                    `<stop offset="35%" stop-color="${mid}"/>` +
                    `<stop offset="100%" stop-color="${light}"/>` +
                    `</radialGradient>`
                );
                cache[key] = `url(#${id})`;
            }
            return cache[key];
        };

        return x;
    }


    // ---------- petal shapes ----------
    // A petal points straight up from (0,0)
    function petalShape(L, W, tip) {
        if (tip === "point") {
            return `M0,0 C${n1(-W)},${n1(-L * 0.25)} ${n1(-W * 0.9)},${n1(-L * 0.7)} 0,${n1(-L)} ` +
                   `C${n1(W * 0.9)},${n1(-L * 0.7)} ${n1(W)},${n1(-L * 0.25)} 0,0Z`;
        }

        if (tip === "notch") {
            return `M0,0 C${n1(-W)},${n1(-L * 0.25)} ${n1(-W * 1.1)},${n1(-L * 0.8)} ${n1(-W * 0.45)},${n1(-L)} ` +
                   `L0,${n1(-L * 0.88)} L${n1(W * 0.45)},${n1(-L)} ` +
                   `C${n1(W * 1.1)},${n1(-L * 0.8)} ${n1(W)},${n1(-L * 0.25)} 0,0Z`;
        }

        if (tip === "frill" || tip === "serrate") {
            const teeth = tip === "frill" ? 5 : 8;
            const half = W * 0.95;
            let d = `M0,0 C${n1(-W * 1.05)},${n1(-L * 0.3)} ${n1(-W * 1.15)},${n1(-L * 0.7)} ${n1(-half)},${n1(-L * 0.9)}`;

            for (let i = 0; i < teeth; i++) {
                const x0 = -half + (2 * half * i) / teeth;
                const x1 = -half + (2 * half * (i + 1)) / teeth;
                const mid = (x0 + x1) / 2;

                d += tip === "frill"
                    ? ` Q${n1(mid)},${n1(-L * 1.14)} ${n1(x1)},${n1(-L * 0.92)}`
                    : ` L${n1(mid)},${n1(-L * 1.05)} L${n1(x1)},${n1(-L * 0.9)}`;
            }

            d += ` C${n1(W * 1.15)},${n1(-L * 0.7)} ${n1(W * 1.05)},${n1(-L * 0.3)} 0,0Z`;
            return d;
        }

        // round
        return `M0,0 C${n1(-W * 1.1)},${n1(-L * 0.2)} ${n1(-W * 1.25)},${n1(-L * 0.95)} 0,${n1(-L)} ` +
               `C${n1(W * 1.25)},${n1(-L * 0.95)} ${n1(W * 1.1)},${n1(-L * 0.2)} 0,0Z`;
    }

    function petal(cx, cy, angle, L, W, tip, fill, edge, vein, extra) {
        const veinPath = vein
            ? `<path d="M0,${n1(-L * 0.1)} Q${n1(W * 0.12)},${n1(-L * 0.5)} 0,${n1(-L * 0.82)}" ` +
              `fill="none" stroke="${edge}" stroke-opacity="0.28" stroke-width="0.7"/>`
            : "";

        const shine =
            `<ellipse cx="${n1(-W * 0.15)}" cy="${n1(-L * 0.68)}" rx="${n1(W * 0.3)}" ry="${n1(L * 0.14)}" ` +
            `fill="#ffffff" opacity="0.2"/>`;

        return `<g transform="translate(${n1(cx)} ${n1(cy)}) rotate(${n1(angle)})">` +
               `<path d="${petalShape(L, W, tip)}" fill="${fill}" stroke="${edge}" stroke-opacity="0.5" stroke-width="0.8"/>` +
               `${shine}${veinPath}${extra || ""}</g>`;
    }

    // A ring of petals around a centre point
    function ring(x, o) {
        const p = o.pal || x.pal;
        const jitter = o.jitter === undefined ? 6 : o.jitter;
        let s = "";

        for (let i = 0; i < o.count; i++) {
            const angle = (o.offset || 0) + (i * 360) / o.count + x.rr(-jitter, jitter);
            const L = o.L * x.rr(0.94, 1.06);
            const W = o.W * x.rr(0.92, 1.08);
            const pp = o.alt && i % 2 ? o.alt : p;

            s += petal(
                o.cx === undefined ? 100 : o.cx,
                o.cy === undefined ? 100 : o.cy,
                angle, L, W, o.tip || "round",
                x.fill(o.level || 0, pp), x.edgeOf(pp),
                o.vein !== false,
                o.extra ? o.extra(L, W) : ""
            );
        }

        return s;
    }

    // Rings of petals from big (outside) to small (inside): roses, peonies, dahlias...
    function layeredFlower(x, o) {
        let s = "";

        for (let k = 0; k < o.layers; k++) {
            const t = o.layers === 1 ? 0 : k / (o.layers - 1);
            const L = o.outer - t * (o.outer - o.inner);
            const count = Math.max(
                4,
                Math.round(o.countOuter - t * (o.countOuter - o.countInner) + x.rr(-0.6, 0.6))
            );

            s += ring(x, {
                count, L, W: L * o.width, tip: o.tip,
                offset: x.rr(0, 360), level: k, jitter: o.jitter === undefined ? 8 : o.jitter,
                alt: o.alt, vein: o.vein
            });
        }

        return s;
    }

    function spiral(x, r, turns, stroke) {
        const steps = 60;
        const rot = x.rr(0, Math.PI * 2);
        let d = "";

        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const a = rot + t * turns * Math.PI * 2;
            const rad = 1 + t * r;
            d += (i ? "L" : "M") + n1(100 + Math.cos(a) * rad) + "," + n1(100 + Math.sin(a) * rad) + " ";
        }

        return `<path d="${d}" fill="none" stroke="${stroke}" stroke-opacity="0.55" stroke-width="1.2" stroke-linecap="round"/>`;
    }

    // Round seed-head / centre with a spiral of tiny dots
    function discCentre(x, r, type, cx = 100, cy = 100) {
        const c = centrePalettes[type];
        const id = x.id();

        x.defs.push(
            `<radialGradient id="${id}" cx="40%" cy="35%" r="75%">` +
            `<stop offset="0%" stop-color="${c[0]}"/>` +
            `<stop offset="60%" stop-color="${c[1]}"/>` +
            `<stop offset="100%" stop-color="${c[2]}"/>` +
            `</radialGradient>`
        );

        let s = `<circle cx="${n1(cx)}" cy="${n1(cy)}" r="${n1(r)}" fill="url(#${id})" ` +
                `stroke="${c[2]}" stroke-opacity="0.6" stroke-width="0.8"/>`;

        const n = Math.round(r * 1.6);

        for (let i = 1; i <= n; i++) {
            const a = i * 2.39996;
            const d = r * 0.92 * Math.sqrt(i / n);

            s += `<circle cx="${n1(cx + Math.cos(a) * d)}" cy="${n1(cy + Math.sin(a) * d)}" ` +
                 `r="${n1(r * 0.055 + 0.5)}" fill="${i % 2 ? c[0] : c[2]}" opacity="0.55"/>`;
        }

        return s;
    }

    function speckles(x, L, W, count, colour) {
        let s = "";

        for (let i = 0; i < count; i++) {
            s += `<circle cx="${n1(x.rr(-W * 0.6, W * 0.6))}" cy="${n1(-x.rr(L * 0.12, L * 0.85))}" ` +
                 `r="${n1(x.rr(0.7, 1.5))}" fill="${colour}" opacity="0.55"/>`;
        }

        return s;
    }

    function stamens(x, count, inner, outer, colour, dot) {
        let s = "";
        const start = x.rr(0, 360);

        for (let i = 0; i < count; i++) {
            const a = ((start + (i * 360) / count + x.rr(-6, 6)) * Math.PI) / 180;
            const len = x.rr(inner, outer);
            const px = 100 + Math.sin(a) * len;
            const py = 100 - Math.cos(a) * len;

            s += `<line x1="100" y1="100" x2="${n1(px)}" y2="${n1(py)}" stroke="${colour}" stroke-opacity="0.7" stroke-width="0.9"/>` +
                 `<circle cx="${n1(px)}" cy="${n1(py)}" r="1.8" fill="${dot}" opacity="0.9"/>`;
        }

        return s;
    }


    // ---------- the flowers ----------
    function drawRose(x) {
        const n = x.name;
        let layers = x.ri(5, 6);
        let countOuter = 7;

        if (n.includes("english")) { layers = 7; countOuter = 8; }
        if (n.includes("garden")) { layers = 4; countOuter = 6; }

        return layeredFlower(x, {
            layers, outer: x.rr(80, 86), inner: 22,
            countOuter, countInner: 4, width: 0.46, tip: "round"
        }) + spiral(x, 15, 2.2, x.edgeOf(x.pal));
    }

    function drawPeony(x) {
        return layeredFlower(x, {
            layers: x.ri(6, 8), outer: x.rr(78, 84), inner: 20,
            countOuter: 10, countInner: 5, width: 0.5, tip: "frill", jitter: 10
        }) + spiral(x, 9, 1.6, x.edgeOf(x.pal));
    }

    function drawCarnation(x) {
        const striped = x.name.includes("striped");
        const dense = x.name.includes("chabaud") ? 13 : x.name.includes("mini") ? 9 : 11;

        return layeredFlower(x, {
            layers: x.name.includes("mini") ? 4 : 6,
            outer: x.name.includes("mini") ? 70 : x.rr(80, 85),
            inner: 20, countOuter: dense, countInner: 6,
            width: 0.42, tip: "serrate", jitter: 9,
            alt: striped ? colourPalettes.white : null
        }) + spiral(x, 8, 1.5, x.edgeOf(x.pal));
    }

    function drawDahlia(x) {
        const n = x.name;
        let o = { layers: 7, outer: 84, inner: 16, countOuter: 15, countInner: 8, width: 0.2, tip: "point", jitter: 4 };

        if (n.includes("cactus")) o = { layers: 6, outer: 84, inner: 18, countOuter: 16, countInner: 9, width: 0.11, tip: "point", jitter: 5 };
        if (n.includes("ball")) o = { layers: 8, outer: 76, inner: 14, countOuter: 16, countInner: 8, width: 0.26, tip: "round", jitter: 4 };
        if (n.includes("pompon")) o = { layers: 8, outer: 66, inner: 12, countOuter: 15, countInner: 7, width: 0.27, tip: "round", jitter: 4 };

        return layeredFlower(x, o) + discCentre(x, 4, "gold");
    }

    // Tulip (side view, like the reference)
    function tulipFill(x, level) {
        const p = x.pal;
        const id = x.id();
        const k = level * 0.12;

        x.defs.push(
            `<linearGradient id="${id}" x1="0" y1="1" x2="0" y2="0">` +
            `<stop offset="0%" stop-color="${mix(p[0], "#efc04a", 0.5)}"/>` +
            `<stop offset="35%" stop-color="${mix(p[0], p[2], k)}"/>` +
            `<stop offset="100%" stop-color="${mix(p[1], p[0], k)}"/>` +
            `</linearGradient>`
        );

        return `url(#${id})`;
    }

    function tulipPetalPath(cx, base, top, w, lean) {
        const h = base - top;

        return `M${n1(cx - w / 2)},${n1(base)} ` +
               `C${n1(cx - w * 0.78 + lean * 0.3)},${n1(base - h * 0.35)} ${n1(cx - w * 0.5 + lean)},${n1(base - h * 0.78)} ${n1(cx + lean)},${n1(top)} ` +
               `C${n1(cx + w * 0.5 + lean)},${n1(base - h * 0.78)} ${n1(cx + w * 0.78 + lean * 0.3)},${n1(base - h * 0.35)} ${n1(cx + w / 2)},${n1(base)} ` +
               `Q${n1(cx)},${n1(base + h * 0.1)} ${n1(cx - w / 2)},${n1(base)}Z`;
    }

    function drawTulip(x) {
        const n = x.name;
        const edge = x.edgeOf(x.pal);
        const lean = x.rr(5, 11);
        const w = x.rr(54, 64);
        const top = x.rr(32, 42);
        const base = 166;
        const h = base - top;
        const fringed = n.includes("fringed");
        const parrot = n.includes("parrot");

        const one = (cx, l, t, ww, level) => {
            const dash = fringed ? ` stroke-dasharray="1.6 1.2"` : "";
            let s = `<path d="${tulipPetalPath(cx, base, t, ww, l)}" fill="${tulipFill(x, level)}" ` +
                    `stroke="${edge}" stroke-opacity="0.55" stroke-width="${fringed ? 1.4 : 0.9}"${dash}/>`;

            s += `<path d="M${n1(cx + l * 0.1)},${n1(base - h * 0.08)} Q${n1(cx + l * 0.6)},${n1(base - h * 0.5)} ${n1(cx + l)},${n1(t + h * 0.1)}" ` +
                 `fill="none" stroke="${edge}" stroke-opacity="0.25" stroke-width="0.8"/>`;

            if (parrot) {
                for (let i = 0; i < 3; i++) {
                    const yy = base - h * (0.35 + i * 0.17);
                    s += `<path d="M${n1(cx - ww * 0.3 + l * 0.5)},${n1(yy)} q${n1(ww * 0.2)},${n1(-8)} ${n1(ww * 0.5)},${n1(-3)}" ` +
                         `fill="none" stroke="#ffffff" stroke-opacity="0.5" stroke-width="1.2"/>`;
                }
            }

            return s;
        };

        let s = "";

        if (n.includes("double")) {
            s += one(92, -lean * 0.5, top + 10, w * 0.9, 2);
            s += one(108, lean * 0.5, top + 10, w * 0.9, 2);
        }

        s += one(86, -lean, top, w, 1);
        s += one(114, lean, top, w, 1);
        s += one(100, x.rr(-3, 3), top + 8, w * 1.02, 0);

        return s;
    }

    function drawDaisy(x) {
        const n = x.name;
        const gerbera = n.includes("gerbera");

        let centre = "gold";
        if (gerbera) centre = "dark";
        else if (n.includes("african")) centre = "navy";
        else if (n.includes("yellow")) centre = "orange";

        let count = gerbera ? x.ri(20, 26) : x.ri(14, 21);
        let L = gerbera ? x.rr(72, 78) : x.rr(58, 68);
        let W = gerbera ? 9 : x.rr(6.5, 8.5);

        if (n.includes("oxeye")) { W *= 0.85; count += 3; }
        if (n.includes("shasta")) { W *= 1.15; L += 4; }

        let s = ring(x, { count, L, W, tip: "round", level: 0, jitter: 5 });
        s += ring(x, { count, L: L * 0.86, W, tip: "round", level: 1, offset: 180 / count, jitter: 5 });
        s += discCentre(x, gerbera ? 13 : x.rr(13, 19), centre);

        return s;
    }

    function drawCalla(x) {
        const p = x.pal;
        const edge = x.edgeOf(p);
        const id = x.id();

        x.defs.push(
            `<linearGradient id="${id}" x1="0" y1="1" x2="0.3" y2="0">` +
            `<stop offset="0%" stop-color="${mix(p[0], "#cfdcb0", 0.4)}"/>` +
            `<stop offset="50%" stop-color="${p[1]}"/>` +
            `<stop offset="100%" stop-color="${p[0]}"/>` +
            `</linearGradient>`
        );

        return `<path d="M100,182 C66,168 44,118 58,70 C66,44 88,26 112,22 C108,40 120,52 138,58 C146,100 134,150 100,182Z" ` +
               `fill="url(#${id})" stroke="${edge}" stroke-opacity="0.5" stroke-width="0.9"/>` +
               `<path d="M112,22 C100,60 96,120 100,182" fill="none" stroke="${edge}" stroke-opacity="0.3" stroke-width="0.9"/>` +
               `<path d="M72,70 C82,100 90,140 100,182" fill="none" stroke="${edge}" stroke-opacity="0.2" stroke-width="0.8"/>` +
               `<g transform="rotate(-8 106 98)">` + discCentreEllipse(x) + `</g>`;
    }

    function discCentreEllipse(x) {
        const c = centrePalettes.gold;
        const id = x.id();

        x.defs.push(
            `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="0">` +
            `<stop offset="0%" stop-color="${c[0]}"/><stop offset="100%" stop-color="${c[2]}"/></linearGradient>`
        );

        let s = `<ellipse cx="106" cy="98" rx="7" ry="30" fill="url(#${id})" stroke="${c[2]}" stroke-opacity="0.6" stroke-width="0.8"/>`;

        for (let i = 0; i < 18; i++) {
            s += `<circle cx="${n1(106 + x.rr(-4, 4))}" cy="${n1(98 + x.rr(-26, 26))}" r="1" fill="${c[2]}" opacity="0.5"/>`;
        }

        return s;
    }

    function drawLily(x) {
        const n = x.name;

        if (n.includes("calla")) return drawCalla(x);

        const p = x.pal;
        const dark = mix(p[2], "#5a2a2a", 0.5);
        let s = "";

        if (n.includes("water")) {
            s += ring(x, { count: 10, L: 82, W: 14, tip: "point", level: 0, jitter: 4 });
            s += ring(x, { count: 9, L: 64, W: 13, tip: "point", level: 1, offset: 15, jitter: 4 });
            s += ring(x, { count: 8, L: 46, W: 12, tip: "point", level: 2, offset: 30, jitter: 4 });
            s += discCentre(x, 8, "gold");
            s += stamens(x, 16, 12, 20, "#d9a43b", "#b8782a");
            return s;
        }

        const spotted = /tiger|stargazer/.test(n);
        const spots = (L, W) => {
            if (!spotted) return "";
            let t = "";
            for (let i = 0; i < 10; i++) {
                t += `<circle cx="${n1(x.rr(-W * 0.45, W * 0.45))}" cy="${n1(-x.rr(L * 0.1, L * 0.7))}" ` +
                     `r="${n1(x.rr(0.9, 1.8))}" fill="${dark}" opacity="0.65"/>`;
            }
            return t;
        };

        const rot = x.rr(0, 60);
        const L = x.rr(76, 86);
        const W = n.includes("stargazer") || n.includes("oriental") ? x.rr(19, 23) : x.rr(14, 18);

        s += ring(x, { count: 3, L, W, tip: "point", offset: rot, level: 0, jitter: 3, extra: spots });
        s += ring(x, { count: 3, L: L * 0.96, W: W * 1.1, tip: "point", offset: rot + 60, level: 1, jitter: 3, extra: spots });
        s += `<circle cx="100" cy="100" r="6" fill="#c9d68e" opacity="0.85"/>`;
        s += stamens(x, 6, 26, 40, "#9c8a55", "#b86a35");

        return s;
    }

    function drawOrchid(x) {
        const n = x.name;
        const p = x.pal;

        const kinds = {
            moth: {
                sep: [[0, 58, 21, "round"], [148, 56, 19, "round"], [-148, 56, 19, "round"]],
                pet: [[84, 66, 33, "round"], [-84, 66, 33, "round"]], lip: [34, 14, "point"]
            },
            cattleya: {
                sep: [[0, 66, 18, "point"], [150, 62, 16, "point"], [-150, 62, 16, "point"]],
                pet: [[78, 66, 34, "frill"], [-78, 66, 34, "frill"]], lip: [50, 26, "frill"]
            },
            dancing: {
                sep: [[0, 56, 20, "round"], [150, 48, 15, "round"], [-150, 48, 15, "round"]],
                pet: [[70, 52, 26, "round"], [-70, 52, 26, "round"]], lip: [54, 30, "round"], speck: true
            },
            dendrobium: {
                sep: [[0, 56, 15, "point"], [150, 54, 14, "point"], [-150, 54, 14, "point"]],
                pet: [[78, 60, 22, "round"], [-78, 60, 22, "round"]], lip: [30, 14, "round"]
            },
            vanilla: {
                sep: [[0, 60, 11, "point"], [150, 58, 10, "point"], [-150, 58, 10, "point"]],
                pet: [[75, 62, 11, "point"], [-75, 62, 11, "point"]], lip: [32, 15, "frill"]
            },
            vanda: {
                sep: [[0, 62, 29, "round"], [144, 62, 29, "round"], [-144, 62, 29, "round"]],
                pet: [[72, 62, 29, "round"], [-72, 62, 29, "round"]], lip: [24, 10, "point"], speck: true
            }
        };

        let kind = "moth";
        for (const k of ["dancing", "cattleya", "vanda", "dendrobium", "vanilla"]) {
            if (n.includes(k)) kind = k;
        }

        const spec = kinds[kind];

        let lipPal = [
            mix(p[2], "#c0407f", 0.5),
            mix(p[0], "#d870a0", 0.35),
            mix(p[2], "#5a1d3e", 0.45)
        ];
        if (kind === "dancing") lipPal = colourPalettes.gold;
        if (kind === "vanilla") lipPal = p;

        // palette order for fills is [middle, light, dark]
        lipPal = [lipPal[1] || lipPal[0], lipPal[0], lipPal[2]];
        if (kind === "dancing") lipPal = colourPalettes.gold;

        const speck = (L, W) => spec.speck ? speckles(x, L, W, 14, mix(p[2], "#3a1f4a", 0.5)) : "";
        const P = (a, L, W, tip, pal2, lvl, extra) =>
            petal(100, 100, a + x.rr(-3, 3), L * x.rr(0.97, 1.04), W, tip,
                  x.fill(lvl, pal2), x.edgeOf(pal2), true, extra || "");

        let s = "";
        spec.sep.forEach(([a, L, W, t]) => { s += P(a, L, W, t, p, 0, speck(L, W)); });
        spec.pet.forEach(([a, L, W, t]) => { s += P(a, L, W, t, p, 1, speck(L, W)); });

        const [lipL, lipW, lipTip] = spec.lip;
        s += P(125, lipL * 0.62, lipW * 0.55, "round", lipPal, 2);
        s += P(235, lipL * 0.62, lipW * 0.55, "round", lipPal, 2);
        s += P(180, lipL, lipW, lipTip, lipPal, 2, kind === "dancing" ? speckles(x, lipL, lipW, 12, "#7a4a1c") : "");

        s += `<circle cx="100" cy="98" r="5.5" fill="${p[1]}" stroke="${x.edgeOf(p)}" stroke-opacity="0.5" stroke-width="0.8"/>` +
             `<circle cx="100" cy="96" r="2" fill="#e8b84a"/>`;

        return s;
    }

    function drawSunflower(x) {
        const n = x.name;
        let alt = null;
        let centre = "dark";
        let R = x.rr(28, 33);
        let scale = 1;
        let extra = false;

        if (n.includes("mini")) { scale = 0.78; R = 24; }
        if (n.includes("teddy")) { R = 20; extra = true; }
        if (n.includes("autumn")) alt = colourPalettes.yellow;
        if (n.includes("strawberry")) alt = colourPalettes.yellow;
        if (n.includes("lemon")) centre = "green";

        const count = x.ri(18, 22);

        let s = ring(x, { count, L: 84 * scale, W: 9.5, tip: "point", level: 0, jitter: 5, alt });
        s += ring(x, { count, L: 76 * scale, W: 9, tip: "point", level: 1, offset: 180 / count, jitter: 5, alt });

        if (extra) s += ring(x, { count: 22, L: 58, W: 9, tip: "point", level: 2, offset: 5, jitter: 5 });

        s += discCentre(x, R * scale, centre);

        return s;
    }

    // ---------- wildflowers ----------
    function drawLavender(x) {
        let s = "";
        const stems = [[-20, 0.92], [0, 1], [20, 0.9]];

        stems.forEach(([ang, sc]) => {
            const topY = 190 - 150 * sc;
            s += `<g transform="rotate(${n1(ang + x.rr(-3, 3))} 100 190)">`;
            s += `<path d="M100,190 L100,${n1(topY)}" stroke="#829c78" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;

            for (let i = 0; i < 12; i++) {
                const t = i / 11;
                const y = 140 - t * (140 - topY);
                const size = 1 - t * 0.45;

                [-1, 1].forEach(side => {
                    s += `<ellipse cx="${n1(100 + side * 5 * size)}" cy="${n1(y + (side > 0 ? 3 : 0))}" ` +
                         `rx="${n1(4.8 * size)}" ry="${n1(7 * size)}" transform="rotate(${side * 25} ${n1(100 + side * 5 * size)} ${n1(y)})" ` +
                         `fill="${x.fill(i % 3)}" stroke="${x.edgeOf(x.pal)}" stroke-opacity="0.45" stroke-width="0.6"/>`;
                });
            }

            s += `<ellipse cx="100" cy="${n1(topY - 2)}" rx="3" ry="5" fill="${x.fill(1)}"/>`;
            s += `</g>`;
        });

        return s;
    }

    function drawBluebell(x) {
        const p = x.pal;
        const edge = x.edgeOf(p);
        const P0 = [100, 190], P1 = [98, 60], P2 = [52, 38];
        const at = t => [
            (1 - t) * (1 - t) * P0[0] + 2 * (1 - t) * t * P1[0] + t * t * P2[0],
            (1 - t) * (1 - t) * P0[1] + 2 * (1 - t) * t * P1[1] + t * t * P2[1]
        ];

        let s = `<path d="M100,190 Q98,60 52,38" fill="none" stroke="#829c78" stroke-width="2.4" stroke-linecap="round"/>`;

        const bell = "M0,0 C-6,0 -13,8 -13,20 C-13,28 -19,31 -17,36 C-12,33 -8,38 -3,35 C-1,37 1,37 3,35 C8,38 12,33 17,36 C19,31 13,28 13,20 C13,8 6,0 0,0Z";

        [0.42, 0.56, 0.7, 0.84, 0.98].forEach((t, i) => {
            const [px, py] = at(t);
            const bx = px + 12, by = py + 8;
            const sc = 1.15 - i * 0.12;

            s += `<path d="M${n1(px)},${n1(py)} Q${n1(px + 6)},${n1(py)} ${n1(bx)},${n1(by)}" fill="none" stroke="#829c78" stroke-width="1.4"/>`;
            s += `<g transform="translate(${n1(bx)} ${n1(by)}) rotate(${n1(x.rr(-8, 8))}) scale(${n1(sc)})">` +
                 `<path d="${bell}" fill="${x.fill(i % 2)}" stroke="${edge}" stroke-opacity="0.5" stroke-width="0.9"/>` +
                 `<path d="M0,3 C-1,15 -1,25 0,34" fill="none" stroke="${edge}" stroke-opacity="0.25" stroke-width="0.8"/></g>`;
        });

        return s;
    }

    function drawPoppy(x) {
        const p = x.pal;
        const blotch = (L, W) =>
            `<ellipse cx="0" cy="${n1(-L * 0.2)}" rx="${n1(W * 0.55)}" ry="${n1(L * 0.18)}" fill="#1b0f12" opacity="0.6"/>` +
            `<path d="M${n1(-W * 0.4)},${n1(-L * 0.4)} q${n1(W * 0.3)},${n1(-L * 0.2)} ${n1(W * 0.2)},${n1(-L * 0.5)}" fill="none" stroke="#ffffff" stroke-opacity="0.25" stroke-width="1"/>` +
            `<path d="M${n1(W * 0.4)},${n1(-L * 0.35)} q${n1(-W * 0.2)},${n1(-L * 0.2)} ${n1(-W * 0.1)},${n1(-L * 0.5)}" fill="none" stroke="#ffffff" stroke-opacity="0.25" stroke-width="1"/>`;

        let s = ring(x, { count: 2, L: 78, W: 44, tip: "round", level: 0, jitter: 6, extra: blotch });
        s += ring(x, { count: 2, L: 74, W: 42, tip: "round", level: 1, offset: 90, jitter: 6, extra: blotch });

        const podId = x.id();
        x.defs.push(
            `<radialGradient id="${podId}" cx="40%" cy="35%" r="75%"><stop offset="0%" stop-color="#c3cfa0"/><stop offset="100%" stop-color="#6f8660"/></radialGradient>`
        );

        s += `<circle cx="100" cy="100" r="9" fill="url(#${podId})" stroke="#4d5f43" stroke-opacity="0.6" stroke-width="0.8"/>`;

        for (let i = 0; i < 24; i++) {
            const a = (i * 360) / 24 * Math.PI / 180;
            const r = x.rr(13, 19);
            s += `<circle cx="${n1(100 + Math.cos(a) * r)}" cy="${n1(100 + Math.sin(a) * r)}" r="1.4" fill="${mix(p[2], "#000000", 0.6)}"/>`;
        }

        return s;
    }

    function drawCosmos(x) {
        let s = ring(x, { count: 8, L: 80, W: 24, tip: "notch", level: 0, jitter: 4 });
        s += ring(x, { count: 8, L: 52, W: 16, tip: "notch", level: 2, offset: 22, jitter: 4 });
        s += discCentre(x, 10, "gold");
        return s;
    }

    function drawForgetMeNot(x) {
        const spots = [[100, 104, 1.15], [58, 66, 0.9], [142, 72, 0.95], [66, 138, 0.9], [136, 142, 1]];
        let s = "";

        spots.forEach(([cx, cy, sc]) => {
            const jx = cx + x.rr(-5, 5), jy = cy + x.rr(-5, 5);
            s += `<path d="M100,190 Q${n1((100 + jx) / 2)},${n1((190 + jy) / 2)} ${n1(jx)},${n1(jy)}" fill="none" stroke="#9cb78d" stroke-width="1.2" opacity="0.7"/>`;
        });

        spots.forEach(([cx, cy, sc]) => {
            const jx = cx + x.rr(-5, 5), jy = cy + x.rr(-5, 5);

            s += ring(x, { count: 5, L: 30 * sc, W: 13 * sc, tip: "round", cx: jx, cy: jy, level: 0, jitter: 5 });
            s += `<circle cx="${n1(jx)}" cy="${n1(jy)}" r="${n1(4.5 * sc)}" fill="#f5d77f" stroke="#c98f2b" stroke-opacity="0.6" stroke-width="0.7"/>`;
            s += `<circle cx="${n1(jx)}" cy="${n1(jy)}" r="${n1(1.6 * sc)}" fill="#fff6d6"/>`;
        });

        return s;
    }

    function drawCornflower(x) {
        const centreCol = mix(x.pal[2], "#3a1f6a", 0.5);
        let s = ring(x, { count: x.ri(12, 15), L: 66, W: 8, tip: "serrate", level: 0, jitter: 5 });
        s += ring(x, { count: x.ri(10, 12), L: 48, W: 7, tip: "serrate", level: 1, offset: 15, jitter: 5 });

        for (let i = 0; i < 26; i++) {
            const a = x.rr(0, Math.PI * 2);
            const len = x.rr(8, 17);
            s += `<line x1="100" y1="100" x2="${n1(100 + Math.cos(a) * len)}" y2="${n1(100 + Math.sin(a) * len)}" stroke="${centreCol}" stroke-opacity="0.8" stroke-width="1.1" stroke-linecap="round"/>`;
        }

        s += `<circle cx="100" cy="100" r="5" fill="${centreCol}" opacity="0.85"/>`;

        return s;
    }

    function drawButtercup(x) {
        const glossy = (L, W) =>
            `<path d="M${n1(-W * 0.4)},${n1(-L * 0.45)} Q${n1(-W * 0.2)},${n1(-L * 0.8)} ${n1(W * 0.2)},${n1(-L * 0.85)}" fill="none" stroke="#ffffff" stroke-opacity="0.5" stroke-width="2.2" stroke-linecap="round"/>`;

        let s = ring(x, { count: 5, L: 66, W: 36, tip: "round", level: 0, jitter: 4, extra: glossy });
        s += discCentre(x, 8, "green");

        for (let i = 0; i < 22; i++) {
            const a = x.rr(0, Math.PI * 2);
            const r = x.rr(12, 19);
            s += `<circle cx="${n1(100 + Math.cos(a) * r)}" cy="${n1(100 + Math.sin(a) * r)}" r="1.5" fill="#d9a43b"/>`;
        }

        return s;
    }

    function drawAnemone(x) {
        let s = ring(x, { count: 7, L: 76, W: 30, tip: "round", level: 0, jitter: 5 });
        s += discCentre(x, 13, "navy");
        s += stamens(x, 28, 14, 24, "#3b3568", "#221d44");
        return s;
    }

    function drawSweetPea(x) {
        const p = x.pal;
        const edge = x.edgeOf(p);
        const wing = [p[1], mix(p[1], "#ffffff", 0.4), p[0]];
        const keel = [mix(p[0], p[2], 0.3), p[0], p[2]];

        let s = `<path d="M100,160 C96,182 132,188 124,166 C120,156 106,160 112,170" fill="none" stroke="#9cb78d" stroke-width="1.6" stroke-linecap="round"/>`;
        s += petal(100, 120, x.rr(-4, 4), 80, 46, "frill", x.fill(0), edge, true, "");
        s += petal(100, 114, 95, 54, 30, "round", x.fill(1, wing), x.edgeOf(wing), true, "");
        s += petal(100, 114, -95, 54, 30, "round", x.fill(1, wing), x.edgeOf(wing), true, "");
        s += petal(100, 116, 180, 30, 15, "round", x.fill(2, keel), x.edgeOf(keel), true, "");

        return s;
    }

    function drawBabysBreath(x) {
        const pts = [];

        for (let i = 0; i < 26; i++) {
            const a = x.rr(0, Math.PI * 2);
            const r = 78 * Math.sqrt(x.rr(0.05, 1));
            pts.push([100 + Math.cos(a) * r, 92 + Math.sin(a) * r * 0.9]);
        }

        let s = "";

        pts.forEach(([px, py]) => {
            s += `<path d="M100,188 Q${n1((100 + px) / 2 + x.rr(-8, 8))},${n1((188 + py) / 2)} ${n1(px)},${n1(py)}" fill="none" stroke="#9cb78d" stroke-width="0.8" opacity="0.7"/>`;
        });

        pts.forEach(([px, py]) => {
            s += ring(x, { count: 5, L: 7, W: 3.4, tip: "round", cx: px, cy: py, level: 0, jitter: 8, vein: false });
            s += `<circle cx="${n1(px)}" cy="${n1(py)}" r="1.3" fill="#f2d47a"/>`;
        });

        return s;
    }

    function drawWildflower(x) {
        const n = x.name;

        if (n.includes("bluebell")) return drawBluebell(x);
        if (n.includes("poppy")) return drawPoppy(x);
        if (n.includes("cosmos")) return drawCosmos(x);
        if (n.includes("forget")) return drawForgetMeNot(x);
        if (n.includes("cornflower")) return drawCornflower(x);
        if (n.includes("buttercup")) return drawButtercup(x);
        if (n.includes("anemone")) return drawAnemone(x);
        if (n.includes("sweet pea")) return drawSweetPea(x);
        if (n.includes("baby")) return drawBabysBreath(x);

        return drawLavender(x);
    }

    function drawFlower(flower, x) {
        switch (flower.category) {
            case "Roses": return drawRose(x);
            case "Tulips": return drawTulip(x);
            case "Daisies": return drawDaisy(x);
            case "Lilies": return drawLily(x);
            case "Peonies": return drawPeony(x);
            case "Orchids": return drawOrchid(x);
            case "Sunflowers": return drawSunflower(x);
            case "Carnations": return drawCarnation(x);
            case "Dahlias": return drawDahlia(x);
            default: return drawWildflower(x);
        }
    }


    // Create a soft watercolor-style flower illustration (cached so it only draws once)
    const imageCache = {};

    function createFlowerIllustration(flower) {
        if (imageCache[flower.name]) return imageCache[flower.name];

        const x = createContext(flower);
        const art = drawFlower(flower, x);
        const seed = hashString(flower.name) % 997;

        const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
                <defs>
                    <filter id="watercolour" x="-5%" y="-5%" width="110%" height="110%">
                        <feTurbulence type="fractalNoise" baseFrequency="0.045"
                            numOctaves="2" seed="${seed}" result="noise"/>
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale="3"
                            xChannelSelector="R" yChannelSelector="G" result="wobble"/>
                        <feGaussianBlur in="wobble" stdDeviation="0.35"/>
                    </filter>
                    ${x.defs.join("")}
                </defs>
                <g filter="url(#watercolour)">${art}</g>
            </svg>
        `;

        imageCache[flower.name] =
            "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);

        return imageCache[flower.name];
    }




    function create(name) {
        const category = categoryByName[name] || "Roses";
        return createFlowerIllustration({ name, category });
    }

    return { create };

})();


// ==========================================
// LEAF DRAWINGS
// (the same watercolour greenery as the leaves page)
// ==========================================

const LeafArt = (() => {

    // =====================================================================
    // LEAF ARTWORK  (every leaf is drawn by code - no image files needed)
    // =====================================================================

    // Palettes are [middle, light, dark]
    const leafPalettes = {
        sage:   ["#8fa98a", "#b8c9a5", "#6e8d70"],
        fresh:  ["#7fa670", "#b0d09a", "#58805a"],
        lime:   ["#a3c35e", "#d2e592", "#78993c"],
        deep:   ["#5d8062", "#8db08c", "#3e6045"],
        glossy: ["#44694c", "#78a27c", "#2d4a36"],
        blue:   ["#8aaaa8", "#bdd4d0", "#668a89"],
        silver: ["#a8b9aa", "#dbe4d6", "#85998b"],
        olive:  ["#8d9b6c", "#bcc995", "#677a4e"],
        teal:   ["#6f9a94", "#a2c7bf", "#4f7a76"],
        dusty:  ["#93a79a", "#c4d0c2", "#6e8576"],
        golden: ["#d6c466", "#efe5a2", "#b09d3e"],
        burgundy: ["#8c4a5c", "#bb7b8c", "#5f2c3c"]
    };


    // ---------- small helpers ----------
    const n1 = v => v.toFixed(1);

    function hashString(str) {
        let h = 2166136261;
        for (let i = 0; i < str.length; i++) {
            h ^= str.charCodeAt(i);
            h = Math.imul(h, 16777619);
        }
        return h >>> 0;
    }

    // Seeded random numbers: same leaf name = same leaf every time
    function makeRandom(seed) {
        let a = seed;
        return function () {
            a |= 0;
            a = (a + 0x6D2B79F5) | 0;
            let t = Math.imul(a ^ (a >>> 15), 1 | a);
            t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }

    function hexToRgb(hex) {
        const n = parseInt(hex.slice(1), 16);
        return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    }

    function mix(a, b, t) {
        const A = hexToRgb(a), B = hexToRgb(b);
        return "#" + A.map((v, i) =>
            Math.round(v + (B[i] - v) * t).toString(16).padStart(2, "0")
        ).join("");
    }

    // points / angle along a curved stem (quadratic curve)
    function bez(P0, P1, P2, t) {
        const u = 1 - t;
        return [
            u * u * P0[0] + 2 * u * t * P1[0] + t * t * P2[0],
            u * u * P0[1] + 2 * u * t * P1[1] + t * t * P2[1]
        ];
    }

    function tangentAngle(P0, P1, P2, t) {
        const dx = 2 * (1 - t) * (P1[0] - P0[0]) + 2 * t * (P2[0] - P1[0]);
        const dy = 2 * (1 - t) * (P1[1] - P0[1]) + 2 * t * (P2[1] - P1[1]);
        return (Math.atan2(dx, -dy) * 180) / Math.PI;
    }

    function pointAt(px, py, angle, len) {
        const r = (angle * Math.PI) / 180;
        return [px + Math.sin(r) * len, py - Math.cos(r) * len];
    }


    // Everything one leaf needs while it is being drawn
    function createContext(leaf) {
        const rand = makeRandom(hashString(leaf.name));
        const style = leafStyles[leaf.name];
        const base = leafPalettes[style.pal];

        // tiny colour shift so similar leaves are never identical
        const shift = (rand() - 0.5) * 0.12;
        const pal = base.map(c => mix(c, shift > 0 ? "#ffffff" : "#000000", Math.abs(shift)));

        const defs = [];
        const cache = {};
        let uid = 0;

        const x = {
            name: leaf.name.toLowerCase(),
            pal,
            defs,
            stem: style.stem || mix(pal[2], "#6a5a3a", 0.35),
            rr: (a, b) => a + rand() * (b - a),
            ri: (a, b) => Math.floor(a + rand() * (b - a + 1)),
            id: () => "i" + uid++
        };

        // Watercolour fill: deeper pigment at the base, light at the tip
        x.fill = (level = 0, p = pal) => {
            const key = p[0] + p[1] + p[2] + level;
            if (!cache[key]) {
                const id = x.id();
                const k = Math.min(level * 0.09, 0.5);
                const mid = mix(p[0], p[2], k);
                const light = mix(p[1], p[0], k);
                const dark = mix(p[0], p[2], 0.45 + k);
                defs.push(
                    `<radialGradient id="${id}" cx="50%" cy="100%" r="105%">` +
                    `<stop offset="0%" stop-color="${dark}"/>` +
                    `<stop offset="38%" stop-color="${mid}"/>` +
                    `<stop offset="100%" stop-color="${light}"/>` +
                    `</radialGradient>`
                );
                cache[key] = `url(#${id})`;
            }
            return cache[key];
        };

        return x;
    }


    // ---------- leaf shapes ----------
    // A leaf points straight up from (0,0).
    // Width profile: sin(pi * t^a) ^ e   (a = where it is widest, e = roundness)
    const heartPoly = [[0, 0.1], [-0.3, 0.0], [-0.78, 0.07], [-1.0, 0.3], [-0.98, 0.55], [-0.72, 0.8], [-0.32, 0.95], [0, 1.0]];

    const specs = {
        round:    { a: 1,    e: 0.42 },
        roundish: { a: 0.95, e: 0.6 },
        oval:     { a: 0.9,  e: 0.8 },
        ovate:    { a: 0.75, e: 0.65 },
        lance:    { a: 0.85, e: 1.1 },
        narrow:   { a: 0.9,  e: 1.5 },
        pointed:  { a: 0.8,  e: 0.95 },
        wavy:     { a: 0.9,  e: 0.75, wave: 0.09, waves: 7, N: 36 },
        nestwave: { a: 1,    e: 0.9,  wave: 0.06, waves: 9, N: 40 },
        mint:     { a: 0.85, e: 0.7,  teeth: 8, tooth: 0.14, wave: 0.03, waves: 5 },
        salal:    { a: 0.78, e: 0.65, teeth: 16, tooth: 0.05 },
        holly:    { a: 0.85, e: 0.8,  teeth: 4, tooth: 0.32 },
        toothed:  { a: 0.85, e: 0.85, teeth: 6, tooth: 0.18 },
        coleus:   { a: 0.85, e: 0.7,  teeth: 9, tooth: 0.1 },
        dusty:    { a: 0.9,  e: 0.7,  lobes: { n: 3, depth: 0.5 }, N: 40 },
        oak:      { a: 0.95, e: 0.75, lobes: { n: 4, depth: 0.42 }, N: 48 },
        banana:   { a: 0.95, e: 0.6,  N: 30 },
        paddle:   { a: 0.9,  e: 0.5,  N: 30 },
        blade:    { fn: t => Math.pow(1 - t, 0.65) * Math.min(1, 0.25 + t * 9), N: 30, mid: false },

        // waisted "violin" shape
        fiddle: {
            fn: t => Math.max(
                t < 0.36 ? 0.58 * Math.pow(Math.max(0, Math.sin(Math.PI * t / 0.36)), 0.8) : 0,
                t > 0.28 ? Math.pow(Math.max(0, Math.sin(Math.PI * (t - 0.28) / 0.72)), 0.75) : 0
            ),
            N: 34
        },

        // fan shape with a little notch at the top
        ginkgo: {
            fn: t => t < 0.8
                ? 0.08 + 0.92 * Math.pow(t / 0.8, 1.2)
                : Math.sqrt(Math.max(0, 1 - Math.pow((t - 0.8) / 0.2, 2))),
            N: 30, notch: 0.14, mid: false,
            veinTo: [[-0.9, 0.72, 0.02], [-0.6, 0.9, 0.02], [-0.28, 0.96, 0.02], [0, 0.9, 0.02]]
        },

        // outlines given as points: [sideways, along] (left half, mirrored)
        heart: {
            poly: heartPoly, midStart: 0.1,
            veinTo: [[-0.75, 0.22, 0.12], [-0.9, 0.42, 0.3], [-0.8, 0.62, 0.5], [-0.45, 0.82, 0.7]]
        },
        arrow: {
            poly: [[0, 0.16], [-0.15, -0.08], [-0.55, -0.12], [-0.95, 0.05], [-0.78, 0.3], [-0.5, 0.55], [-0.22, 0.8], [0, 1.0]],
            midStart: 0.16,
            veinTo: [[-0.55, -0.04, 0.14], [-0.85, 0.2, 0.2], [-0.55, 0.5, 0.3], [-0.25, 0.78, 0.5]]
        },
        ivy: {
            poly: [[0, 0.08], [-0.34, 0.0], [-0.62, 0.1], [-0.4, 0.26], [-1.0, 0.42], [-0.5, 0.55], [-0.4, 0.78], [0, 1.0]],
            smooth: false, midStart: 0.08,
            veinTo: [[-0.6, 0.1, 0.06], [-0.95, 0.42, 0.12], [-0.36, 0.76, 0.3]]
        },
        stag: {
            poly: [[0, 0], [-0.2, 0.3], [-0.5, 0.58], [-0.62, 0.8], [-0.55, 1.0], [-0.4, 0.84], [-0.28, 1.05], [-0.12, 0.86], [0, 0.98]],
            veinTo: [[-0.4, 0.9, 0.2], [-0.2, 0.95, 0.2]]
        }
    };

    function widthAt(spec, t) {
        let w;

        if (spec.fn) {
            w = spec.fn(t);
        } else {
            w = Math.pow(Math.max(0, Math.sin(Math.PI * Math.pow(t, spec.a || 1))), spec.e || 1);
        }

        if (spec.lobes) {
            w *= 1 - spec.lobes.depth + spec.lobes.depth * Math.abs(Math.sin(t * Math.PI * spec.lobes.n));
        }

        if (spec.wave) {
            w *= 1 + spec.wave * Math.sin(t * Math.PI * (spec.waves || 6));
        }

        return w;
    }

    function pathFrom(pts, smooth) {
        const f = p => n1(p[0]) + "," + n1(p[1]);

        if (!smooth) {
            return "M" + pts.map(f).join(" L") + "Z";
        }

        const n = pts.length;
        const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
        let d = "M" + f(mid(pts[n - 1], pts[0]));

        for (let i = 0; i < n; i++) {
            d += " Q" + f(pts[i]) + " " + f(mid(pts[i], pts[(i + 1) % n]));
        }

        return d + "Z";
    }

    function leafPath(L, W, spec, bend) {
        bend = bend || 0;
        let pts;

        if (spec.poly) {
            const left = spec.poly.map(([px, t]) => [px * W + bend * L * t * t, -t * L]);
            const right = spec.poly
                .filter(p => p[0] !== 0)
                .map(([px, t]) => [-px * W + bend * L * t * t, -t * L])
                .reverse();
            pts = left.concat(right);
        } else {
            const N = spec.teeth ? spec.teeth * 2 : (spec.N || 26);
            const left = [];
            const right = [];

            for (let i = 0; i <= N; i++) {
                const t = i / N;
                let w = widthAt(spec, t);

                if (spec.teeth && i > 0 && i < N && i % 2 === 0) {
                    w *= 1 - (spec.tooth || 0.14);
                }

                const cx = bend * L * t * t;
                let y = -t * L;
                if (i === N && spec.notch) y = -L * (1 - spec.notch);

                left.push([cx - w * W, y]);
                right.push([cx + w * W, y]);
            }

            pts = left.concat(right.reverse());
        }

        const smooth = spec.teeth ? false : spec.smooth !== false;
        return pathFrom(pts, smooth);
    }


    // Draw one leaf (with veins, optional cut-outs and extras)
    function drawLeaf(x, o) {
        const spec = o.spec;
        const L = o.L;
        const W = o.W;
        const bend = o.bend || 0;
        const pal = o.pal || x.pal;
        const edge = pal[2];
        const d = leafPath(L, W, spec, bend);

        let mode = o.veins;
        if (!mode) mode = spec.veinTo ? "poly" : (L >= 30 ? "pinnate" : "mid");
        if (spec.veinTo && mode !== "none" && mode !== "mid") mode = "poly";

        const light = o.veinColour === "light";
        const vc = light ? mix(pal[1], "#ffffff", 0.55) : edge;
        const vo = light ? 0.75 : 0.32;
        const mw = o.midW || 1;

        let v = "";

        if (mode !== "none") {
            if (spec.mid !== false) {
                const ms = spec.midStart || 0;
                const me = 0.92;
                v += `<path d="M0,${n1(-L * ms)} Q0,${n1(-L * 0.46)} ${n1(bend * L * me * me)},${n1(-L * me)}" ` +
                     `fill="none" stroke="${vc}" stroke-opacity="${n1(vo + 0.1)}" stroke-width="${mw}" stroke-linecap="round"/>`;
            }

            if (mode === "pinnate" || mode === "parallel") {
                const k = o.veinCount !== undefined ? o.veinCount : (mode === "parallel" ? 14 : 5);
                const sweep = mode === "parallel" ? 0.04 : 0.12;

                for (let j = 1; j <= k; j++) {
                    const t = 0.12 + 0.76 * (j / (k + 1));
                    const t2 = Math.min(0.97, t + sweep);
                    const w = widthAt(spec, t2) * W * 0.88;
                    const x0 = bend * L * t * t;
                    const x1 = bend * L * t2 * t2;

                    [-1, 1].forEach(sd => {
                        v += `<path d="M${n1(x0)},${n1(-L * t)} L${n1(x1 + sd * w)},${n1(-L * t2)}" ` +
                             `fill="none" stroke="${vc}" stroke-opacity="${vo}" stroke-width="0.7" stroke-linecap="round"/>`;
                    });
                }
            }

            if (mode === "poly" && spec.veinTo) {
                spec.veinTo.forEach(([vx, vt, vs]) => {
                    const s0 = vs || 0;
                    const sx = bend * L * s0 * s0;
                    const ex = bend * L * vt * vt;
                    const ends = vx === 0 ? [0] : [vx * W, -vx * W];

                    ends.forEach(ox => {
                        v += `<path d="M${n1(sx)},${n1(-L * s0)} L${n1(ex + ox)},${n1(-L * vt)}" ` +
                             `fill="none" stroke="${vc}" stroke-opacity="${vo}" stroke-width="0.8" stroke-linecap="round"/>`;
                    });
                });
            }
        }

        let inner =
            `<path d="${d}" fill="${x.fill(o.level || 0, pal)}" stroke="${edge}" stroke-opacity="0.55" ` +
            `stroke-width="0.9" stroke-linejoin="round"/>`;

        if (o.extra) inner += o.extra(x, L, W, spec, bend);
        inner += v;

        if (o.fuzz) {
            inner += `<path d="${d}" fill="none" stroke="#ffffff" stroke-opacity="0.55" stroke-width="2.4" stroke-dasharray="1 2.2"/>`;
        }

        if (o.cut) {
            const mid = x.id();
            x.defs.push(
                `<mask id="${mid}" maskUnits="userSpaceOnUse" x="-160" y="-260" width="320" height="340">` +
                `<rect x="-160" y="-260" width="320" height="340" fill="#ffffff"/>${o.cut(x, L, W, spec)}</mask>`
            );
            inner = `<g mask="url(#${mid})">${inner}</g>`;
        }

        return `<g transform="translate(${n1(o.cx)} ${n1(o.cy)}) rotate(${n1(o.angle)})">${inner}</g>`;
    }

    function stemPath(P0, P1, P2, colour, width) {
        return `<path d="M${n1(P0[0])},${n1(P0[1])} Q${n1(P1[0])},${n1(P1[1])} ${n1(P2[0])},${n1(P2[1])}" ` +
               `fill="none" stroke="${colour}" stroke-width="${width}" stroke-linecap="round"/>`;
    }


    // ---------- cut-outs and extras for single leaves ----------
    const leafCuts = {
        monstera(x, L, W) {
            let s = "";

            [0.3, 0.46, 0.62, 0.78].forEach((t, i) => {
                [-1, 1].forEach(sd => {
                    s += `<path d="M${n1(sd * W * 1.1)},${n1(-L * (t - 0.03))} L${n1(sd * W * (0.36 + 0.06 * i))},${n1(-L * (t + 0.06))}" ` +
                         `stroke="#000" stroke-width="3.4" stroke-linecap="round" fill="none"/>`;
                });
            });

            [0.38, 0.54, 0.7].forEach(t => {
                [-1, 1].forEach(sd => {
                    s += `<ellipse cx="${n1(sd * W * 0.3)}" cy="${n1(-L * t)}" rx="3" ry="5.5" fill="#000"/>`;
                });
            });

            return s;
        },

        banana(x, L, W, spec) {
            let s = "";

            for (let t = 0.14; t < 0.9; t += 0.1) {
                const w = widthAt(spec, t) * W;
                [-1, 1].forEach(sd => {
                    s += `<path d="M${n1(sd * w * 1.1)},${n1(-L * t)} L${n1(sd * w * 0.5)},${n1(-L * (t + 0.02))}" ` +
                         `stroke="#000" stroke-width="1.6" stroke-linecap="round" fill="none"/>`;
                });
            }

            return s;
        },

        paradise(x, L, W, spec) {
            let s = "";

            [0.5, 0.62, 0.74, 0.86].forEach(t => {
                const w = widthAt(spec, t) * W;
                [-1, 1].forEach(sd => {
                    s += `<path d="M${n1(sd * w * 1.1)},${n1(-L * t)} L${n1(sd * w * 0.3)},${n1(-L * (t + 0.03))}" ` +
                         `stroke="#000" stroke-width="2.2" stroke-linecap="round" fill="none"/>`;
                });
            });

            return s;
        }
    };

    const leafExtras = {
        // pale stripes like a prayer plant
        calathea(x, L, W, spec) {
            const stripe = mix(x.pal[1], "#ffffff", 0.45);
            let s = "";

            for (let k = 0; k < 6; k++) {
                const t = 0.16 + k * 0.13;
                const w = widthAt(spec, t + 0.1) * W * 0.9;

                [-1, 1].forEach(sd => {
                    s += `<path d="M0,${n1(-L * t)} Q${n1(sd * w * 0.5)},${n1(-L * (t + 0.01))} ${n1(sd * w)},${n1(-L * (t + 0.1))}" ` +
                         `fill="none" stroke="${stripe}" stroke-opacity="0.55" stroke-width="4.2" stroke-linecap="round"/>`;
                });
            }

            return s;
        },

        // burgundy middle with a green edge
        coleus(x, L, W, spec) {
            const inner = leafPath(L, W, spec, 0);
            return `<path d="${inner}" transform="translate(0 ${n1(-L * 0.1)}) scale(0.62 0.78)" ` +
                   `fill="${x.fill(0, leafPalettes.burgundy)}" stroke="${leafPalettes.burgundy[2]}" stroke-opacity="0.5" stroke-width="1"/>`;
        }
    };


    // ---------- layouts ----------

    // A stem with leaves along it (eucalyptus, olive, ivy, mint ...)
    function drawSprig(x, o) {
        const spec = specs[o.spec];
        const taper = o.taper !== undefined ? o.taper : 0.65;
        const P0 = [100, 188];
        const P1 = [100 + (o.bow || 0), 110];
        const P2 = [100 + (o.curve || 0), o.top || 38];
        const t0 = o.t0 !== undefined ? o.t0 : 0.16;
        const t1 = 0.88;

        let s = stemPath(P0, P1, P2, o.stem || x.stem, o.stemW || 2.6);

        for (let i = 0; i < o.count; i++) {
            const u = o.count === 1 ? 0 : i / (o.count - 1);
            const t = t0 + (t1 - t0) * u;
            const [px, py] = bez(P0, P1, P2, t);
            const tang = tangentAngle(P0, P1, P2, t);
            const sz = 1 - (1 - taper) * u;
            const sides = o.opposite ? [-1, 1] : [i % 2 ? 1 : -1];

            if (o.tendrils && i % 2 === 1) {
                const sd = i % 4 === 1 ? 1 : -1;
                s += `<path d="M${n1(px)},${n1(py)} c${n1(sd * 8)},-3 ${n1(sd * 18)},-12 ${n1(sd * 12)},-20 c${n1(-sd * 4)},-6 ${n1(-sd * 13)},-2 ${n1(-sd * 8)},6" ` +
                     `fill="none" stroke="${o.stem || x.stem}" stroke-width="1.2" stroke-linecap="round"/>`;
            }

            sides.forEach(side => {
                s += drawLeaf(x, {
                    cx: px, cy: py,
                    angle: tang + side * (o.spread + x.rr(-5, 5)),
                    L: o.L * sz * x.rr(0.93, 1.07),
                    W: o.W * sz,
                    spec,
                    bend: o.bend ? side * o.bend : 0,
                    level: (i + (side > 0 ? 1 : 0)) % 3,
                    veins: o.veins,
                    veinCount: o.veinCount
                });
            });

            if (o.seeds) {
                [-1, 1].forEach(sd => {
                    [0, 1].forEach(k => {
                        s += `<circle cx="${n1(px + sd * (6 + k * 5))}" cy="${n1(py + 4 - k * 4)}" r="${n1(3.4 - k * 0.5)}" ` +
                             `fill="${x.fill(1)}" stroke="${x.pal[2]}" stroke-opacity="0.6" stroke-width="0.8"/>`;
                    });
                });
            }

            if (o.berries && i % 3 === 1) {
                const sd = i % 2 ? 1 : -1;
                s += `<path d="M${n1(px)},${n1(py)} Q${n1(px + sd * 6)},${n1(py + 2)} ${n1(px + sd * 11)},${n1(py + 6)}" fill="none" stroke="${x.stem}" stroke-width="1.2"/>` +
                     `<ellipse cx="${n1(px + sd * 11)}" cy="${n1(py + 11)}" rx="3.4" ry="4.8" fill="#6b4d63" stroke="#3e2c3b" stroke-opacity="0.6" stroke-width="0.8"/>` +
                     `<ellipse cx="${n1(px + sd * 10)}" cy="${n1(py + 9.5)}" rx="1" ry="1.6" fill="#ffffff" opacity="0.4"/>`;
            }
        }

        if (o.tip !== false) {
            const sz = taper * 1.05;
            s += drawLeaf(x, {
                cx: P2[0], cy: P2[1],
                angle: tangentAngle(P0, P1, P2, 1),
                L: o.L * sz, W: o.W * sz, spec,
                bend: 0, level: 1, veins: o.veins, veinCount: o.veinCount
            });
        }

        return s;
    }

    // How long the leaflets are along a fern frond
    function frondLen(profile, t) {
        if (profile === "even") return 1 - 0.5 * t;
        return (0.3 + 0.7 * Math.sin(Math.PI * Math.min(1, 0.1 + 0.9 * (1 - t)))) * (1 - 0.7 * Math.pow(t, 3));
    }

    function drawPinna(x, o, px, py, angle, len, side, i) {
        const spec = specs[o.spec || "lance"];
        const type = o.pinna || "leaf";
        let s = "";

        if (type === "needle") {
            const m = 7;
            for (let k = 0; k < m; k++) {
                const off = k - (m - 1) / 2;
                const [ex, ey] = pointAt(px, py, angle + off * 10, len * (1 - 0.12 * Math.abs(off)));
                s += `<line x1="${n1(px)}" y1="${n1(py)}" x2="${n1(ex)}" y2="${n1(ey)}" ` +
                     `stroke="${k % 2 ? x.pal[0] : x.pal[2]}" stroke-width="1.1" stroke-linecap="round" opacity="0.85"/>`;
            }
            return s;
        }

        if (type === "lace") {
            const [ex, ey] = pointAt(px, py, angle, len);
            const sub = specs[o.sub || "lance"];
            s += `<line x1="${n1(px)}" y1="${n1(py)}" x2="${n1(ex)}" y2="${n1(ey)}" stroke="${x.pal[2]}" stroke-opacity="0.7" stroke-width="0.9"/>`;

            for (let j = 1; j <= 4; j++) {
                const f = j / 4.6;
                const bx = px + (ex - px) * f;
                const by = py + (ey - py) * f;
                const ll = len * 0.3 * (1 - 0.55 * f);

                [-1, 1].forEach(sd => {
                    s += drawLeaf(x, {
                        cx: bx, cy: by, angle: angle + sd * 55,
                        L: ll, W: ll * (o.subW || 0.2), spec: sub,
                        level: (j + i) % 3, veins: "none"
                    });
                });
            }

            s += drawLeaf(x, {
                cx: ex, cy: ey, angle, L: len * 0.2, W: len * 0.05 + 1, spec: sub,
                level: 1, veins: "none"
            });
            return s;
        }

        if (type === "button") {
            const [bx, by] = pointAt(px, py, angle, 4);
            s += `<line x1="${n1(px)}" y1="${n1(py)}" x2="${n1(bx)}" y2="${n1(by)}" stroke="${x.pal[2]}" stroke-width="1.2"/>`;
            s += drawLeaf(x, {
                cx: bx, cy: by, angle, L: len, W: (o.W * len) / o.L, spec,
                level: i % 3, veins: "mid"
            });
            return s;
        }

        return drawLeaf(x, {
            cx: px, cy: py, angle, L: len, W: (o.W * len) / o.L, spec,
            bend: o.bend ? side * o.bend : 0,
            level: i % 3, veins: o.veins || "none"
        });
    }

    // A fern or palm frond: curved centre stem with leaflets on both sides
    function drawFrond(x, o) {
        const P0 = [100, 188];
        const P1 = [100 + (o.bow || 0), 112];
        const P2 = [100 + (o.curve || 0), o.top || 26];

        let s = stemPath(P0, P1, P2, o.stem || x.stem, o.stemW || 2.6);

        for (let i = 0; i < o.count; i++) {
            const u = i / (o.count - 1);
            const t = 0.1 + 0.84 * u;
            const [px, py] = bez(P0, P1, P2, t);
            const tang = tangentAngle(P0, P1, P2, t);
            const len = o.L * frondLen(o.profile, t);
            const sides = o.opposite === false ? [i % 2 ? 1 : -1] : [-1, 1];

            sides.forEach(side => {
                s += drawPinna(x, o, px, py, tang + side * (o.spread + x.rr(-4, 4)), len, side, i);
            });
        }

        s += drawPinna(x, o, P2[0], P2[1], tangentAngle(P0, P1, P2, 1), o.L * 0.4, 0, o.count);
        return s;
    }

    // Maidenhair: thin dark wires with little fan leaflets
    function drawMaidenhair(x) {
        let s = "";
        const stems = [[-62, 52], [-22, 26], [22, 30], [62, 56]];

        stems.forEach(([dx, top], si) => {
            const P0 = [100, 188];
            const P1 = [100 + dx * 0.15, 120];
            const P2 = [100 + dx, top];
            s += stemPath(P0, P1, P2, "#4b3a33", 1.5);

            const n = 7;
            for (let i = 0; i < n; i++) {
                const t = 0.3 + 0.7 * (i / (n - 1));
                const [px, py] = bez(P0, P1, P2, t);
                const tang = tangentAngle(P0, P1, P2, t);
                const side = i % 2 ? 1 : -1;
                const sz = 1 - 0.35 * (i / (n - 1));
                const [sx, sy] = pointAt(px, py, tang + side * 50, 9);

                s += `<line x1="${n1(px)}" y1="${n1(py)}" x2="${n1(sx)}" y2="${n1(sy)}" stroke="#4b3a33" stroke-width="1"/>`;
                s += drawLeaf(x, {
                    cx: sx, cy: sy, angle: tang + side * 35,
                    L: 24 * sz, W: 15 * sz, spec: specs.ginkgo,
                    level: (i + si) % 3, veins: "none"
                });
            }

            s += drawLeaf(x, {
                cx: P2[0], cy: P2[1], angle: tangentAngle(P0, P1, P2, 1),
                L: 22, W: 14, spec: specs.ginkgo, level: 1, veins: "none"
            });
        });

        return s;
    }

    // Leaves growing out of one point (bird's nest fern, lamb's ear, staghorn)
    function drawRosette(x, o) {
        const spec = specs[o.spec];
        const order = o.angles
            .map((a, i) => ({ a, i }))
            .sort((p, q) => Math.abs(q.a) - Math.abs(p.a));

        let s = "";

        order.forEach(({ a, i }, k) => {
            const L = (o.lens ? o.lens[i] : o.L - Math.abs(a) * 0.45) * x.rr(0.95, 1.05);

            s += drawLeaf(x, {
                cx: 100 + x.rr(-2, 2), cy: o.baseY || 184,
                angle: a + x.rr(-3, 3), L, W: o.W * x.rr(0.92, 1.08),
                spec, bend: Math.sign(a) * (o.bend || 0),
                level: k % 3, veins: o.veins, fuzz: o.fuzz
            });
        });

        return s;
    }

    // One big leaf on a stalk
    function drawSingle(x, o) {
        const spec = specs[o.spec];
        const baseY = o.baseY || 172;
        const petEnd = baseY - o.L * (spec.midStart || 0);

        let s = `<path d="M100,190 Q${100 + (o.petBow || 0)},${n1((190 + petEnd) / 2)} 100,${n1(petEnd)}" ` +
                `fill="none" stroke="${x.stem}" stroke-width="3" stroke-linecap="round"/>`;

        s += drawLeaf(x, {
            cx: 100, cy: baseY, angle: o.angle || 0, L: o.L, W: o.W, spec,
            bend: o.bend || 0, level: 0,
            veins: o.veins, veinCount: o.veinCount, veinColour: o.veinColour, midW: o.midW,
            extra: o.extra ? leafExtras[o.extra] : null,
            cut: o.cut ? leafCuts[o.cut] : null
        });

        return s;
    }

    function drawFanPalm(x) {
        let s = stemPath([100, 190], [100, 150], [100, 120], x.stem, 3.6);
        const n = 13;
        const blades = [];

        for (let i = 0; i < n; i++) {
            const a = -78 + (156 * i) / (n - 1);
            blades.push({ a, i });
        }

        blades.sort((p, q) => Math.abs(q.a) - Math.abs(p.a));

        blades.forEach(({ a, i }, k) => {
            s += drawLeaf(x, {
                cx: 100, cy: 122, angle: a + x.rr(-2, 2),
                L: (74 - Math.abs(a) * 0.14) * x.rr(0.96, 1.04), W: 6.8,
                spec: specs.lance, bend: Math.sign(a) * 0.08,
                level: k % 3, veins: "mid", midW: 1.4
            });
        });

        s += `<circle cx="100" cy="122" r="4" fill="${x.pal[2]}" opacity="0.8"/>`;
        return s;
    }

    function drawGinkgo(x) {
        const spec = specs.ginkgo;
        const items = [
            [68, 150, -35, 48, 29, "M100,190 Q80,184 68,152"],
            [132, 152, 38, 50, 30, "M100,190 Q120,184 132,154"],
            [100, 128, 0, 66, 39, "M100,190 Q98,160 100,130"]
        ];

        let s = "";

        items.forEach(([cx, cy, angle, L, W, stalk], i) => {
            s += `<path d="${stalk}" fill="none" stroke="${x.stem}" stroke-width="2" stroke-linecap="round"/>`;
            s += drawLeaf(x, { cx, cy, angle, L, W, spec, level: i % 3 });
        });

        return s;
    }

    function drawOak(x) {
        const spec = specs.oak;
        let s = `<path d="M100,190 Q118,182 130,170" fill="none" stroke="${x.stem}" stroke-width="2" stroke-linecap="round"/>`;
        s += drawLeaf(x, { cx: 130, cy: 170, angle: 40, L: 62, W: 26, spec, level: 1, veinCount: 4 });
        s += `<path d="M100,190 Q98,172 100,152" fill="none" stroke="${x.stem}" stroke-width="2.6" stroke-linecap="round"/>`;
        s += drawLeaf(x, { cx: 100, cy: 152, angle: -6, L: 100, W: 40, spec, level: 0, veinCount: 6 });
        return s;
    }

    function drawGrass(x) {
        let s = "";
        const n = 11;
        const blades = [];

        for (let i = 0; i < n; i++) {
            const a = -28 + (56 * i) / (n - 1) + x.rr(-3, 3);
            blades.push({ a, i });
        }

        blades.sort((p, q) => Math.abs(q.a) - Math.abs(p.a));

        blades.forEach(({ a }, k) => {
            s += drawLeaf(x, {
                cx: 100 + x.rr(-3, 3), cy: 188, angle: a,
                L: (148 - Math.abs(a) * 1.6) * x.rr(0.92, 1.05), W: 5.4,
                spec: specs.blade, bend: (a / 28) * 0.2,
                level: k % 3, veins: "mid"
            });
        });

        return s;
    }

    // Rosemary: thick little needles all along the stem
    function drawNeedles(x, o) {
        const P0 = [100, 188];
        const P1 = [106, 110];
        const P2 = [114, 22];

        let s = stemPath(P0, P1, P2, o.stem || x.stem, 2.4);

        for (let i = 0; i < o.count; i++) {
            const u = i / (o.count - 1);
            const t = 0.14 + 0.8 * u;
            const [px, py] = bez(P0, P1, P2, t);
            const tang = tangentAngle(P0, P1, P2, t);
            const len = 24 * (1 - 0.45 * u);

            [-1, 1].forEach(side => {
                [0, 1].forEach(k => {
                    const a = tang + side * (32 + k * 14) + x.rr(-4, 4);
                    const [ex, ey] = pointAt(px, py, a, len * (k ? 0.8 : 1));

                    s += `<path d="M${n1(px)},${n1(py)} L${n1(ex)},${n1(ey)}" stroke="${x.pal[2]}" stroke-width="3.4" stroke-linecap="round" opacity="0.9"/>` +
                         `<path d="M${n1(px)},${n1(py)} L${n1(ex)},${n1(ey)}" stroke="${x.pal[1]}" stroke-width="1.5" stroke-linecap="round" opacity="0.8"/>`;
                });
            });
        }

        [-14, 0, 14].forEach(off => {
            const [ex, ey] = pointAt(P2[0], P2[1], tangentAngle(P0, P1, P2, 1) + off, 16);
            s += `<path d="M${n1(P2[0])},${n1(P2[1])} L${n1(ex)},${n1(ey)}" stroke="${x.pal[2]}" stroke-width="3.2" stroke-linecap="round" opacity="0.9"/>` +
                 `<path d="M${n1(P2[0])},${n1(P2[1])} L${n1(ex)},${n1(ey)}" stroke="${x.pal[1]}" stroke-width="1.4" stroke-linecap="round" opacity="0.8"/>`;
        });

        return s;
    }


    // ---------- the 50 leaves ----------
    const leafStyles = {
        // EUCALYPTUS
        "Silver Dollar Eucalyptus": { kind: "sprig", pal: "silver", spec: "round", L: 36, W: 18, count: 5, spread: 58, opposite: true, taper: 0.62, veins: "mid", bow: 6 },
        "Baby Blue Eucalyptus":     { kind: "sprig", pal: "blue", spec: "roundish", L: 26, W: 11, count: 8, spread: 48, opposite: true, taper: 0.55, veins: "mid", bow: -8, curve: -8 },
        "Willow Eucalyptus":        { kind: "sprig", pal: "dusty", spec: "narrow", L: 52, W: 6.5, count: 11, spread: 38, taper: 0.7, bend: 0.22, veins: "mid", curve: 10, bow: -6 },
        "Seeded Eucalyptus":        { kind: "sprig", pal: "teal", spec: "roundish", L: 30, W: 15, count: 5, spread: 56, opposite: true, taper: 0.6, veins: "mid", seeds: true },
        "Gunnii Eucalyptus":        { kind: "sprig", pal: "blue", spec: "oval", L: 30, W: 13, count: 7, spread: 62, opposite: true, taper: 0.6, veins: "mid", stem: "#8a5a62", bow: -10, curve: -12 },
        "Spiral Eucalyptus":        { kind: "sprig", pal: "silver", spec: "round", L: 40, W: 20, count: 8, spread: 64, taper: 0.5, veins: "mid", bow: 26, curve: 30, t0: 0.12 },
        "Parvifolia Eucalyptus":    { kind: "sprig", pal: "blue", spec: "lance", L: 26, W: 5.5, count: 16, spread: 44, taper: 0.75, veins: "none", stemW: 1.8, curve: -14, bow: -12 },
        "Cinerea Eucalyptus":       { kind: "sprig", pal: "silver", spec: "lance", L: 40, W: 11, count: 7, spread: 34, opposite: true, taper: 0.65, veins: "mid", bow: 10, curve: 12 },
        "Nicholii Eucalyptus":      { kind: "sprig", pal: "dusty", spec: "narrow", L: 44, W: 5.5, count: 12, spread: 58, taper: 0.75, bend: 0.35, veins: "mid", bow: 14, curve: 20 },
        "Populus Eucalyptus":       { kind: "sprig", pal: "blue", spec: "ovate", L: 38, W: 20, count: 6, spread: 66, taper: 0.6, veins: "pinnate", veinCount: 3 },

        // FERNS
        "Boston Fern":      { kind: "frond", pal: "fresh", spec: "lance", L: 54, W: 6.5, count: 15, spread: 62, curve: -30, bow: -14, profile: "fern", veins: "mid" },
        "Maidenhair Fern":  { kind: "maidenhair", pal: "fresh", stem: "#4b3a33" },
        "Asparagus Fern":   { kind: "frond", pinna: "needle", pal: "lime", L: 42, count: 17, spread: 56, curve: 14, bow: 8, profile: "fern", stemW: 1.8 },
        "Leatherleaf Fern": { kind: "frond", pal: "glossy", spec: "toothed", L: 50, W: 15, count: 9, spread: 60, curve: 20, bow: 10, profile: "fern", veins: "mid" },
        "Bird's Nest Fern": { kind: "rosette", pal: "lime", spec: "nestwave", angles: [-54, -40, -26, -12, 0, 12, 26, 40, 54], L: 124, W: 14, bend: 0.18, veins: "mid", baseY: 186 },
        "Sword Fern":       { kind: "frond", pal: "deep", spec: "narrow", L: 42, W: 6.5, count: 18, spread: 72, curve: 0, bow: 0, profile: "even", veins: "none" },
        "Lace Fern":        { kind: "frond", pinna: "lace", pal: "fresh", spec: "lance", L: 52, count: 9, spread: 66, curve: -22, bow: -10, profile: "fern", sub: "lance", subW: 0.17 },
        "Staghorn Fern":    { kind: "rosette", pal: "dusty", spec: "stag", angles: [-52, -26, 0, 26, 52], lens: [82, 100, 116, 100, 82], W: 34, baseY: 186, veins: "poly" },
        "Button Fern":      { kind: "frond", pinna: "button", pal: "glossy", spec: "round", L: 24, W: 11, count: 22, spread: 68, opposite: false, curve: 26, bow: 14, profile: "even" },
        "Holly Fern":       { kind: "frond", pal: "glossy", spec: "holly", L: 46, W: 13, count: 8, spread: 58, curve: -24, bow: -12, profile: "fern", veins: "mid" },

        // BRANCHES
        "Olive Branch":      { kind: "sprig", pal: "olive", spec: "lance", L: 36, W: 6.5, count: 9, spread: 50, opposite: true, taper: 0.7, veins: "mid", stem: "#8a7658", berries: true, bow: 8, curve: 10 },
        "Ruscus":            { kind: "sprig", pal: "glossy", spec: "pointed", L: 38, W: 12, count: 8, spread: 28, taper: 0.7, veins: "pinnate", veinCount: 3 },
        "Italian Ruscus":    { kind: "sprig", pal: "deep", spec: "narrow", L: 56, W: 8.5, count: 7, spread: 26, taper: 0.75, bend: 0.1, veins: "mid", bow: 12, curve: 16 },
        "Myrtle Branch":     { kind: "sprig", pal: "deep", spec: "oval", L: 22, W: 9.5, count: 12, spread: 55, opposite: true, taper: 0.8, veins: "mid", stemW: 2 },
        "Pistachio Foliage": { kind: "sprig", pal: "olive", spec: "oval", L: 40, W: 16, count: 6, spread: 42, opposite: true, taper: 0.65, veins: "pinnate", veinCount: 4, stem: "#a07a70" },
        "Pittosporum":       { kind: "sprig", pal: "lime", spec: "wavy", L: 38, W: 14, count: 8, spread: 58, taper: 0.7, veins: "mid", bow: -10, curve: -14 },
        "Bay Laurel":        { kind: "sprig", pal: "glossy", spec: "lance", L: 48, W: 13, count: 7, spread: 46, taper: 0.7, veins: "pinnate", veinCount: 5 },
        "Rosemary":          { kind: "needles", pal: "olive", count: 22 },
        "Boxwood":           { kind: "sprig", pal: "glossy", spec: "roundish", L: 15, W: 8, count: 14, spread: 58, opposite: true, taper: 0.85, veins: "none", stemW: 1.8 },
        "Cypress Branch":    { kind: "frond", pinna: "lace", pal: "teal", spec: "roundish", L: 40, count: 10, spread: 60, curve: 18, bow: 10, profile: "fern", sub: "roundish", subW: 0.38 },

        // TROPICAL
        "Monstera Leaf":         { kind: "single", pal: "glossy", spec: "heart", L: 132, W: 62, cut: "monstera", veins: "poly", baseY: 172, midW: 2.6 },
        "Palm Leaf":             { kind: "frond", pal: "deep", spec: "narrow", L: 64, W: 5.5, count: 14, spread: 48, curve: 26, bow: 12, profile: "even", stemW: 3.2, veins: "mid" },
        "Areca Palm":            { kind: "frond", pal: "fresh", spec: "narrow", L: 56, W: 4.6, count: 20, spread: 46, curve: -42, bow: -20, profile: "fern", bend: 0.22, stemW: 2.8, veins: "mid" },
        "Fan Palm":              { kind: "fanpalm", pal: "deep" },
        "Philodendron Leaf":     { kind: "single", pal: "fresh", spec: "heart", L: 126, W: 58, veins: "poly", baseY: 172 },
        "Calathea Leaf":         { kind: "single", pal: "deep", spec: "oval", L: 128, W: 46, extra: "calathea", veins: "mid", baseY: 174, midW: 1.6 },
        "Banana Leaf":           { kind: "single", pal: "lime", spec: "banana", L: 150, W: 36, veins: "parallel", veinCount: 16, cut: "banana", baseY: 178, angle: 10 },
        "Bird of Paradise Leaf": { kind: "single", pal: "teal", spec: "paddle", L: 134, W: 34, veins: "parallel", veinCount: 13, cut: "paradise", baseY: 176, angle: -8 },
        "Fiddle Leaf Fig":       { kind: "single", pal: "glossy", spec: "fiddle", L: 134, W: 46, veins: "pinnate", veinCount: 7, veinColour: "light", baseY: 174 },
        "Alocasia Leaf":         { kind: "single", pal: "glossy", spec: "arrow", L: 124, W: 56, veins: "poly", veinColour: "light", baseY: 170, midW: 2.6 },

        // DELICATE GREENERY
        "Ivy":          { kind: "sprig", pal: "deep", spec: "ivy", L: 36, W: 21, count: 7, spread: 60, taper: 0.7, veins: "poly", bow: 20, curve: 26, stemW: 1.8, stem: "#6a5a45" },
        "Salal Leaves": { kind: "sprig", pal: "glossy", spec: "salal", L: 46, W: 24, count: 4, spread: 58, taper: 0.75, veins: "pinnate", veinCount: 5, bow: -10, curve: -14 },
        "Lamb's Ear":   { kind: "rosette", pal: "silver", spec: "oval", angles: [-36, -22, -8, 8, 22, 36], L: 128, W: 24, bend: 0.1, fuzz: true, veins: "mid", baseY: 184 },
        "Dusty Miller": { kind: "sprig", pal: "silver", spec: "dusty", L: 38, W: 16, count: 6, spread: 50, taper: 0.7, veins: "mid", bow: 8 },
        "Smilax Vine":  { kind: "sprig", pal: "fresh", spec: "heart", L: 30, W: 16, count: 7, spread: 58, taper: 0.75, veins: "poly", bow: 30, curve: -30, stemW: 1.6, tendrils: true },
        "Ginkgo Leaf":  { kind: "ginkgo", pal: "golden" },
        "Mint Sprig":   { kind: "sprig", pal: "lime", spec: "mint", L: 34, W: 15, count: 5, spread: 50, opposite: true, taper: 0.68, veins: "pinnate", veinCount: 4, stem: "#8a6a7a" },
        "Oak Leaf":     { kind: "oak", pal: "olive" },
        "Lily Grass":   { kind: "grass", pal: "fresh" },
        "Coleus Leaf":  { kind: "single", pal: "lime", spec: "coleus", L: 112, W: 46, extra: "coleus", veins: "pinnate", veinCount: 6, baseY: 172 }
    };

    function drawLeafArt(leaf, x) {
        const style = leafStyles[leaf.name];

        switch (style.kind) {
            case "sprig": return drawSprig(x, style);
            case "frond": return drawFrond(x, style);
            case "maidenhair": return drawMaidenhair(x);
            case "rosette": return drawRosette(x, style);
            case "single": return drawSingle(x, style);
            case "fanpalm": return drawFanPalm(x);
            case "ginkgo": return drawGinkgo(x);
            case "oak": return drawOak(x);
            case "grass": return drawGrass(x);
            case "needles": return drawNeedles(x, style);
            default: return "";
        }
    }


    // Make a soft watercolor-style leaf illustration (cached so it only draws once)
    const imageCache = {};

    function createLeafIllustration(leaf) {
        if (imageCache[leaf.name]) return imageCache[leaf.name];

        const x = createContext(leaf);
        const art = drawLeafArt(leaf, x);
        const seed = hashString(leaf.name) % 997;

        const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
                <defs>
                    <filter id="watercolour" x="-5%" y="-5%" width="110%" height="110%">
                        <feTurbulence type="fractalNoise" baseFrequency="0.045"
                            numOctaves="2" seed="${seed}" result="noise"/>
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale="3"
                            xChannelSelector="R" yChannelSelector="G" result="wobble"/>
                        <feGaussianBlur in="wobble" stdDeviation="0.35"/>
                    </filter>
                    ${x.defs.join("")}
                </defs>
                <g filter="url(#watercolour)">${art}</g>
            </svg>
        `;

        imageCache[leaf.name] =
            "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);

        return imageCache[leaf.name];
    }




    function create(name) {
        let leafName = name;

        // a name this page does not know still gets a leaf drawn
        if (!leafStyles[leafName]) {
            const names = Object.keys(leafStyles);
            leafName = names[hashString(name) % names.length];
        }

        return createLeafIllustration({ name: leafName });
    }

    return { create };

})();


// ==========================================
// GET SAVED FLOWERS, GREENERY AND BOUQUET
// ==========================================

const flowers = JSON.parse(
    sessionStorage.getItem("bloomnoteFlowers") || "[]"
);

const greenery = JSON.parse(
    sessionStorage.getItem("bloomnoteLeaves") || "[]"
);

const selectedBouquet = JSON.parse(
    sessionStorage.getItem("bloomnoteBouquet") || "null"
);


// ==========================================
// GET HTML ELEMENTS
// ==========================================

const flowerList = document.getElementById("flower-list");
const leafList = document.getElementById("leaf-list");
const wrapperCard = document.getElementById("wrapper-card");

const canvas = document.getElementById("bouquet-canvas");
const canvasHint = document.getElementById("canvas-hint");

const arrangementCount = document.getElementById("arrangement-count");
const continueButton = document.getElementById("continue-button");
const clearButton = document.getElementById("clear-button");

const rotateLeftButton = document.getElementById("rotate-left");
const rotateRightButton = document.getElementById("rotate-right");
const smallerButton = document.getElementById("make-smaller");
const biggerButton = document.getElementById("make-bigger");
const layerBackButton = document.getElementById("layer-back");
const layerForwardButton = document.getElementById("layer-forward");
const deleteButton = document.getElementById("delete-piece");
const selectionHint = document.getElementById("selection-hint");

const DEFAULT_HINT = "✧ Select a flower or leaf to edit it";


// ==========================================
// STATE
// ==========================================

// Only the pieces that are on the canvas live here.
// The array order is the paint order (first = at the back).
let pieces = [];
let selectedId = null;          // a piece id, "wrapper", or null
let nextId = 1;

const wrapper = {
    x: 50,
    y: 70,
    rotation: 0,
    scale: 1
};

const hasWrapper = !!(
    selectedBouquet && Array.isArray(selectedBouquet.colors)
);

// How big a piece is (in pixels) before it is scaled
const BASE_SIZE = { flower: 84, leaf: 130 };

const PIECE_SCALE = { min: 0.3, max: 3.5 };
const WRAPPER_SCALE = { min: 0.4, max: 2.2 };


// ==========================================
// SMALL HELPERS
// ==========================================

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function cleanList(list) {
    if (!Array.isArray(list)) return [];

    return list
        .map(item => ({
            name: String(item[0]),
            total: Math.max(0, Math.floor(Number(item[1]) || 0))
        }))
        .filter(item => item.total > 0);
}

const flowerItems = cleanList(flowers);
const leafItems = cleanList(greenery);

function artFor(name, type) {
    return type === "flower"
        ? FlowerArt.create(name)
        : LeafArt.create(name);
}

// Wrapper is 78% of the canvas wide, up to 300px.
// Everything else is sized relative to that.
function wrapperWidth() {
    return Math.min(canvas.clientWidth * 0.78, 300);
}

function unit() {
    return wrapperWidth() / 300;
}

function pieceSize(piece) {
    return BASE_SIZE[piece.type] * piece.scale * unit();
}

function placedCount(name, type) {
    return pieces.filter(
        piece => piece.name === name && piece.type === type
    ).length;
}

// Follows one finger / mouse until it is let go
function trackPointer(event, onMove, onEnd) {
    const id = event.pointerId;

    function move(e) {
        if (e.pointerId === id) onMove(e);
    }

    function up(e) {
        if (e.pointerId !== id) return;

        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
        window.removeEventListener("pointercancel", up);

        if (onEnd) onEnd(e);
    }

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
}


// ==========================================
// WRAPPER ARTWORK (back layer and front layer)
// ==========================================

function wrapperBaseMarkup(colors, p) {
    const [mainColor, foldColor, lightColor] = colors;

    return `
        <defs>
            <linearGradient id="${p}Gradient"
                x1="0%" y1="0%" x2="100%" y2="100%">

                <stop offset="0%" stop-color="${lightColor}"/>
                <stop offset="50%" stop-color="${mainColor}"/>
                <stop offset="100%" stop-color="${foldColor}"/>
            </linearGradient>

            <filter id="${p}Shadow">
                <feGaussianBlur stdDeviation="4"/>
            </filter>

            <filter id="${p}Texture">
                <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.7"
                    numOctaves="2"
                    seed="4"
                />
                <feColorMatrix type="saturate" values="0"/>
                <feComponentTransfer>
                    <feFuncA type="table"
                        tableValues="0 0.08"/>
                </feComponentTransfer>
            </filter>
        </defs>

        <!-- Wrapper shadow -->
        <path
            d="M 60 95 Q 150 60 240 95
               L 190 267 Q 150 292 110 267 Z"
            fill="#a88b80"
            opacity=".16"
            filter="url(#${p}Shadow)"
        />

        <!-- Back folds -->
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

        <!-- Main wrapper -->
        <path
            d="M 76 91
               Q 150 65 224 91
               L 184 259
               Q 150 283 116 259 Z"
            fill="url(#${p}Gradient)"
            stroke="${mainColor}"
            stroke-width="1.2"
        />

        <!-- Left fold -->
        <path
            d="M 76 91
               Q 104 111 150 139
               L 116 259 Z"
            fill="${lightColor}"
            opacity=".55"
        />

        <!-- Right fold -->
        <path
            d="M 224 91
               Q 196 111 150 139
               L 184 259 Z"
            fill="${foldColor}"
            opacity=".5"
        />

        <!-- Paper texture -->
        <path
            d="M 76 91
               Q 150 65 224 91
               L 184 259
               Q 150 283 116 259 Z"
            filter="url(#${p}Texture)"
            opacity=".45"
        />

        <!-- Open top -->
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
    `;
}

function wrapperFrontMarkup(colors) {
    const [mainColor, foldColor, lightColor, ribbonColor] = colors;

    return `
        <!-- OPAQUE FRONT PAPER FOLD -->
        <path
            d="M 76 91
               Q 115 122 150 139
               Q 185 122 224 91
               L 184 259
               Q 150 283 116 259 Z"
            fill="${mainColor}"
            opacity="1"
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

        <!-- Ribbon -->
        <path
            d="M 115 239 Q 150 248 185 239"
            fill="none"
            stroke="${ribbonColor}"
            stroke-width="5"
            stroke-linecap="round"
        />

        <!-- Bow -->
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

        <!-- Bow centre -->
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
    `;
}

function wrapperSvg(inner) {
    return `
        <svg viewBox="0 0 300 310"
             width="100%"
             height="100%"
             xmlns="http://www.w3.org/2000/svg">
            ${inner}
        </svg>
    `;
}

function getWrapperTransform() {
    return `
        translate(-50%, -50%)
        rotate(${wrapper.rotation}deg)
        scale(${wrapper.scale})
    `;
}

function styleWrapperLayer(element, zIndex) {
    element.style.position = "absolute";
    element.style.left = `${wrapper.x}%`;
    element.style.top = `${wrapper.y}%`;
    element.style.width = "min(78%, 300px)";
    element.style.aspectRatio = "300 / 310";
    element.style.transform = getWrapperTransform();
    element.style.transformOrigin = "center center";
    element.style.zIndex = zIndex;
    element.style.pointerEvents = "none";
}

function updateWrapperPosition() {
    [
        canvas.querySelector(".bouquet-base"),
        canvas.querySelector(".bouquet-front")
    ].forEach(element => {
        if (!element) return;

        element.style.left = `${wrapper.x}%`;
        element.style.top = `${wrapper.y}%`;
        element.style.transform = getWrapperTransform();
    });
}

// The back of the wrapper sits UNDER the flowers (z-index 1),
// the front fold sits OVER them (z-index 5000).
// Anything between the two looks tucked inside the paper.
function renderWrapper() {
    canvas.querySelector(".bouquet-base")?.remove();
    canvas.querySelector(".bouquet-front")?.remove();

    if (!hasWrapper) return;

    const colors = selectedBouquet.colors;

    const base = document.createElement("div");
    base.className = "bouquet-base";
    styleWrapperLayer(base, 1);
    base.innerHTML = wrapperSvg(wrapperBaseMarkup(colors, "wb"));

    const front = document.createElement("div");
    front.className = "bouquet-front";
    styleWrapperLayer(front, 5000);
    front.innerHTML = wrapperSvg(wrapperFrontMarkup(colors));

    // Clicks pass straight through the front paper, so flowers
    // that are partly tucked in can still be grabbed.
    // The wrapper is grabbed through its back layer.
    const svg = base.querySelector("svg");
    svg.style.pointerEvents = "visiblePainted";
    svg.style.cursor = "grab";
    svg.style.touchAction = "none";

    makeWrapperDraggable(svg);

    canvas.appendChild(base);
    canvas.appendChild(front);
}


// ==========================================
// SELECTION BOX WITH HANDLES (rotate / resize / remove)
// ==========================================

const selectionBox = document.createElement("div");
selectionBox.className = "selection-box";

selectionBox.innerHTML = `
    <span class="sel-handle sel-rotate" title="Drag to rotate">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none"
             stroke="currentColor" stroke-width="2.4"
             stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 12a8 8 0 1 1-2.6-5.9"/>
            <path d="M20 4v5h-5"/>
        </svg>
    </span>

    <span class="sel-handle sel-resize" title="Drag to resize">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none"
             stroke="currentColor" stroke-width="2.4"
             stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 19L19 5"/>
            <path d="M12 5h7v7"/>
            <path d="M12 19H5v-7"/>
        </svg>
    </span>

    <span class="sel-handle sel-delete" title="Take out of the bouquet">
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none"
             stroke="currentColor" stroke-width="2.6"
             stroke-linecap="round">
            <path d="M6 6l12 12M18 6L6 18"/>
        </svg>
    </span>
`;

canvas.appendChild(selectionBox);

const rotateHandle = selectionBox.querySelector(".sel-rotate");
const resizeHandle = selectionBox.querySelector(".sel-resize");
const deleteHandle = selectionBox.querySelector(".sel-delete");

function getTarget() {
    if (selectedId === "wrapper") return hasWrapper ? wrapper : null;
    return pieces.find(piece => piece.id === selectedId) || null;
}

function updateSelectionBox() {
    const target = getTarget();

    if (!target) {
        selectionBox.classList.remove("visible");
        return;
    }

    let width;
    let height;
    let offsetY = 0;

    if (selectedId === "wrapper") {
        // Fit the box around the visible paper
        const k = unit() * wrapper.scale;
        width = 204 * k;
        height = 246 * k;
        offsetY = 20 * k;
        selectionBox.classList.add("wrapper-mode");
    } else {
        width = height = pieceSize(target);
        selectionBox.classList.remove("wrapper-mode");
    }

    selectionBox.style.width = `${width}px`;
    selectionBox.style.height = `${height}px`;
    selectionBox.style.left = `${target.x}%`;
    selectionBox.style.top = `${target.y}%`;
    selectionBox.style.transform =
        `translate(-50%, -50%) rotate(${target.rotation}deg) translate(0, ${offsetY}px)`;

    selectionBox.classList.add("visible");
}

function boxCentre() {
    const rect = selectionBox.getBoundingClientRect();

    return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
    };
}

// Rotate handle
rotateHandle.addEventListener("pointerdown", event => {
    const target = getTarget();
    if (!target) return;

    event.preventDefault();
    event.stopPropagation();

    const centre = boxCentre();
    const startAngle = Math.atan2(
        event.clientY - centre.y,
        event.clientX - centre.x
    );
    const startRotation = target.rotation;

    trackPointer(event, move => {
        const angle = Math.atan2(
            move.clientY - centre.y,
            move.clientX - centre.x
        );

        let rotation =
            startRotation + ((angle - startAngle) * 180) / Math.PI;

        // hold Shift to snap every 15 degrees
        if (move.shiftKey) rotation = Math.round(rotation / 15) * 15;

        target.rotation = rotation;
        applyTarget();
    });
});

// Resize handle
resizeHandle.addEventListener("pointerdown", event => {
    const target = getTarget();
    if (!target) return;

    event.preventDefault();
    event.stopPropagation();

    const centre = boxCentre();
    const startDistance = Math.max(
        12,
        Math.hypot(event.clientX - centre.x, event.clientY - centre.y)
    );
    const startScale = target.scale;
    const limits = selectedId === "wrapper" ? WRAPPER_SCALE : PIECE_SCALE;

    trackPointer(event, move => {
        const distance = Math.hypot(
            move.clientX - centre.x,
            move.clientY - centre.y
        );

        target.scale = clamp(
            startScale * (distance / startDistance),
            limits.min,
            limits.max
        );

        applyTarget();
    });
});

// Remove handle
deleteHandle.addEventListener("pointerdown", event => {
    event.preventDefault();
    event.stopPropagation();
    removeSelectedPiece();
});


// ==========================================
// SELECTING
// ==========================================

function select(id) {
    selectedId = id;

    canvas.querySelectorAll(".bouquet-piece").forEach(element => {
        element.classList.toggle(
            "selected",
            Number(element.dataset.id) === id
        );
    });

    updateSelectionBox();
    updateControls();
}

// Click on an empty part of the canvas to let go of everything
canvas.addEventListener("pointerdown", event => {
    if (event.target === canvas || event.target === canvasHint) {
        select(null);
    }
});

canvas.addEventListener("dragstart", event => event.preventDefault());


// ==========================================
// PIECES ON THE CANVAS
// ==========================================

function applyPieceStyle(piece, element, index) {
    const size = pieceSize(piece);

    element.style.width = `${size}px`;
    element.style.height = `${size}px`;
    element.style.left = `${piece.x}%`;
    element.style.top = `${piece.y}%`;
    element.style.transform =
        `translate(-50%, -50%) rotate(${piece.rotation}deg)`;

    if (index !== undefined) {
        element.style.zIndex = 10 + index;
    }
}

function getPieceElement(id) {
    return canvas.querySelector(`.bouquet-piece[data-id="${id}"]`);
}

// Update whatever is selected (piece or wrapper) without redrawing
function applyTarget() {
    if (selectedId === "wrapper") {
        updateWrapperPosition();
    } else {
        const piece = getTarget();
        const element = piece && getPieceElement(piece.id);
        if (piece && element) applyPieceStyle(piece, element);
    }

    updateSelectionBox();
}

function createPieceElement(piece) {
    const element = document.createElement("div");
    element.className = "bouquet-piece";
    element.dataset.id = piece.id;
    element.title = piece.name;

    const img = document.createElement("img");
    img.src = artFor(piece.name, piece.type);
    img.alt = piece.name;
    img.draggable = false;

    element.appendChild(img);

    element.addEventListener("pointerdown", event => {
        startPieceDrag(event, piece, element);
    });

    return element;
}

function renderPieces() {
    canvas.querySelectorAll(".bouquet-piece").forEach(
        element => element.remove()
    );

    pieces.forEach((piece, index) => {
        const element = createPieceElement(piece);
        applyPieceStyle(piece, element, index);

        if (piece.id === selectedId) element.classList.add("selected");

        canvas.appendChild(element);
    });

    canvasHint.style.display = pieces.length === 0 ? "flex" : "none";

    arrangementCount.textContent =
        `${pieces.length} piece${pieces.length === 1 ? "" : "s"} arranged`;

    continueButton.disabled = pieces.length === 0;

    // The selected piece may have been removed
    if (selectedId !== null && selectedId !== "wrapper" && !getTarget()) {
        selectedId = null;
    }

    updateSelectionBox();
    updateControls();
    renderTray();
}

function addPiece(name, type, position) {
    // Click instead of drag: drop it just above the wrapper
    if (!position) {
        const anchorX = hasWrapper ? wrapper.x : 50;
        const anchorY = hasWrapper ? wrapper.y - 34 : 35;

        position = {
            x: anchorX + (Math.random() * 28 - 14),
            y: anchorY + (Math.random() * 14 - 7)
        };
    }

    const piece = {
        id: nextId++,
        name,
        type,
        x: clamp(position.x, 3, 97),
        y: clamp(position.y, 3, 97),
        rotation: Math.floor(Math.random() * 21 - 10),
        scale: 1
    };

    if (type === "leaf") {
        // greenery goes behind the flowers
        const firstFlower = pieces.findIndex(p => p.type === "flower");

        if (firstFlower === -1) pieces.push(piece);
        else pieces.splice(firstFlower, 0, piece);
    } else {
        pieces.push(piece);
    }

    selectedId = piece.id;
    renderPieces();
}

function removeSelectedPiece() {
    if (selectedId === null || selectedId === "wrapper") return;

    pieces = pieces.filter(piece => piece.id !== selectedId);
    selectedId = null;
    renderPieces();
}

function moveLayer(direction) {
    const index = pieces.findIndex(piece => piece.id === selectedId);
    const other = index + direction;

    if (index === -1 || other < 0 || other >= pieces.length) return;

    [pieces[index], pieces[other]] = [pieces[other], pieces[index]];
    renderPieces();
}


// ==========================================
// DRAGGING
// ==========================================

function startPieceDrag(event, piece, element) {
    if (event.button !== undefined && event.button > 0) return;

    event.preventDefault();
    event.stopPropagation();

    select(piece.id);

    let lastX = event.clientX;
    let lastY = event.clientY;

    element.classList.add("dragging");

    trackPointer(event, move => {
        const rect = canvas.getBoundingClientRect();

        piece.x = clamp(
            piece.x + ((move.clientX - lastX) / rect.width) * 100,
            0, 100
        );

        piece.y = clamp(
            piece.y + ((move.clientY - lastY) / rect.height) * 100,
            0, 100
        );

        lastX = move.clientX;
        lastY = move.clientY;

        applyPieceStyle(piece, element);
        updateSelectionBox();
    }, () => {
        element.classList.remove("dragging");
    });
}

function makeWrapperDraggable(svg) {
    svg.addEventListener("pointerdown", event => {
        if (event.button !== undefined && event.button > 0) return;

        event.preventDefault();
        event.stopPropagation();

        select("wrapper");

        let lastX = event.clientX;
        let lastY = event.clientY;

        svg.style.cursor = "grabbing";

        trackPointer(event, move => {
            const rect = canvas.getBoundingClientRect();

            wrapper.x = clamp(
                wrapper.x + ((move.clientX - lastX) / rect.width) * 100,
                0, 100
            );

            wrapper.y = clamp(
                wrapper.y + ((move.clientY - lastY) / rect.height) * 100,
                0, 100
            );

            lastX = move.clientX;
            lastY = move.clientY;

            updateWrapperPosition();
            updateSelectionBox();
        }, () => {
            svg.style.cursor = "grab";
        });
    });
}


// ==========================================
// SIDE TABLE (your chosen flowers, greenery and wrapper)
// ==========================================

function renderTrayList(items, type, container) {
    container.innerHTML = "";

    if (items.length === 0) {
        container.innerHTML =
            '<p class="empty-selection">Nothing selected yet.</p>';
        return;
    }

    items.forEach(item => {
        const left = item.total - placedCount(item.name, type);

        const row = document.createElement("div");
        row.className = "selection-item tray-item";

        if (left <= 0) row.classList.add("used");

        row.title = left > 0
            ? "Drag onto the canvas (or click to add)"
            : "All placed";

        const thumb = document.createElement("img");
        thumb.className = "tray-thumb";
        thumb.src = artFor(item.name, type);
        thumb.alt = item.name;
        thumb.draggable = false;

        const text = document.createElement("div");
        text.className = "tray-text";

        const name = document.createElement("span");
        name.className = "tray-name";
        name.textContent = item.name;

        const count = document.createElement("span");
        count.className = "tray-count";
        count.textContent = left > 0
            ? `${left} of ${item.total} left`
            : "All placed ✓";

        text.append(name, count);
        row.append(thumb, text);

        row.addEventListener("pointerdown", event => {
            startTrayDrag(event, item, type);
        });

        container.appendChild(row);
    });
}

function renderTray() {
    renderTrayList(flowerItems, "flower", flowerList);
    renderTrayList(leafItems, "leaf", leafList);
}

function renderWrapperCard() {
    wrapperCard.innerHTML = "";

    if (!hasWrapper) {
        wrapperCard.innerHTML =
            '<p class="empty-selection">No wrapper chosen yet.</p>';
        return;
    }

    const colors = selectedBouquet.colors;

    const row = document.createElement("div");
    row.className = "wrapper-card-row";
    row.title = "Click to select the wrapper on the canvas";

    const thumb = document.createElement("div");
    thumb.className = "wrapper-thumb";
    thumb.innerHTML = wrapperSvg(
        wrapperBaseMarkup(colors, "wt") + wrapperFrontMarkup(colors)
    );

    const text = document.createElement("div");
    text.className = "tray-text";

    const name = document.createElement("span");
    name.className = "tray-name";
    name.textContent = selectedBouquet.name || "Your wrapper";

    const note = document.createElement("span");
    note.className = "tray-count";
    note.textContent = "On your canvas ✓";

    text.append(name, note);
    row.append(thumb, text);

    row.addEventListener("click", () => select("wrapper"));

    wrapperCard.appendChild(row);
}


// ==========================================
// DRAG FROM THE SIDE TABLE ONTO THE CANVAS
// ==========================================

function startTrayDrag(event, item, type) {
    if (event.button !== undefined && event.button > 0) return;
    if (item.total - placedCount(item.name, type) <= 0) return;

    event.preventDefault();

    const startX = event.clientX;
    const startY = event.clientY;
    let ghost = null;

    function overCanvas(e) {
        const rect = canvas.getBoundingClientRect();

        return (
            e.clientX >= rect.left && e.clientX <= rect.right &&
            e.clientY >= rect.top && e.clientY <= rect.bottom
        );
    }

    function moveGhost(e) {
        ghost.style.left = `${e.clientX}px`;
        ghost.style.top = `${e.clientY}px`;
        canvas.classList.toggle("drop-ready", overCanvas(e));
    }

    trackPointer(event, move => {
        if (!ghost) {
            if (Math.hypot(move.clientX - startX, move.clientY - startY) < 6) {
                return;
            }

            const size = BASE_SIZE[type] * unit();

            ghost = document.createElement("img");
            ghost.className = "drag-ghost";
            ghost.src = artFor(item.name, type);
            ghost.draggable = false;
            ghost.style.width = `${size}px`;
            ghost.style.height = `${size}px`;

            document.body.appendChild(ghost);
        }

        moveGhost(move);
    }, end => {
        canvas.classList.remove("drop-ready");

        // Just a click: add it near the wrapper
        if (!ghost) {
            if (end.type === "pointerup") addPiece(item.name, type);
            return;
        }

        ghost.remove();

        // Let go over the canvas: put it exactly there
        if (end.type === "pointerup" && overCanvas(end)) {
            const rect = canvas.getBoundingClientRect();

            addPiece(item.name, type, {
                x: ((end.clientX - rect.left) / rect.width) * 100,
                y: ((end.clientY - rect.top) / rect.height) * 100
            });
        }
    });
}


// ==========================================
// CONTROLS UNDER THE CANVAS
// ==========================================

function updateControls() {
    const target = getTarget();
    const isPiece = !!target && selectedId !== "wrapper";

    [rotateLeftButton, rotateRightButton, smallerButton, biggerButton]
        .forEach(button => { button.disabled = !target; });

    [layerBackButton, layerForwardButton, deleteButton]
        .forEach(button => { button.disabled = !isPiece; });

    if (isPiece) {
        selectionHint.textContent = `✧ Editing ${target.name}`;
    } else if (target) {
        selectionHint.textContent = "✧ Editing your wrapper";
    } else {
        selectionHint.textContent = DEFAULT_HINT;
    }
}

function rotatePiece(amount) {
    const target = getTarget();
    if (!target) return;

    target.rotation += amount;
    applyTarget();
}

function resizePiece(amount) {
    const target = getTarget();
    if (!target) return;

    const limits = selectedId === "wrapper" ? WRAPPER_SCALE : PIECE_SCALE;

    target.scale = clamp(target.scale + amount, limits.min, limits.max);
    applyTarget();
}

rotateLeftButton.addEventListener("click", () => rotatePiece(-15));
rotateRightButton.addEventListener("click", () => rotatePiece(15));
smallerButton.addEventListener("click", () => resizePiece(-0.1));
biggerButton.addEventListener("click", () => resizePiece(0.1));

layerBackButton.addEventListener("click", () => moveLayer(-1));
layerForwardButton.addEventListener("click", () => moveLayer(1));
deleteButton.addEventListener("click", removeSelectedPiece);

// Keyboard: Delete removes, arrow keys nudge
document.addEventListener("keydown", event => {
    const target = getTarget();
    if (!target) return;

    if (event.key === "Delete" || event.key === "Backspace") {
        if (selectedId !== "wrapper") {
            event.preventDefault();
            removeSelectedPiece();
        }
        return;
    }

    const step = event.shiftKey ? 2 : 0.5;
    const moves = {
        ArrowLeft: [-step, 0],
        ArrowRight: [step, 0],
        ArrowUp: [0, -step],
        ArrowDown: [0, step]
    };

    if (moves[event.key]) {
        event.preventDefault();
        target.x = clamp(target.x + moves[event.key][0], 0, 100);
        target.y = clamp(target.y + moves[event.key][1], 0, 100);
        applyTarget();
    }
});


// ==========================================
// RESET ARRANGEMENT
// ==========================================

clearButton.addEventListener("click", () => {
    pieces = [];
    selectedId = null;

    wrapper.x = 50;
    wrapper.y = 70;
    wrapper.rotation = 0;
    wrapper.scale = 1;

    renderWrapper();
    renderPieces();
});


// ==========================================
// PICTURE OF THE FINISHED BOUQUET (shown on the message page)
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

// Builds a small self-contained picture of the bouquet
// (wrapper back, flowers and leaves, wrapper front) as HTML.
function buildBouquetSnapshot() {
    const W = canvas.clientWidth;
    const H = canvas.clientHeight;

    let left = Infinity;
    let top = Infinity;
    let right = -Infinity;
    let bottom = -Infinity;

    function grow(bounds) {
        left = Math.min(left, bounds.left);
        top = Math.min(top, bounds.top);
        right = Math.max(right, bounds.right);
        bottom = Math.max(bottom, bounds.bottom);
    }

    // area taken by the wrapper
    if (hasWrapper) {
        const k = unit() * wrapper.scale;
        const angle = (wrapper.rotation * Math.PI) / 180;
        const offset = 20 * k;
        const cx = (wrapper.x / 100) * W - Math.sin(angle) * offset;
        const cy = (wrapper.y / 100) * H + Math.cos(angle) * offset;

        grow(rotatedBounds(cx, cy, 204 * k, 246 * k, wrapper.rotation));
    }

    // area taken by every flower and leaf
    pieces.forEach(piece => {
        const size = pieceSize(piece) * 0.92;

        grow(rotatedBounds(
            (piece.x / 100) * W,
            (piece.y / 100) * H,
            size, size, piece.rotation
        ));
    });

    // a little breathing space, but never outside the canvas
    const pad = 14;
    left = Math.max(0, left - pad);
    top = Math.max(0, top - pad);
    right = Math.min(W, right + pad);
    bottom = Math.min(H, bottom + pad);

    // every different flower / leaf picture is stored only once
    const artIndex = {};
    const artRules = [];

    let pieceHtml = "";

    pieces.forEach((piece, index) => {
        const key = `${piece.type}:${piece.name}`;

        if (!(key in artIndex)) {
            artIndex[key] = artRules.length;
            artRules.push(
                `.bq-art-${artRules.length}{background-image:url("${artFor(piece.name, piece.type)}")}`
            );
        }

        const size = pieceSize(piece);

        pieceHtml +=
            `<div class="bq-piece bq-art-${artIndex[key]}" style="` +
            `position:absolute;left:${piece.x}%;top:${piece.y}%;` +
            `width:${size}px;height:${size}px;` +
            `background-size:100% 100%;background-repeat:no-repeat;` +
            `transform:translate(-50%,-50%) rotate(${piece.rotation}deg);` +
            `z-index:${10 + index}"></div>`;
    });

    const back = canvas.querySelector(".bouquet-base");
    const front = canvas.querySelector(".bouquet-front");

    return `<div class="bq-snapshot" ` +
           `data-w="${Math.round(right - left)}" data-h="${Math.round(bottom - top)}" ` +
           `data-x="${Math.round(left)}" data-y="${Math.round(top)}" ` +
           `data-sw="${W}" data-sh="${H}" ` +
           `style="position:relative;width:100%;overflow:hidden;margin:0 auto">` +
           `<style>${artRules.join("")}</style>` +
           `<div class="bq-scene" style="position:absolute;left:0;top:0;` +
           `width:${W}px;height:${H}px;transform-origin:0 0">` +
           (back ? back.outerHTML : "") +
           pieceHtml +
           (front ? front.outerHTML : "") +
           `</div></div>`;
}


// ==========================================
// CONTINUE TO THE MESSAGE PAGE
// ==========================================

continueButton.addEventListener("click", () => {
    if (pieces.length === 0) return;

    sessionStorage.setItem(
        "bloomnoteArrangement",
        JSON.stringify(pieces)
    );

    // Save the wrapper's final position and size too.
    sessionStorage.setItem(
        "bloomnoteWrapper",
        JSON.stringify(wrapper)
    );

    // Save a picture of the finished bouquet for the message page.
    try {
        sessionStorage.setItem(
            "bloomnoteArrangementPreview",
            buildBouquetSnapshot()
        );
    } catch (error) {
        sessionStorage.removeItem("bloomnoteArrangementPreview");
    }

    window.location.href = "message.html";
});


// ==========================================
// KEEP EVERYTHING THE RIGHT SIZE WHEN THE WINDOW CHANGES
// ==========================================

function refreshLayout() {
    pieces.forEach((piece, index) => {
        const element = getPieceElement(piece.id);
        if (element) applyPieceStyle(piece, element, index);
    });

    updateSelectionBox();
}

window.addEventListener("resize", refreshLayout);


// ==========================================
// START PAGE
// ==========================================

if (canvas) {
    renderWrapperCard();
renderWrapper();
renderPieces();
}