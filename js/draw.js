var drawingManager;
var selectedShape1;
var selectedShape2;
var colors = [ '#1E90FF', '#FF1493', '#32CD32', '#FF8C00', '#4B0082' ];
var selectedColor;
var nextColor = 1;
var colorButtons = {};

var zones = [];

function clearSelection() {
	if (selectedShape1) {
		if (selectedShape1.manual) {
			selectedShape1.polygon.setEditable(false);
		}
		selectedShape1 = null;
		infowindow1.close();
	}
	if (selectedShape2) {
		selectedShape2 = null;
		infowindow2.close();
	}
	refreshTable();
}
function build_infowin_content(barrio, infwin) {
	var container = document.createElement('div');

	var titulo = document.createElement('h1');
	titulo.innerHTML = barrio.name;
	container.style.textAlign = 'center';
	container.appendChild(titulo);

	if (barrio.manual) {
		var button = build_delete_button(barrio);
		container.appendChild(button);
	}

	infwin.setContent(container);
	infwin.setPosition(barrio.polygon.getPath().getAt(0));
	infwin.open(map);
}

function setSelection(barrio) {
	if (barrio.manual) {
		barrio.polygon.setEditable(true);
	}

	if (comparing) {
		if (selectedShape1) {
			selectedShape2 = selectedShape1;
			selectedShape1 = barrio;
			var compareButton = document.getElementById('compareButton');
			compareButton.children[0].innerHTML = 'Listo!';
			setTimeout(function() {
				compareButton.children[0].innerHTML = 'Comparar';
			}, 1000);
			comparing = false;
			build_infowin_content(selectedShape1, infowindow1);
			build_infowin_content(selectedShape2, infowindow2);
		} else {
			selectedShape1 = barrio;
			var compareButton = document.getElementById('compareButton');
			compareButton.children[0].innerHTML = "Elija otra zona...";
			build_infowin_content(barrio, infowindow1);
		}
	} else {
		clearSelection();
		selectedShape1 = barrio;
		build_infowin_content(barrio, infowindow1);
		infowindow2.close();
	}

	refreshTable();
}

function deleteShape(barrio) {
	if (selectedShape1) {
		barrio.polygon.setMap(null);
		infowindow1.close();
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
	if (selectedShape1) {
		selectedShape1.polygon.set('fillColor', color);
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

function build_delete_button(barrio) {
	var button = document.createElement('button');
	button.id = 'delete_zone';
	button.className = 'action redbtn';
	button.style.float = 'center';
	button.innerHTML = "<span class='label'>Eliminar zona</span>";
	button.onclick = function() {
		deleteShape(barrio);
	};
	return button;
}

var overlayCompleteClosure = function(e) {
	if (e.type != google.maps.drawing.OverlayType.MARKER) {
		$('#click').trigger('click');

		// Crear pseudo-barrio a partir de lo seleccionado
		var b = new Barrio();
		b.name = 'Zona ' + (zones.length + 1);
		b.polygon = e.overlay;
		b.manual = true;
		b.polygon.set('barrio', b);

		// Add click event listener for the new polygon
		google.maps.event.addListener(b.polygon, 'click', function(event) {
			var barrio = this.get('barrio');

			setSelection(b);
		});
		new Tooltip(b);
		zones.push(b);
		setSelection(b);
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
	google.maps.event.addListener(map, 'click', function() {
		clearSelection();
		$("#tags").autocomplete('close');
	});
	google.maps.event.addListener(map, 'mousemove', function() {
		$("#tags").autocomplete('close');
	});

	var panel = buildColorPalette();
	var drawPanel = drawPolyClickPanel();

	map.controls[google.maps.ControlPosition.TOP_CENTER].push(drawPanel);
	map.controls[google.maps.ControlPosition.TOP_CENTER].push(panel);
}

function drawPolyClickPanel() {
	var drawPanel = document.createElement('div');

	var clickbut = document.createElement('button');
	clickbut.className = 'click active';
	clickbut.id = 'click';
	clickbut.innerHTML = "<img src='img/hand.png' height='32' />";
	var labelSel = document.createElement('span');
	labelSel.className = 'label';
	labelSel.innerHTML = 'Seleccionar';
	clickbut.appendChild(labelSel);
	clickbut.onclick = function() {
		drawingManager.setDrawingMode(null);
		$('#click').addClass('active').siblings().removeClass('active');
	};

	var polbut = document.createElement('button');
	polbut.id = 'poly';
	polbut.className = 'poly';
	polbut.innerHTML = "<img src='img/polygon.png' height='32'/>";
	var labelPoly = document.createElement('span');
	labelPoly.className = 'label';
	labelPoly.innerHTML = 'Dibujar Zona';
	polbut.appendChild(labelPoly);
	polbut.onclick = function() {
		drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
		$('#poly').addClass('active').siblings().removeClass('active');
	};

	drawPanel.appendChild(clickbut);
	drawPanel.appendChild(polbut);

	return drawPanel;
}
