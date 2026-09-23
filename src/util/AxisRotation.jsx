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
    }
    
    /**
     * 
     */
    rotate(rotationData, invert, double) {
        const rquaternion = new Quaternion().copy(this.rotationQuaternion)
        if (invert^this.position>=0) {
            rquaternion.invert()
        }
        if (double) {
            rquaternion.premultiply(rquaternion)
        }

        rotationData.forEach(({position, quaternion}) => {
            position.applyQuaternion(rquaternion)
            quaternion.premultiply(rquaternion)
        });

        this.dimensionScale.applyQuaternion(rquaternion)
        return this.dimensionScale.set(
            Math.abs(this.dimensionScale.x),
            Math.abs(this.dimensionScale.y),
            Math.abs(this.dimensionScale.z)
        )
    }
}