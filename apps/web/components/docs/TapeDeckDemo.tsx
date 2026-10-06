"use client"

import { TapeCover, TapeDeck, type TapeItem } from "@workspace/ui/components/ui/tape-deck"

// Sample tapes. Covers are plain CSS backgrounds, so no images are needed.
const TAPES: TapeItem[] = [
    { id: "night-bus", title: "Night Bus Home", artist: "Lowercase Lions", bpm: 88,
        cover: <TapeCover background="#2fc0c9" color="#0b2e33" text={"NIGHT\nBUS"} side="A" /> },
    { id: "copper", title: "Copper Summer", artist: "The Ferrous Two", bpm: 96,
        cover: <TapeCover background="repeating-linear-gradient(90deg,#e4572e 0 18px,#f3a712 18px 36px,#29335c 36px 54px)" color="#fff" text="COPPER" side="B" /> },
    { id: "static-bloom", title: "Static Bloom", artist: "Mara Venn", bpm: 102,
        cover: <TapeCover background="#efe9dc" font="hand" text="static bloom" side="90" /> },
    { id: "checker", title: "Checkerboard Heart", artist: "Pilot Arcade", bpm: 110,
        cover: <TapeCover background="conic-gradient(#ffd23f 25%,#3bceac 0 50%,#ee4266 0 75%,#540d6e 0) 0 0/22px 22px" color="#fff" text="CHECKER" /> },
    { id: "escalator", title: "Slow Escalator", artist: "Ines & the Hum", bpm: 84,
        cover: <TapeCover background="linear-gradient(#1d1d1d 0 60%,#c8b6ff 60%)" color="#c8b6ff" font="mono" text="SLOW ESCALATOR" side="C60" /> },
    { id: "satellites", title: "Paper Satellites", artist: "Kofi Rundgren", bpm: 92,
        cover: <TapeCover background="#f4f0e6" color="#1f4e8c" text={"PAPER\nSATELLITES"} /> },
    { id: "red-line", title: "Red Line Express", artist: "Junction Nine", bpm: 118,
        cover: <TapeCover background="linear-gradient(#d7263d 0 70%,#ffe156 70% 76%,#d7263d 76%)" color="#ffe156" text="RED LINE" side="A" /> },
    { id: "sunroom", title: "Sunroom Tapes", artist: "Halcyon Club", bpm: 98,
        cover: <TapeCover background="radial-gradient(circle at 80% 100%,#ff9f1c 0 18px,#ffbf69 18px 34px,#fff3d6 34px)" color="#8a4b08" text="SUNROOM" /> },
    { id: "mint", title: "Mint Condition", artist: "Twelve Tone Tim", bpm: 114,
        cover: <TapeCover background="#9be7c4" color="#114b36" text={"MINT\nCONDITION"} side="C90" /> },
]

export function TapeDeckDemo() {
    return <TapeDeck tapes={TAPES} className="!h-[560px] !rounded-xl !border-0" />
}
