import styles from "./Staff.module.css"
import {MouseContextProvider} from "../../contexts/MousePositionContext.tsx";
import {StaffLine, type StaffLineState} from "../StaffLine/StaffLine.tsx";
import {type StaffIdx, staffIdxToPitchClass} from "../../utils/notes.ts";


type StaffProps = {
    startStaffIdx: StaffIdx; // index of the bottommost staff line
    endStaffIdx: StaffIdx; // index of the topmost staff line
    isOutOfBounds: (idx: StaffIdx) => boolean;
    staffState: Map<StaffIdx, StaffLineState>;
    setStaffState: (states: Map<StaffIdx, StaffLineState>) => void;
}

export function Staff({startStaffIdx, endStaffIdx, staffState, setStaffState, isOutOfBounds}: StaffProps) {
    const setStaffLineState = (staffIdx: StaffIdx) => (state: StaffLineState) => {
        const newStaffState = new Map(staffState)
        newStaffState.set(staffIdx, state)
        setStaffState(newStaffState)
    }

    return (
        <div>
            <div className={styles.staffContainer}>
                <MouseContextProvider>
                    {[...Array(Math.abs(startStaffIdx - endStaffIdx))].map((_, i) => (
                        <StaffLine key={i}
                                   state={staffState.get(endStaffIdx - i as StaffIdx) ?? {
                                       isActive: false,
                                       modifier: 0,
                                       naturalPitchClass: staffIdxToPitchClass(endStaffIdx - i as StaffIdx)
                                   }}
                                   setState={setStaffLineState(endStaffIdx - i as StaffIdx)}
                                   line={(endStaffIdx - i) % 2 != 0}
                                   outOfBounds={isOutOfBounds(endStaffIdx - i as StaffIdx)}
                                   totalLines={Math.abs(startStaffIdx - endStaffIdx)}
                        />
                    ))}
                </MouseContextProvider>
            </div>
        </div>
    )
}