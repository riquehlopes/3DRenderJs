// Many thanks to CodeBurst.io for the basic js setup!
// Reference: https://codeburst.io/creating-and-drawing-on-an-html5-canvas-using-javascript-93da75f001c1
// Auxiliary functions
function vectorAngle (vec1, vec2) {
	inner = math.dot(vec1,vec2)
	norm = math.norm(vec1) * math.norm(vec2)
	return math.acos(inner / norm)
}

// Camera declaration
class Camera {
	constructor (
		position = [-1,0,0], fov = 1,
		direction = [1,0,0], rotation = 0
	) {
		this.position = math.matrix(position)
		this.fov = fov
		this.direction = math.divide(math.matrix(direction), math.norm(direction))
		this.rotation = rotation

		this.rotAngle = vectorAngle(math.matrix([1,0,0]),this.direction)
		this.rotAxis = math.cross(math.matrix([1,0,0]),this.direction)

		if (math.norm(this.rotAxis) != 0) { // Why not work with quartenions and use the cos value instead?
			this.transPosition = math.rotate(position, -this.rotAngle, this.rotAxis)
		} else {
			this.transPosition = this.position
		}
	}

	toCanonical (vec) {
		if (math.norm(this.rotAxis) != 0) {
			vec = math.rotate(vec, -this.rotAngle, this.rotAxis)
		}
		vec = math.add(math.matrix(vec), math.subtract(math.matrix([-this.fov,0,0]), this.transPosition))
		vec = math.rotate(vec, -this.rotation, math.matrix([1,0,0]))
		return vec
	}

	renderPoint (point) {
		point = this.toCanonical(point)
		return math.intersect(point, [-this.fov, 0, 0], [1,0,0,0])
	}
}
// initialize config variables
let canvas, ctx

// setup config variables and start the program
function init () {
	canvas = document.getElementById('3dRender')
	ctx = canvas.getContext('2d')

	const cam = new Camera()
	console.log(cam.renderPoint([1,1,1]))
	// console.log(cam)
}

// wait for the HTML to load
document.addEventListener('DOMContentLoaded', init)
