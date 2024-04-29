// const { mat4, vec3, vec4 } = glMatrix

class CoordinateSystem {
  constructor({
    origin = [0, 0, 0],
    originX = [1, 0, 0],
    psi = 0,
  } = {}) {
    this.X = vec3.create()
    this.Y = vec3.create()
    this.Z = vec3.create()
    this.matrix = mat4.create()

    this.createCoordinateSystem({origin, originX, psi}) 
  }

  createCoordinateSystem({
    origin = [0, 0, 0],
    originX = [1, 0, 0],
    psi = 0,
  }) {
    const X = vec3.subtract(vec3.create(), originX, origin)
    vec3.normalize(this.Z, X)

    const globalZ = vec3.fromValues(0, 0, 1)
    let Y = vec3.cross(vec3.create(), X, globalZ)
    if (vec3.length(Y) < 0.01) {
        vec3.cross(Y, X, vec3.fromValues(0, 1, 0));
    }
    vec3.normalize(Y, Y);

    const adjustmentMatrix = mat4.create()
    mat4.rotate(adjustmentMatrix, adjustmentMatrix, psi, X)
    Y = vec3.transformMat4(vec3.create(), Y, adjustmentMatrix)
    vec3.normalize(this.Z, Y)

    const Z = vec3.cross(vec3.create(), X, Y)
    vec3.normalize(this.Z, Z)

    this.matrix = mat4.fromValues(
        X[0], Y[0], Z[0], 0,
        X[1], Y[1], Z[1], 0,
        X[2], Y[2], Z[2], 0,
        -vec3.dot(X, origin), -vec3.dot(Y, origin), -vec3.dot(Z, origin), 1
    )
  }

  convertToLocalCoordinates(globalPoint) {
    return vec3.transformMat4(vec3.create(), globalPoint, this.matrix)
  }

  convertToGlobalCoordinates(localPoint) {
    return vec3.transformMat4(vec3.create(), localPoint, mat4.invert(mat4.create(), this.matrix))
  }

}