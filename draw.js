var drawingManager;
var selectedShape;
var colors = [ '#1E90FF', '#FF1493', '#32CD32', '#FF8C00', '#4B0082' ];
var selectedColor;
var nextColor = 1;
var colorButtons = {};

var zones = [];

function clearSelection() {
	if (selectedShape) {
		selectedShape.setEditable(false);
		selectedShape = null;
	}
}

function setSelection(shape) {
	clearSelection();
	selectedShape = shape;
	selectedShape.setEditable(true);
	selectColor(shape.get('fillColor') || shape.get('strokeColor'));
}

function deleteSelectedShape() {
	if (selectedShape) {
		selectedShape.setMap(null);
		infowindow.close();
	}
}

function selectColor(color) {
	selectedColor = color;
	for ( var i = 0; i < colors.length; ++i) {
		var currColor = colors[i];
		colorButtons[currColor].style.border = currColor == color ? '2px solid #789'
				: '2px solid #fff';
	}

	// Retrieves the current options from the drawing manager and replaces the
	// stroke or fill color as appropriate.
	var polygonOptions = drawingManager.get('polygonOptions');
	polygonOptions.fillColor = color;
	drawingManager.set('polygonOptions', polygonOptions);
}

function setSelectedShapeColor(color) {
	if (selectedShape) {
		if (selectedShape.type == google.maps.drawing.OverlayType.POLYLINE) {
			selectedShape.set('strokeColor', color);
		} else {
			selectedShape.set('fillColor', color);
		}
	}
}

function makeColorButton(color) {
	var button = document.createElement('span');
	button.className = 'color-button';
	button.style.backgroundColor = color;
	google.maps.event.addDomListener(button, 'click', function() {
		selectColor(color);
		setSelectedShapeColor(color);
	});

	return button;
}

function buildColorPalette() {
	var panel = document.createElement('div');
	panel.id = 'panel';

	var colorPalette = document.createElement('div');
	colorPalette.id = 'color-palette';

	panel.appendChild(colorPalette);

	for ( var i = 0; i < colors.length; ++i) {
		var currColor = colors[i];
		var colorButton = makeColorButton(currColor);
		colorPalette.appendChild(colorButton);
		colorButtons[currColor] = colorButton;
	}
	selectColor(colors[0]);

	return panel;
}

function build_delete_button() {
	var button = document.createElement('button');
	button.id = 'delete_zone';
	button.style.float = 'center';
	button.innerHTML = "<span class='label'>Eliminar zona</span>";
	button.onclick = deleteSelectedShape;
	return button;
}

var overlayCompleteClosure = function(e) {
	if (e.type != google.maps.drawing.OverlayType.MARKER) {
		// Switch back to non-drawing mode after drawing a
		// shape.
		drawingManager.setDrawingMode(null);

		// Crear pseudo-barrio a partir de lo seleccionado
		var b = new Barrio();
		b.name = 'Zona ' + (zones.length + 1);
		b.polygon = e.overlay;
		b.polygon.set('barrio', b);

		// Add click event listener for the new polygon
		google.maps.event.addListener(b.polygon, 'click', function(event) {
			var barrio = this.get('barrio');
			var container = document.createElement('div');

			var titulo = document.createElement('h1');
			titulo.innerHTML = b.name;

			var button = build_delete_button();

			container.style.textAlign = 'center';
			container.appendChild(titulo);
			container.appendChild(button);

			infowindow.setContent(container);
			infowindow.setPosition(event.latLng);
			infowindow.open(map);

			// Fill table
			fillTable(barrio);

			setSelection(b.polygon);

		});

		zones.push(b);
		setSelection(b.polygon);
		selectColor(colors[nextColor++ % colors.length]);
	}
};

function init_drawing() {
	var polyOptions = {
		strokeWeight : 0,
		fillOpacity : 0.45,
		editable : true
	};
	// Creates a drawing manager attached to the map that allows
	// the user to draw markers, lines, and shapes.
	drawingManager = new google.maps.drawing.DrawingManager({
		drawingControl : false,
		polygonOptions : polyOptions,
		map : map
	});

	google.maps.event.addListener(drawingManager, 'overlaycomplete',
			overlayCompleteClosure);

	// Clear the current selection when the drawing mode is changed, or when the
	// map is clicked.
	google.maps.event.addListener(drawingManager, 'drawingmode_changed',
			clearSelection);
	google.maps.event.addListener(map, 'click', clearSelection);

	var panel = buildColorPalette();
	map.controls[google.maps.ControlPosition.TOP_CENTER].push(panel);
}
