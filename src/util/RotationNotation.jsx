/**
 * converts a move name into an easily accessible format to look at individual elements
 * @param name
 */
export default class RotationNotation {
    constructor(name) {
        /* match is: 
            an optional number of any length if the following letter is not M, E or S
            follwed by a single letter of (L, U, F, R, D, B, M, E, S)
            then an optional ' or 2
        */
        const match = name.match(/^(?!\d+[MES])(\d*)([LUFRDBMES])(['2]?)/)
        if (match) {
            this.inset = match[1] || ""
            this.side = match[2]
            this.rotation = match[3] || ""
        } else {
            console.error(name, "Invalid Name");
            
            this.inset = ""
            this.side = "ERROR"
            this.rotation = ""
        }
        this.axis = (
            (this.side==="L" || this.side==="R" || this.side==="M")?0:
            (this.side==="U" || this.side==="D" || this.side==="E")?1:
            (this.side==="F" || this.side==="B" || this.side==="S")?2:
            null
        )
    }

    /**
     * overwrites the rotation of this object
     * @returns self
     */
    setRotation(rotation) {
        this.rotation = rotation
        return this
    }

    /**
     * @returns a displayable string
     */
    toString() {
        return this.inset+this.side+this.rotation
    }

    /**
     * @returns a clone of this object
     */
    clone() {
        return Object.assign(
            Object.create(Object.getPrototypeOf(this)),
            this
        )
    }

    /**
     * 
     * @returns a clone with the rotation direction flipped
     */
    fliped() {
        const clone = this.clone()
        return clone.setRotation(
            this.rotation==="2"?"2"
            :this.rotation==="'"?""
            :"'"
        )
    }
}