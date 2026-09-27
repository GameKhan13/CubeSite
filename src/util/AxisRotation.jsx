import { Box3, Quaternion, Vector3 } from "three"
import { PI } from "three/tsl"

export default class AxisRotation {
    constructor(slicer, axis, position) {
        this.axis = axis
        this.position = position
        this.axisDimension = (
            slicer.dimensions.x *
            slicer.dimensions.y * 
            slicer.dimensions.z /
            slicer.dimensions.getComponent(axis)
        )
        this.axisNormal = new Vector3(
            +(axis===0), 
            +(axis===1), 
            +(axis===2)
        )
        this.basis1 = new Vector3(
            +(axis===1), 
            +(axis===2), 
            +(axis===0)
        )
        this.basis2 = new Vector3(
            +(axis===2), 
            +(axis===0), 
            +(axis===1)
        )
        this.axisPlane = new Vector3(1, 1, 1).sub(this.axisNormal)
        this.center = new Vector3().copy(this.axisNormal).multiplyScalar(position)
        this.rotationQuaternion = new Quaternion().setFromAxisAngle(
            this.axisNormal,
            PI.value/2
        )
        this.collision = new Box3(
            new Vector3().copy(this.center).sub(this.axisPlane),
            new Vector3().copy(this.center).add(this.axisPlane)
        )
        this.dimensionScale = new Vector3().copy(slicer.dimensions).multiplyScalar(slicer.sliceSize).multiply(this.axisPlane)
        this.square = this.axisDimension === (new Vector3().copy(this.axisPlane).multiply(slicer.dimensions).lengthSq()/2)

        const distanceFromFace = (
            Math.ceil(slicer.dimensions.getComponent(axis)/2)
            - Math.floor(Math.abs(position)/slicer.sliceSize)
        )

        this.moveName = ""+(distanceFromFace>1?distanceFromFace:"")


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
     * 
     */
    rotate(rotationData, invert, double) {
        const rquaternion = new Quaternion().copy(this.rotationQuaternion)
        if (invert^this.position>=0) {
            rquaternion.invert()
        }
        if (double || !this.square) {
            rquaternion.premultiply(rquaternion)
        }

        rotationData.forEach(({position, quaternion}) => {
            position.applyQuaternion(rquaternion)
            quaternion.premultiply(rquaternion)
        });
        
        return this.moveName + (double||!this.square?"2":invert?"'":"")
    }
}