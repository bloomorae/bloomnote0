const leafGroups = {
    "Eucalyptus": [
        "Silver Dollar Eucalyptus", "Baby Blue Eucalyptus", "Willow Eucalyptus",
        "Seeded Eucalyptus", "Gunnii Eucalyptus", "Spiral Eucalyptus",
        "Parvifolia Eucalyptus", "Cinerea Eucalyptus", "Nicholii Eucalyptus",
        "Populus Eucalyptus"
    ],

    "Ferns": [
        "Boston Fern", "Maidenhair Fern", "Asparagus Fern", "Leatherleaf Fern",
        "Bird's Nest Fern", "Sword Fern", "Lace Fern", "Staghorn Fern",
        "Button Fern", "Holly Fern"
    ],

    "Branches": [
        "Olive Branch", "Ruscus", "Italian Ruscus", "Myrtle Branch",
        "Pistachio Foliage", "Pittosporum", "Bay Laurel", "Rosemary",
        "Boxwood", "Cypress Branch"
    ],

    "Tropical": [
        "Monstera Leaf", "Palm Leaf", "Areca Palm", "Fan Palm",
        "Philodendron Leaf", "Calathea Leaf", "Banana Leaf",
        "Bird of Paradise Leaf", "Fiddle Leaf Fig", "Alocasia Leaf"
    ],

    "Delicate Greenery": [
        "Ivy", "Salal Leaves", "Lamb's Ear", "Dusty Miller", "Smilax Vine",
        "Ginkgo Leaf", "Mint Sprig", "Oak Leaf", "Lily Grass", "Coleus Leaf"
    ]
};

const leaves = Object.entries(leafGroups).flatMap(
    ([category, names]) =>
        names.map((name, index) => ({
            name,
            category,
            index
        }))
);

const categories = ["All greenery", ...Object.keys(leafGroups)];

const quantities = {};
let selectedCategory = "All greenery";

const grid = document.getElementById("leaf-grid");
const categoryArea = document.getElementById("categories");
const totalCount = document.getElementById("total-count");
const leafCount = document.getElementById("leaf-count");
const continueButton = document.getElementById("continue-button");


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


// CATEGORY BUTTONS
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
            renderLeaves();
        });

        categoryArea.appendChild(button);
    });
}


// LEAF CARDS
function renderLeaves() {
    grid.innerHTML = "";

    const visibleLeaves = leaves.filter(leaf =>
        selectedCategory === "All greenery" ||
        leaf.category === selectedCategory
    );

    visibleLeaves.forEach(leaf => {
        const quantity = quantities[leaf.name] || 0;

        const card = document.createElement("article");
        card.className = "leaf-card";

        const picture = document.createElement("div");
        picture.className = "leaf-picture";

        const img = document.createElement("img");
        img.src = createLeafIllustration(leaf);
        img.alt = leaf.name;
        img.loading = "lazy";

        picture.appendChild(img);

        const title = document.createElement("h3");
        title.textContent = leaf.name;

        const category = document.createElement("p");
        category.className = "leaf-category";
        category.textContent = leaf.category;

        const controls = document.createElement("div");
        controls.className = "leaf-controls";

        if (quantity === 0) {
            const addButton = document.createElement("button");
            addButton.className = "add-button";
            addButton.textContent = "Add  +";

            addButton.addEventListener("click", () => {
                quantities[leaf.name] = 1;
                renderLeaves();
                updateTotal();
            });

            controls.appendChild(addButton);
        } else {
            const minus = document.createElement("button");
            minus.className = "quantity-button";
            minus.textContent = "−";

            minus.addEventListener("click", () => {
                quantities[leaf.name]--;

                if (quantities[leaf.name] <= 0) {
                    delete quantities[leaf.name];
                }

                renderLeaves();
                updateTotal();
            });

            const number = document.createElement("span");
            number.className = "quantity";
            number.textContent = quantity;

            const plus = document.createElement("button");
            plus.className = "quantity-button";
            plus.textContent = "+";

            plus.addEventListener("click", () => {
                quantities[leaf.name]++;
                renderLeaves();
                updateTotal();
            });

            controls.append(minus, number, plus);
        }

        card.append(picture, title, category, controls);
        grid.appendChild(card);
    });

    leafCount.textContent = `${leaves.length} varieties`;
}


// SELECTION TOTAL
function updateTotal() {
    const total = Object.values(quantities).reduce(
        (sum, quantity) => sum + quantity, 0
    );

    totalCount.textContent = total;
    continueButton.disabled = total === 0;
}


// SHOW FLOWER SELECTION SUMMARY
function showFlowerSummary() {
    const savedFlowers = JSON.parse(
        sessionStorage.getItem("bloomnoteFlowers") || "[]"
    );

    const flowerTotal = savedFlowers.reduce(
        (sum, item) => sum + Number(item[1]), 0
    );

    document.getElementById("flower-summary").textContent =
        `${flowerTotal} flowers selected · Now choose your greenery`;
}


// SAVE LEAVES
continueButton.addEventListener("click", () => {
    const selection = Object.entries(quantities)
        .filter(([name, quantity]) => quantity > 0);

    sessionStorage.setItem(
        "bloomnoteLeaves",
        JSON.stringify(selection)
    );

    window.location.href = "bouquet.html";
});


// START
showFlowerSummary();
renderCategories();
renderLeaves();
updateTotal();