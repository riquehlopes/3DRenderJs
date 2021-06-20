// Many thanks to CodeBurst.io for the basic js setup!
// Reference: https://codeburst.io/creating-and-drawing-on-an-html5-canvas-using-javascript-93da75f001c1

// initialize config variables
let canvas, ctx

// setup config variables and start the program
function init () {
	canvas = document.getElementById('3dRender')
	ctx = canvas.getContext('2d')
}

// wait for the HTML to load
document.addEventListener('DOMContentLoaded', init)
