const STAFF_IDX_TO_NATURAL_PITCH_CLASS: Map<number, number> = new Map([
    [0, 0],
    [1, 2],
    [2, 4],
    [3, 5],
    [4, 7],
    [5, 9],
    [6, 11],
])
const NATURAL_PITCH_CLASSES = [...STAFF_IDX_TO_NATURAL_PITCH_CLASS.values()]

const STAFF_PITCH_CLASS_TO_NAME: Map<number, string> = new Map([
    [0, "C"],
    [2, "D"],
    [4, "E"],
    [5, "F"],
    [7, "G"],
    [9, "A"],
    [11, "H"],
])

function normalizeOctaves(num: number, octaveSize: number) {
    let normalized = num
    let octavesShifted = 0
    while (normalized < 0) {
        octavesShifted += 1
        normalized += octaveSize
    }
    while (normalized > octaveSize - 1) {
        octavesShifted -= 1
        normalized -= octaveSize
    }
    return {normalized, octavesShifted};
}

function getBaseName(pitchClass: number) {
    const {normalized} = normalizeOctaves(pitchClass, 12)
    return (STAFF_PITCH_CLASS_TO_NAME.get(normalized) ?? STAFF_PITCH_CLASS_TO_NAME.get(normalized - 1))!
}

export function staffIdxToPitchClass(staffIdx: number): number {
    let {normalized, octavesShifted} = normalizeOctaves(staffIdx, 7);

    return STAFF_IDX_TO_NATURAL_PITCH_CLASS.get(normalized % 7)! + 12 * -octavesShifted
}

export function pitchClassToName(pitchClass: number): string {
    const {normalized, octavesShifted} = normalizeOctaves(pitchClass, 12)
    const baseName = getBaseName(pitchClass)
    const isSharp = !NATURAL_PITCH_CLASSES.includes(normalized)

    return baseName + String(-octavesShifted + 5) + (isSharp ? "#" : "")
}