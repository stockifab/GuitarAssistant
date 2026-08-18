import type {FretboardState} from "../components/Fretboard/Fretboard.tsx";
import {type PitchClass} from "../utils/notes.ts";
import {noteToColor} from "../utils/visualization.ts";

export type FretIdx = number & { readonly __brand: unique symbol };
export type StringIdx = number & { readonly __brand: unique symbol };

export type FretboardString = PitchClass & { readonly __stringBrand: unique symbol };

export class FretboardVisualization {
    strings: FretboardString[] = []
    fretCount: number = 0

    private dots: Map<FretboardString, { fret: FretIdx, color: string }[]> = new Map()
    private stringHighlights: Map<FretboardString, { color: string }> = new Map()

    /**
     *
     * @param stringTuning Ordered array of strings with their tuning as pitch class
     * @param fretCount Number of frets on the fretboard
     */
    constructor(stringTuning: FretboardString[], fretCount: number) {
        this.strings = stringTuning
        this.fretCount = fretCount
    }

    noteDots(notes: PitchClass[]) {
        for (const note of notes) {
            for (const string of this.strings) {
                const fret = this.getNoteFretsOnString(string, note)
                if (fret == undefined) continue;

                const currentDots = this.dots.get(string) ?? []
                this.dots.set(string, [...currentDots, {fret, color: noteToColor(note)}])
            }
        }

        return this
    }

    stringHighlight(notes: PitchClass[]) {
        for (const note of notes) {
            const stringForNote = this.strings.find(string => (string as number) == (note as number))
            if (stringForNote) {
                this.stringHighlights.set(stringForNote, {color: noteToColor(note)})
            }
        }
        return this
    }

    toFretboardState(): FretboardState {
        return {
            stringsCount: this.strings.length,
            fretCount: this.fretCount,
            dots: this.dotsToFretboardStateDots(),
            stringsHighlights: this.stringHighlightsToFretboardState()
        }
    }

    private getNoteFretsOnString(string: FretboardString, note: PitchClass): FretIdx | undefined {
        const fretIdx = ((note as number) - (string as number)) as FretIdx
        if (fretIdx < 0 || fretIdx > this.fretCount) {
            return undefined
        }
        return fretIdx
    }

    private dotsToFretboardStateDots(): FretboardState["dots"] {
        const dots: FretboardState["dots"] = new Map()

        for (const [string, dotsOnString] of this.dots) {
            for (const dotOnString of dotsOnString) {
                const currentFretDots = dots.get(dotOnString.fret) ?? [];
                dots.set(dotOnString.fret, [...currentFretDots, {
                    stringIdx: this.strings.indexOf(string) as StringIdx,
                    color: dotOnString.color
                }])
            }
        }

        return dots
    }

    private stringHighlightsToFretboardState(): FretboardState["stringsHighlights"] {
        const highlights: FretboardState["stringsHighlights"] = new Map()
        for (const [string, highlight] of this.stringHighlights.entries()) {
            highlights.set(this.strings.indexOf(string) as StringIdx, {color: highlight.color})
        }
        return highlights;
    }
}