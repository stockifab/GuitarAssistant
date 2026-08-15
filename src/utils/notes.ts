import {invertMap} from "./mapUtils.ts";

/**
 * Represents a pitch class.
 * C5 is defined with a pitch class of 0, subtract or add 1 for each halftone.
 */
export type PitchClass = number & { readonly __brand: unique symbol }
/**
 * Represents the index of a staff line.
 * This means it has no modifier information attached
 */
export type StaffIdx = number & { readonly __brand: unique symbol }

const STAFF_IDX_TO_NATURAL_PITCH_CLASS: Map<number, PitchClass> = new Map([
    [0, 0],
    [1, 2],
    [2, 4],
    [3, 5],
    [4, 7],
    [5, 9],
    [6, 11],
]) as Map<number, PitchClass>
const NATURAL_PITCH_CLASSES = [...STAFF_IDX_TO_NATURAL_PITCH_CLASS.values()]

const STAFF_PITCH_CLASS_TO_NAME: Map<PitchClass, string> = new Map([
    [0, "C"],
    [2, "D"],
    [4, "E"],
    [5, "F"],
    [7, "G"],
    [9, "A"],
    [11, "H"],
]) as Map<PitchClass, string>
const STAFF_NAME_TO_PITCH_CLASS = invertMap(STAFF_PITCH_CLASS_TO_NAME)

/**
 * Adjusts a given number to fit within a single octave (0-octaveSize), shifting the number up or down as needed,
 * and returning the number of octaves shifted.
 *
 * @param {number} num - The number to normalize within the octave range.
 * @param {number} octaveSize - The size of the octave within which the number should be normalized.
 * @return {{normalized: number, octavesShifted: number}} An object containing `normalized`,
 * the adjusted number within the octave range, and `octavesShifted`, the count of octaves shifted.
 */
function normalizeOctaves<T extends number>(num: T, octaveSize: number): { normalized: T; octavesShifted: number; } {
    let normalized = num
    let octavesShifted = 0
    while (normalized < 0) {
        octavesShifted += 1
        normalized = (normalized + octaveSize) as T
    }
    while (normalized > octaveSize - 1) {
        octavesShifted -= 1
        normalized = (normalized - octaveSize) as T
    }
    return {normalized, octavesShifted};
}

/**
 * Retrieves the base name corresponding to a given pitch class.
 * The base name is the name of the *normalized* note without modifiers (sharp or flat).
 *
 * @param {PitchClass} pitchClass - The pitch class to convert into a base name.
 * @return {string} The base name associated with the provided pitch class.
 */
function getBaseName(pitchClass: PitchClass): string {
    const {normalized} = normalizeOctaves(pitchClass, 12)
    return (STAFF_PITCH_CLASS_TO_NAME.get(normalized) ?? STAFF_PITCH_CLASS_TO_NAME.get((normalized - 1) as PitchClass))!
}

/**
 * Converts a staff index to its corresponding pitch class.
 *
 * @param staffIdx The staff index to be converted.
 * @return The pitch class corresponding to the given staff index.
 */
export function staffIdxToPitchClass(staffIdx: StaffIdx): PitchClass {
    let {normalized, octavesShifted} = normalizeOctaves(staffIdx, 7);

    return (STAFF_IDX_TO_NATURAL_PITCH_CLASS.get(normalized % 7)! + 12 * -octavesShifted) as PitchClass
}

/**
 * Converts a pitch class to its corresponding musical note name.
 *
 * @param {PitchClass} pitchClass - The pitch class.
 * @return {string} The musical note name in string format, including octave and sharp indication.
 */
export function pitchClassToName(pitchClass: PitchClass): string {
    const {normalized, octavesShifted} = normalizeOctaves(pitchClass, 12)
    const baseName = getBaseName(pitchClass)
    const isSharp = !NATURAL_PITCH_CLASSES.includes(normalized)

    return baseName + String(-octavesShifted + 5) + (isSharp ? "#" : "")
}

/**
 * Converts a musical note name to its corresponding pitch class.
 *
 * @param {string} name - The musical note name, which may include the pitch letter,
 *                        accidentals (# or b), and an octave number.
 * @return {PitchClass} The calculated pitch class.
 */
export function nameToPitchClass(name: string): PitchClass {
    const staffPitchClass = STAFF_NAME_TO_PITCH_CLASS.get(name[0]!)!;
    const hasModifier = name.includes("#") || name.includes("b");
    const modifier = hasModifier ? (name.includes("#") ? 1 : -1) : 0;
    const octave = parseInt(name.slice(1, hasModifier ? -1 : undefined)) - 5;

    return (staffPitchClass + 12 * octave + modifier) as PitchClass;
}