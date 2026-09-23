import { Box3, Quaternion, Vector3 } from "three"
import { PI } from "three/tsl"

export default class AxisRotation {
    constructor(slicer, axis, position) {
        this.axis = axis
        this.position = position
        this.axisDimension = (
            slicer.x *
            slicer.y * 
            slicer.z /
            slicer.dimensions[axis]
        )
        this.axisNormal = new Vector3(
            (axis===0), 
            (axis===1), 
            (axis===2)
        )
        this.center = new Vector3().copy(this.axisNormal).multiplyScalar(position)
        this.minCorner = new Vector3().copy(this.axisNormal).addScalar(-1).add(this.center)
        this.maxCorner = new Vector3().copy(this.axisNormal).multiplyScalar(-1).addScalar(1).add(this.center)
        this.collision = new Box3(
            this.minCorner,
            this.maxCorner
        )
        this.rotationQuaternion = new Quaternion().setFromAxisAngle(
            this.axisNormal,
            PI.value/2
        )
        this._offset = new Vector3()
    }
    
    /**
     * 
     */
    rotate(position, quaternion, invert, double) {
        const rquaternion = new Quaternion().copy(this.rotationQuaternion)
        if (invert^this.position>=0) {
            rquaternion.invert()
        }
        if (double) {
            rquaternion.premultiply(rquaternion)
        }

        this._offset.copy(position).sub(this.center)
        this._offset.applyQuaternion(rquaternion)
        position.copy(this.center).add(this._offset)
        quaternion.premultiply(rquaternion)
    }
}