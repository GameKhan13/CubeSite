import { Box3, Quaternion, Vector3 } from "three"


/**
 * Compute heavy class for storing the rotation data for a layer
 * @param slicer the slicer object for the cube
 * @param axis the axis of this layer
 * @param position the position on the axis of this layer
 */
export default class AxisRotation {
    constructor(slicer, axis, position) {
        this.axis = axis
        this.position = position
        this.axisDimension = ( // the number of cubes that should be on this layer
            slicer.dimensions.x *
            slicer.dimensions.y * 
            slicer.dimensions.z /
            slicer.dimensions.getComponent(axis)
        )
        this.axisNormal = new Vector3( // vector that is perpendicular to the plane
            +(axis===0), 
            +(axis===1), 
            +(axis===2)
        )
        this.basis1 = new Vector3( // arbitrairy vector that is not the normal
            +(axis===1), 
            +(axis===2), 
            +(axis===0)
        )
        this.basis2 = new Vector3( // arbitrairy vector that is not the normal
            +(axis===2), 
            +(axis===0), 
            +(axis===1)
        )
        this.axisPlane = new Vector3(1, 1, 1).sub(this.axisNormal) // the sum of basis vectors
        this.center = new Vector3().copy(this.axisNormal).multiplyScalar(position) // the worldspace center for the layer
        this.rotationQuaternion = new Quaternion().setFromAxisAngle( // the standard rotation quaternion for the layer
            this.axisNormal,
            Math.PI/2
        )
        this.collision = new Box3( // the collision box for the layer
            new Vector3().copy(this.center).sub(this.axisPlane),
            new Vector3().copy(this.center).add(this.axisPlane)
        )
        this.dimensionScale = new Vector3().copy(slicer.dimensions).multiplyScalar(slicer.sliceSize).multiply(this.axisPlane) // the relative size of each of the dimensions
        this.square = this.axisDimension === (new Vector3().copy(this.axisPlane).multiply(slicer.dimensions).lengthSq()/2) // if the dimension scale has equal lengths

        const distanceFromFace = (
            Math.ceil(slicer.dimensions.getComponent(axis)/2)
            - Math.floor(Math.abs(position)/slicer.sliceSize)
        )

        this.moveName = ""+(distanceFromFace>1?distanceFromFace:"") // the standard name for this layers move


        switch (axis) {
            case 0:
                this.moveName = (
                    position===0?"M"
                    :position<0?this.moveName+"L"
                    :this.moveName+"R"
                )
                break
            case 1:
                this.moveName = (
                    position===0?"E"
                    :position<0?this.moveName+"D"
                    :this.moveName+"U"
                )
                break
            case 2:
                this.moveName = (
                    position===0?"S"
                    :position<0?this.moveName+"B"
                    :this.moveName+"F"
                )
                break
            default:
                this.moveName = "ERROR"
        }
    }

    /**
     * @returns the quaternion to rotate by based on the invert and double flags
     */
    getQuaternion(invert, double) {
        const quaternion = new Quaternion().copy(this.rotationQuaternion)
        if (invert^this.position>=0) {
            quaternion.invert()
        }
        if (double || !this.square) {
            quaternion.premultiply(quaternion)
        }

        return {
            quaternion: quaternion,
            moveName: this.moveName + (double||!this.square?"2":invert?"'":"")
        }
    }
}