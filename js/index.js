// Many thanks to CodeBurst.io for the basic js setup!
// Reference: https://codeburst.io/creating-and-drawing-on-an-html5-canvas-using-javascript-93da75f001c1
// Auxiliary functions
function vectorAngle (vec1, vec2) {
	inner = math.dot(vec1,vec2)
	norm = math.norm(vec1) * math.norm(vec2)
	return math.acos(inner / norm)
}
class Cube {
	constructor (
		origin = [1,1,-1], size = 2
	) {
		this.p1 = origin
		this.p2 = math.add(origin, [0,size,0])
		this.p3 = math.add(origin, [size,size,0])
		this.p4 = math.add(origin, [size,0,0])

		this.p5 = math.add(origin, [0,0,size])
		this.p6 = math.add(origin, [0,size,size])
		this.p7 = math.add(origin, [size,size,size])
		this.p8 = math.add(origin, [size,0,size])
	}

	draw (camera, ctx, width, height) {
		let p1 = camera.renderPoint(this.p1)
		let p2 = camera.renderPoint(this.p2)
		let p3 = camera.renderPoint(this.p3)
		let p4 = camera.renderPoint(this.p4)

		let p5 = camera.renderPoint(this.p5)
		let p6 = camera.renderPoint(this.p6)
		let p7 = camera.renderPoint(this.p7)
		let p8 = camera.renderPoint(this.p8)

		let points = [p1,p2,p3,p4,p5,p6,p7,p8]

		let lines = [[p1,p2], [p2,p3], [p3,p4], [p4,p1],
				[p1,p5], [p2,p6], [p3,p7], [p4, p8],
				[p5,p6], [p6,p7], [p7,p8], [p8,p5]]

		for (let point of points) {
			let x = point[0]
			let y = point[1]
			ctx.fillRect(width/2 - 5 + x,height/2 - 5 - y, 10, 10)
		}
		ctx.beginPath()
		for (let line of lines) {
			ctx.moveTo(width/2 + line[0][0], height/2 - line[0][1])
			ctx.lineTo(width/2 + line[1][0], height/2 - line[1][1])
		}
		ctx.stroke()
	}
}

// Camera declaration
class Camera {
	constructor (
		position = [-100,0,0], fov = 100,
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
		point = math.intersect(point, [-this.fov, 0, 0], [1,0,0,0])._data
		return [point[1],point[2]]
	}

	transform(move = [0,0,0], rotate = [0,0,0]){
		// Moves camera position
		const new_position = math.add([-this.fov,0,0], move)
		this.transPosition = math.subtract(new_position, math.subtract([-this.fov, 0, 0], this.transPosition))
		if (math.norm(this.rotAxis) != 0) {
			this.position = math.rotate(this.transPosition, this.rotAngle, this.rotAxis)
		} else {
			this.position = this.transPosition
		}

		// Rotates camera direction vector in x,y,z
		this.rotation = this.rotation + rotate[0]
		let new_direction = math.rotate([1,0,0], rotate[1], [0,1,0])
		new_direction = math.rotate(new_direction, rotate[2], [0,0,1])
		if (math.norm(this.rotAxis) != 0) {
			new_direction = math.rotate(new_direction, this.rotAngle, this.rotAxis)
		}
		this.direction = math.divide(new_direction, math.norm(new_direction))

		this.rotAngle = vectorAngle(math.matrix([1,0,0]),this.direction)
		this.rotAxis = math.cross(math.matrix([1,0,0]),this.direction)
	}
}
// initialize config variables
let canvas, ctx, camera, cube

// setup config variables and start the program
function init () {
	canvas = document.getElementById('3dRender')
	ctx = canvas.getContext('2d')

	camera = new Camera()

	cube = new Cube([100, -100, -100], 200)
	cube.draw(camera, ctx, canvas.clientWidth, canvas.clientHeight)
}
function update() {
	ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)
	cube.draw(camera, ctx, canvas.clientWidth, canvas.clientHeight)
}
function move(direction){
	let step = 10
	switch(direction){
		case "up":
			camera.transform([0,0,step])
			break
		case "left":
			camera.transform([0,-step,0])
			break
		case "right":
			camera.transform([0,step,0])
			break
		case "down":
			camera.transform([0,0,-step])
			break
	}
	requestAnimationFrame(update)
}
function rotate(direction){
	let angle = Math.PI / 12
	switch(direction){
		case "y-":
			camera.transform([0,0,0], [0,-angle,0])
			break
		case "z+":
			camera.transform([0,0,0], [0,0,angle])
			break
		case "z-":
			camera.transform([0,0,0], [0,0,-angle])
			break
		case "y+":
			camera.transform([0,0,0], [0,angle,0])
			break
	}
	requestAnimationFrame(update)
}

document.querySelector("body").addEventListener("keydown", function(event){
	var key = event.key
	switch(key.toLowerCase()){
		case "w":
			console.log("Arriba")
			break

		case "a":
			console.log("esquerda")
			break

		case "d":
			console.log("Direia")
			break

		case "s":
			console.log("Prabaxo")
			break
	}
})

// wait for the HTML to load
document.addEventListener('DOMContentLoaded', init)
