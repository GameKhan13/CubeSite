import { Vector3 } from "three"

/**
 * Compute heavy class for slicing the cube into segments, storing all results in this object
 * The slices are uniform cubes but conform to the bounds of (-1, -1, -1) to (1, 1, 1)
 * @param dimensions an array of three values representing the x, y, z dimensions of a cube
 * 
 */
export default class Slicer {
    constructor(dimensions) {
        this.dimensions = new Vector3().fromArray(dimensions) // the original input
        this.maxDimension = Math.max(...dimensions) // the highest dimension
        this.sliceSize = 2/this.maxDimension // the width of each slice
        this.xSlices = [] // the center points for each x slice
        this.ySlices = [] // the center points for each y slice
        this.zSlices = [] // the center points for each z slice

        for (let x = 0; x < this.dimensions.x; x++) {
            this.xSlices.push(
                (x+(1-this.dimensions.x)*0.5)*this.sliceSize,
            )
        }

        for (let y = 0; y < this.dimensions.y; y++) {
            this.ySlices.push(
                (y+(1-this.dimensions.y)*0.5)*this.sliceSize,
            )
        }

        for (let z = 0; z < this.dimensions.z; z++) {
            this.zSlices.push(
                (z+(1-this.dimensions.z)*0.5)*this.sliceSize,
            )
        }
    } 
}