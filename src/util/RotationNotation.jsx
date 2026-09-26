

export default class RotationNotation {
    constructor(name) {
        const match = name.match(/^(\d*)([a-zA-Z])(['2]?)$/)
        if (match) {
            this.inset = match[1] || ""
            this.side = match[2]
            this.rotation = match[3] || ""
        } else {
            console.log(name, "Invalid Name");
            
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
     * 
     */
    setRotation(rotation) {
        this.rotation = rotation
        return this
    }

    /**
     * 
     */
    toString() {
        return this.inset+this.side+this.rotation
    }

    /**
     * 
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
        clone.rotation = 
            this.rotation==="2"?"2"
            :this.rotation==="'"?""
            :"'"
        return clone
    }
}