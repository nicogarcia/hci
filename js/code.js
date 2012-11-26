var map;
var sliderBox;
var infowindow1;
var infowindow2;
var tooltipwindow;
var barrios = [];
var comparing = false;

function Barrio() {
	this.name = "";
	this.polygon = "";
	this.manual = false;
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
				setSelection(barrios[pos]);
			},
			focus : function(event, ui) {
			},
			minLength : 0
		});
	});
	$("#tags").click(function() {
		$("#tags").autocomplete('search', '');
	});
}

function build_table() {
	var table = document.getElementById('data_table');
	for ( var row = 0; row < row_names.length; row++) {
		table.rows[row + 1].cells[0].innerHTML = "<img src='img/"
				+ row_names[row][2] + "'height='24' style='margin-right:4px;'/>"
				+ row_names[row][0];

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
			fillColor : colors[i % colors.length],
			fillOpacity : 0.5
		};

		b.polygon = new google.maps.Polygon(polyOptions);
		barrios.push(b);
	}
}

// Inicializar mapa
function init_map() {

	/** Initialize map things */
	var latlng = new google.maps.LatLng(-38.712615, -62.265717);
	var myOptions = {
		zoom : 14,
		center : latlng,
		mapTypeId : google.maps.MapTypeId.ROADMAP,
		disableDefaultUI : true,
		zoomControl : true
	};
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

	infowindow1 = new google.maps.InfoWindow();
	infowindow2 = new google.maps.InfoWindow();

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
			setSelection(this.get('barrio'));
		});/*
		google.maps.event.addListener(b.polygon, 'mouseover', function(event) {
			var barrio = this.get('barrio');
			build_infowin_content(barrio, tooltipwindow);
		});*/

		new Tooltip(b);

	}
	// botones superiores
	var saveButton = document.getElementById('saveButton');
	saveButton.onclick = function() {
		saveButton.children[0].innerHTML = 'Guardando...';
		setTimeout(function() {
			saveButton.children[0].innerHTML = 'Guardar';
		}, 3000);
	};
	var compareButton = document.getElementById('compareButton');
	$(compareButton).click(function() {
		var que = 'una';
		if (selectedShape1) {
			que = 'otra';
		}
		compareButton.children[0].innerHTML = 'Elija ' + que + ' zona...';
		comparing = true;
	});
}

// Crear panel deslizante derecho
function SliderBox(controlDiv, map) {

	var control = this;
	control.isOpen = false;

	// set panel height to 100%
	// controlDiv.style.height = '100%';

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
			"marginRight" : signo + '370px'
		}, {
			duration : 250,
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
function refreshTable() {
	var table = document.getElementById('data_table');
	var array = [ '' ];
	array.push(selectedShape1);
	array.push(selectedShape2);
	for ( var col = 1; col < array.length; col++) {
		var currentShape = array[col];
		if (currentShape) {
			setColumnVisible(table, col, true);
			table.rows[0].cells[col].innerHTML = currentShape.name;
			for ( var row = 0; row < row_names.length; row++) {
				table.rows[row + 1].cells[col].innerHTML = Math.floor(Math
						.random() * 50 + 20)
						+ ' ' + row_names[row][1];
			}
		} else {
			setColumnVisible(table, col, false);
		}
	}
	if (!sliderBox.isOpen && selectedShape1)
		$('#toggleBtn').trigger('click');
}

function setColumnVisible(table, col, visible) {
	var disp = visible ? '' : 'none';
	for ( var row = 0; row < table.rows.length; row++) {
		table.rows[row].cells[col].style.display = disp;
	}
}
