var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff, 1);
document.body.appendChild(renderer.domElement);

var geometry = newCurveGeometry(1);
var material = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 4 });

var line = new THREE.Line(geometry, material);
scene.add(line);

var axes = createCartesianAxes();
for (var i = 0; i < axes.length; i++) {
	line.add(axes[i]);
}

camera.position.z = 50;
line.rotation.x = 0.4;
line.rotation.y = -0.8;

function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}
render();

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

function newCurveGeometry(freq, phase) {
    var curve = new THREE.CatmullRomCurve3(getCurve(200, freq, phase));
    curve.closed = true;

    var geometry = new THREE.Geometry();
    geometry.vertices = curve.getPoints(1000);

    return geometry;
}

function createCartesianAxes() {
	var l = 10;
	var axes = [];
    for (var i = 0; i < 3; ++i) {
    	var geometry = new THREE.Geometry();
        var material;
        switch (i) {
        case 0:
        	geometry.vertices.push(new THREE.Vector3(0, 0, 0), new THREE.Vector3(l, 0, 0));
            material = new THREE.LineBasicMaterial({ color: 0xff0000 });
        	break;
        case 1:
        	geometry.vertices.push(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, l, 0));
            material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
        	break;
        case 2:
        	geometry.vertices.push(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, l));
            material = new THREE.LineBasicMaterial({ color: 0x0000ff });
        	break;
        }

    	axes[i] = new THREE.Line(geometry, material);
    }

    return axes;
}

$('#frequency').on('input', function() {
	var freq = this.value;
	scene.getObjectById(line.id).geometry = newCurveGeometry(freq, $('#phase').val() * 2 * Math.PI);
	$('#frequency_value').text(freq);
});

$('#phase').on('input', function() {
	var phase = this.value * 2 * Math.PI;
    scene.getObjectById(line.id).geometry = newCurveGeometry($('#frequency').val(), phase);
    $('#phase_value').text(this.value + ' * 2pi');
});
