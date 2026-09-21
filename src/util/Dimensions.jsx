export class Dimensions {
    constructor(dimensions) {
        this.dimensions = dimensions
        this.x = dimensions[0]
        this.y = dimensions[1]
        this.z = dimensions[2]
        this.maxDimension = Math.max(...dimensions)
    } 
}