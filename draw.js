var drawingManager;
var selectedShape;
var colors = [ '#1E90FF', '#FF1493', '#32CD32', '#FF8C00', '#4B0082' ];
var selectedColor;
var colorButtons = {};

function clearSelection() {
	if (selectedShape) {
		selectedShape.setEditable(false);
		selectedShape = null;
	}
}

function setSelection(shape) {
	clearSelection();
	selectedShape = shape;
	selectColor(shape.get('fillColor') || shape.get('strokeColor'));
	fillTable(new Barrio());
}

function deleteSelectedShape() {
	if (selectedShape) {
		selectedShape.setMap(null);
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
	var colorPalette = document.getElementById('color-palette');
	for ( var i = 0; i < colors.length; ++i) {
		var currColor = colors[i];
		var colorButton = makeColorButton(currColor);
		colorPalette.appendChild(colorButton);
		colorButtons[currColor] = colorButton;
	}
	selectColor(colors[0]);
}

function init_drawing() {
	var polyOptions = {
		strokeWeight : 0,
		fillOpacity : 0.45,
		editable : true
	};
	// Creates a drawing manager attached to the map that allows 
	// the user to draw markers, lines, and shapes.
	drawingManager = new google.maps.drawing.DrawingManager({
		drawingControl : true,
		drawingControlOptions : {
			position : google.maps.ControlPosition.TOP_CENTER,
			drawingModes : [google.maps.drawing.OverlayType.POLYGON]
		},
		polygonOptions : polyOptions,
		map : map
	});

	google.maps.event.addListener(drawingManager, 'overlaycomplete',
			function(e) {
				if (e.type != google.maps.drawing.OverlayType.MARKER) {
					// Switch back to non-drawing mode after drawing a shape.
					drawingManager.setDrawingMode(null);

					// Add an event listener that selects the newly-drawn shape
					// when the user mouses down on it.
					var newShape = e.overlay;
					newShape.type = e.type;
					google.maps.event.addListener(newShape, 'click',
							function() {
								setSelection(newShape);
							});
					setSelection(newShape);
				}
			});

	// Clear the current selection when the drawing mode is changed, or when the
	// map is clicked.
	google.maps.event.addListener(drawingManager, 'drawingmode_changed',
			clearSelection);
	google.maps.event.addListener(map, 'click', clearSelection);
//	google.maps.event.addDomListener(document.getElementById('delete-button'),
//			'click', deleteSelectedShape);

	buildColorPalette();
	var colpal = document.getElementById('panel');
	map.controls[google.maps.ControlPosition.TOP_CENTER].push(colpal);
}
