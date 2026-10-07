import { type Garden, type Vec, type VineArgs, add, createRandom, cubic, edgeFrame, measure, mul, pointAt, r1, rotate } from "./geometry";
import { type Sprout } from "./types";

function growVine(
    garden: Garden,
    rand: () => number,
    leafColors: string[],
    petalColors: string[],
    speed: number,
    a: VineArgs,
) {
    const { S, heading, bend, len, delay, depth, end, tuck } = a;
    const jitter = () => (rand() - 0.5) * len * 0.2;

    const start = add(S, mul(heading, -tuck));
    const E = add(add(S, mul(heading, len * 0.55)), mul(bend, len * 0.75));
    const c1 = add(S, { x: heading.x * len * 0.45 + jitter(), y: heading.y * len * 0.45 + jitter() });
    const c2 = add(E, {
        x: -bend.x * len * 0.35 + heading.x * len * 0.05 + jitter(),
        y: -bend.y * len * 0.35 + heading.y * len * 0.05 + jitter(),
    });

    const pts: Vec[] = [start];
    for (let i = 0; i <= 40; i++) pts.push(cubic(S, c1, c2, E, i / 40));
    const stemPoly = measure(pts.slice());

    let d = `M${r1(start.x)} ${r1(start.y)} L${r1(S.x)} ${r1(S.y)} C${r1(c1.x)} ${r1(c1.y)} ${r1(c2.x)} ${r1(c2.y)} ${r1(E.x)} ${r1(E.y)}`;

    if (end === "curl") {
        let th = Math.atan2(E.y - c2.y, E.x - c2.x);
        let p = { ...E };
        const dir = rand() < 0.5 ? 1 : -1;
        const N = 16;
        for (let k = 0; k < N; k++) {
            th += dir * (0.28 + k * 0.035);
            const step = 7 * (1 - k / N) + 1.4;
            p = add(p, { x: Math.cos(th) * step, y: Math.sin(th) * step });
            pts.push(p);
            d += ` L${r1(p.x)} ${r1(p.y)}`;
        }
    }

    const total = measure(pts).total;
    const duration = (0.45 + total / 320) / speed;
    garden.stems.push({
        d,
        length: total,
        delay,
        duration,
        retractDelay: depth ? 0.08 : 0.18,
        thin: depth > 0,
    });

    const stemLen = stemPoly.total;
    const from = tuck + 6;
    const count = Math.max(2, Math.round(stemLen / 24));
    let leafSide = rand() < 0.5 ? 1 : -1;
    for (let i = 0; i < count; i++) {
        const at = from + (stemLen - from) * (0.08 + i * (0.86 / count) + rand() * 0.04);
        const { p, angle } = pointAt(stemPoly, at);
        const frac = at / stemLen;
        garden.leaves.push({
            x: r1(p.x),
            y: r1(p.y),
            angle: r1(angle + leafSide * (45 + rand() * 25)),
            scale: Math.round((1.15 - frac * 0.5) * (depth ? 0.7 : 1) * (0.85 + rand() * 0.3) * 100) / 100,
            color: leafColors[Math.floor(rand() * leafColors.length)],
            delay: delay + duration * (at / total) * 0.85,
        });
        leafSide *= -1;
    }

    const vinePetalColor = petalColors[Math.floor(rand() * petalColors.length)];

    if (end === "bloom") {
        garden.blooms.push({
            x: r1(E.x),
            y: r1(E.y),
            delay: delay + duration * 0.9,
            scale: 1,
            color: vinePetalColor,
        });
    }

    for (const t of a.blooms ?? []) {
        const at = from + (stemLen - from) * Math.min(Math.max(t, 0), 1);
        const { p } = pointAt(stemPoly, at);
        garden.blooms.push({
            x: r1(p.x),
            y: r1(p.y),
            delay: delay + duration * (at / total) * 0.9,
            scale: 0.75,
            color: vinePetalColor,
        });
    }

    if (a.branch && depth === 0) {
        const at = stemLen * (0.42 + rand() * 0.12);
        const { p } = pointAt(stemPoly, at);
        const ahead = pointAt(stemPoly, at + 1).p;
        const tan = { x: ahead.x - p.x, y: ahead.y - p.y };
        const turn = rand() < 0.5 ? 1 : -1;
        growVine(garden, rand, leafColors, petalColors, speed, {
            S: p,
            heading: rotate(tan, turn * 55),
            bend: tan,
            len: len * 0.42,
            delay: delay + duration * (at / total) * 0.85,
            depth: 1,
            end: rand() < 0.5 ? "curl" : "bloom",
            branch: false,
            tuck: 0,
        });
    }
}

export function buildGarden(
    width: number,
    height: number,
    opts: {
        sprouts: Sprout[];
        seed: number;
        padding: number;
        tuck: number;
        speed: number;
        stagger: number;
        leafColors: string[];
        petalColors: string[];
    },
): Garden {
    const garden: Garden = { stems: [], leaves: [], blooms: [] };
    const rand = createRandom(opts.seed);
    const k = Math.min(1, Math.max(0.6, width / 420));

    opts.sprouts.forEach((s, i) => {
        const { p, n, tan } = edgeFrame(s.edge, s.t, width, height, opts.padding);
        const len = s.length * k;
        growVine(garden, rand, opts.leafColors, opts.petalColors, opts.speed, {
            S: p,
            heading: n,
            bend: mul(tan, s.side),
            len,
            delay: 0.04 + i * opts.stagger,
            depth: 0,
            end: s.end ?? "curl",
            branch: s.branch ?? len > 110,
            tuck: opts.tuck,
            blooms: s.blooms,
        });
    });
    return garden;
}
