var map;
var sliderBox;
var infowindow;
var barrios = [];
var colores = [ "#811BE0", "#E01E1B", "#7AE01B", "#1BDDE0" ];

function Barrio() {
	this.name = "";
	this.polygon = "";
};
// change to see git in action

// Funcion inicial
function init() {
	init_barrios();
	build_table();
	init_map();
	init_drawing();

	$(function() {
		$("#tags").autocomplete({
			source : names,
			autoFocus : true,
			select : function(event, ui) {
				var pos = names.indexOf(ui.item.label);
				selectPolygon(barrios[pos].polygon);
			}
		});
	});
}

function build_table() {
	var table = document.getElementById('data_table');
	for ( var row = 0; row < row_names.length; row++) {
		table.rows[row + 1].cells[0].innerHTML = row_names[row];
	}
}

// Inicializar los barrios: poner nombre, crear poligono
function init_barrios() {
	for ( var i = 0; i < names.length; i++) {
		var b = new Barrio();
		b.name = names[i];

		var polyOptions = {
			path : myCoordinates[i],
			strokeWeight : 0,
			fillColor : colores[i % colores.length],
			fillOpacity : 0.5
		};

		b.polygon = new google.maps.Polygon(polyOptions);
		barrios.push(b);
	}
}

function selectPolygon(polygon) {
	var barrio = polygon.get('barrio');
	infowindow.setContent('<center><h1>' + barrio.name + '</h1></center>');
	infowindow.setPosition(polygon.getPath().getAt(0));
	infowindow.open(map);
	map.panTo(infowindow.getPosition());

	// Fill table
	fillTable(barrio);
}

// Inicializar mapa
function init_map() {

	/** Initialize map things */
	var latlng = new google.maps.LatLng(-38.712615, -62.265717);
	var myOptions = {
		zoom : 13,
		center : latlng,
		mapTypeId : google.maps.MapTypeId.ROADMAP,
		disableDefaultUI : true,
		zoomControl : true
	};
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

	infowindow = new google.maps.InfoWindow();

	var sliderBoxDiv = document.createElement('div');
	sliderBox = new SliderBox(sliderBoxDiv, map);

	sliderBoxDiv.index = -500;
	map.controls[google.maps.ControlPosition.TOP_RIGHT].push(sliderBoxDiv);

	/** *************************************** */

	// Add polygons to map
	for ( var i = 0; i < barrios.length; i++) {
		var b = barrios[i];
		b.polygon.setMap(map);
		b.polygon.set('barrio', b);

		// Add click event listener for each polygon
		google.maps.event.addListener(b.polygon, 'click', function() {
			selectPolygon(this);
		});

	}
	// botones superiores
	var button = document.getElementById('customSel');
	button.onclick = function() {
		drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
	};
	var saveButton = document.getElementById('saveButton');
	saveButton.onclick = function() {
		saveButton.children[0].innerHTML = 'Guardando...';
		setTimeout(function() {
			saveButton.children[0].innerHTML = 'Guardar';
		}, 3000);
	};
}

// Crear panel deslizante derecho
function SliderBox(controlDiv, map) {

	var control = this;
	control.isOpen = false;

	// set panel height to 100%
	controlDiv.style.height = '100%';

	// Put sliderbox (panel) inside the map
	var box = document.getElementById('sliderbox');
	controlDiv.appendChild(box);

	$('#toggleBtn').live('click', function() {
		var signo;
		var arrow;
		if (control.isOpen) {
			signo = "-=";
			arrow = "left";
		} else {
			signo = "+=";
			arrow = "right";
		}
		$("#sliderbox").animate({
			"marginRight" : signo + '350px'
		}, {
			duration : 500,
			step : function() {
				google.maps.event.trigger(map, 'resize');
			}
		});
		control.isOpen = !control.isOpen;
		toggleBtn.style.backgroundImage = "url('img/arrow-" + arrow + ".png')";

		;
	});
}

// Llenar la tabla y abrir panel
function fillTable(barrio) {
	var table = document.getElementById('data_table');

	table.rows[0].cells[1].innerHTML = barrio.name;
	var col = 0;
	for ( var row = 0; row < row_names.length; row++) {
		table.rows[row + 1].cells[col + 1].innerHTML = Math
				.floor(Math.random() * 50 + 20);
		table.rows[row + 1].cells[col + 2].innerHTML = '';
	}
	if (!sliderBox.isOpen)
		$('#toggleBtn').trigger('click');
}
