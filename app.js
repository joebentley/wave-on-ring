var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Create the renderer
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff, 1);
document.body.appendChild(renderer.domElement);

// Generate and add the curve
var geometry = newCurveGeometry(1);
var material = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 4 });
var line = new THREE.Line(geometry, material);
scene.add(line);

// Generate axes and add them
var axes = createCartesianAxes();
for (var i = 0; i < axes.length; i++) {
	scene.add(axes[i]);
}

// Set camera and transform scene to a nice perspective
camera.position.z = 50;
scene.rotation.x = 0.4;
scene.rotation.y = -0.8;

// Main render function
function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}
render();

// Create a new set of `n` points that the curve will pass through
function getCurve(n, freq, phase) {
	var res = [];
    var interval = 2 * Math.PI / n;
    var angle = 0;
    var radius = 20;
    var magnitude = 5;

	for (var i = 0; i < n; i++) {
    	y = magnitude * Math.sin(angle * freq + phase);
    	res[i] = new THREE.Vector3(radius * Math.cos(angle), y, radius * Math.sin(angle));
	    angle += interval;
    }

    return res;
}

// Generate a new Geometry from a CatmullRomCurve3 passing through points from getCurve
function newCurveGeometry(freq, phase) {
    var curve = new THREE.CatmullRomCurve3(getCurve(200, freq, phase));
    curve.closed = true;

    var geometry = new THREE.Geometry();
    geometry.vertices = curve.getPoints(1000);

    return geometry;
}

// Generate Array of Object3Ds that represent the coordinate axes
function createCartesianAxes() {
	var l = 10;
	var axes = [];
    for (var i = 0; i < 3; ++i) {
    	var geometry = new THREE.Geometry();
        var material;
        switch (i) {
        case 0: // x
        	geometry.vertices.push(new THREE.Vector3(0, 0, 0), new THREE.Vector3(l, 0, 0));
            material = new THREE.LineBasicMaterial({ color: 0xff0000 });
        	break;
        case 1: // y
        	geometry.vertices.push(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, l, 0));
            material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
        	break;
        case 2: // z
        	geometry.vertices.push(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, l));
            material = new THREE.LineBasicMaterial({ color: 0x0000ff });
        	break;
        }

    	axes[i] = new THREE.Line(geometry, material);
    }

    return axes;
}

/* Page events */

$('#frequency').on('input', function() {
	var freq = this.value;
	// Generate a new curve geometry and edit the current line Object3D with new frequency
	scene.getObjectById(line.id).geometry = newCurveGeometry(freq, $('#phase').val() * 2 * Math.PI);
	$('#frequency_value').text(freq);
});

$('#phase').on('input', function() {
	var phase = this.value * 2 * Math.PI;
	// Generate a new curve geometry and edit the current line Object3D with new phase
    scene.getObjectById(line.id).geometry = newCurveGeometry($('#frequency').val(), phase);
    $('#phase_value').text(this.value + ' * 2pi');
});

$('#allow_non_integer').change(function() {
	// Change step size for the frequency slider to show non-integer discontinuity
	if (this.checked) {
		$('#frequency').prop('step', 0.1);
	} else {
		$('#frequency').prop('step', 1);
	}
});
