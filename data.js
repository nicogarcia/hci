// FORMATO DE BARRIO: Nombre, Coordenadas

var names = [ "Centro", "Tiro Federal", "Universitario" ];
var myCoordinates = [// centro
		[ new google.maps.LatLng(-38.716366, -62.275073),
				new google.maps.LatLng(-38.710472, -62.267348),
				new google.maps.LatLng(-38.716433, -62.259795),
				new google.maps.LatLng(-38.721321, -62.268121) ],

		// tiro
		[ new google.maps.LatLng(-38.719245, -62.253186),
				new google.maps.LatLng(-38.715629, -62.241513),
				new google.maps.LatLng(-38.718910, -62.236406),
				new google.maps.LatLng(-38.723397, -62.242286),
				new google.maps.LatLng(-38.728151, -62.252843),
				new google.maps.LatLng(-38.719111, -62.251641) ],
		// universitario
		[ new google.maps.LatLng(-38.704879, -62.279751),
				new google.maps.LatLng(-38.709501, -62.273313),
				new google.maps.LatLng(-38.705817, -62.267134),
				new google.maps.LatLng(-38.699253, -62.273142) ],

];

// Filas Tabla de estadisticas
var row_names = [ 'Luz', 'Gas', 'Agua', '911', 'Accidentes', 'Robos',
		'Homicidios' ];
