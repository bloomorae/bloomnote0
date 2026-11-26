
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

// Create all 100 flower items
const flowers = Object.entries(flowerGroups).flatMap(
    ([category, names]) =>
        names.map(name => ({
            name,
            category
        }))
);

const categories = ["All flowers", ...Object.keys(flowerGroups)];

const quantities = {};
let selectedCategory = "All flowers";

const grid = document.getElementById("flower-grid");
const categoryArea = document.getElementById("categories");
const totalCount = document.getElementById("total-count");
const flowerCount = document.getElementById("flower-count");
const continueButton = document.getElementById("continue-button");


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


// RENDER CATEGORIES
function renderCategories() {
    categoryArea.innerHTML = "";

    categories.forEach(category => {
        const button = document.createElement("button");
        button.className = "category-button";
        button.textContent = category;

        if (category === selectedCategory) {
            button.classList.add("active");
        }

        button.addEventListener("click", () => {
            selectedCategory = category;
            renderCategories();
            renderFlowers();
        });

        categoryArea.appendChild(button);
    });
}


// RENDER FLOWERS
function renderFlowers() {
    grid.innerHTML = "";

    const visibleFlowers = flowers.filter(flower =>
        selectedCategory === "All flowers" ||
        flower.category === selectedCategory
    );

    visibleFlowers.forEach(flower => {
        const quantity = quantities[flower.name] || 0;

        const card = document.createElement("article");
        card.className = "flower-card";

        const picture = document.createElement("div");
        picture.className = "flower-picture";

        const img = document.createElement("img");
        img.src = createFlowerIllustration(flower);
        img.alt = flower.name;
        img.loading = "lazy";

        picture.appendChild(img);

        const title = document.createElement("h3");
        title.textContent = flower.name;

        const category = document.createElement("p");
        category.className = "flower-category";
        category.textContent = flower.category;

        const controls = document.createElement("div");
        controls.className = "flower-controls";

        if (quantity === 0) {
            const addButton = document.createElement("button");
            addButton.className = "add-button";
            addButton.textContent = "Add  +";

            addButton.addEventListener("click", () => {
                quantities[flower.name] = 1;
                renderFlowers();
                updateTotal();
            });

            controls.appendChild(addButton);

        } else {
            const minus = document.createElement("button");
            minus.className = "quantity-button";
            minus.textContent = "−";

            minus.addEventListener("click", () => {
                quantities[flower.name]--;
                renderFlowers();
                updateTotal();
            });

            const number = document.createElement("span");
            number.className = "quantity";
            number.textContent = quantity;

            const plus = document.createElement("button");
            plus.className = "quantity-button";
            plus.textContent = "+";

            plus.addEventListener("click", () => {
                quantities[flower.name]++;
                renderFlowers();
                updateTotal();
            });

            controls.append(minus, number, plus);
        }

        card.append(picture, title, category, controls);
        grid.appendChild(card);
    });

    flowerCount.textContent = `${flowers.length} flowers`;
}


// UPDATE SELECTION TOTAL
function updateTotal() {
    const total = Object.values(quantities).reduce(
        (sum, quantity) => sum + quantity, 0
    );

    totalCount.textContent = total;
    continueButton.disabled = total === 0;
}


// CONTINUE BUTTON
continueButton.addEventListener("click", () => {
    const selection = Object.entries(quantities)
        .filter(([name, quantity]) => quantity > 0);

    sessionStorage.setItem(
        "bloomnoteFlowers",
        JSON.stringify(selection)
    );

    // Go to the leaf selection page
    window.location.href = "leaves.html";
});


// START THE WEBSITE
renderCategories();
renderFlowers();
updateTotal();
