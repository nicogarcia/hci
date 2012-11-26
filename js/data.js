// FORMATO DE BARRIO: Nombre, Coordenadas

var names = [ "Centro", "Tiro Federal", "Universitario", "Naposta",
		"Palihue", "Pedro Pico", "Pacifico", "La Falda", "Villa Mitre" ];
var myCoordinates = [// centro
		[
				new google.maps.LatLng(-38.7211428487026, -62.281248735473696),
				new google.maps.LatLng(-38.70913248605799, -62.26786298413083),
				new google.maps.LatLng(-38.717035722821514, -62.25421600524896),
				new google.maps.LatLng(-38.72962416573652, -62.270524259277295) ],

		// tiro
		[ new google.maps.LatLng(-38.719245, -62.253186),
				new google.maps.LatLng(-38.715629, -62.241513),
				new google.maps.LatLng(-38.718910, -62.236406),
				new google.maps.LatLng(-38.723397, -62.242286),
				new google.maps.LatLng(-38.723939552304, -62.252710816393) ],
		// universitario
		[ new google.maps.LatLng(-38.704879, -62.279751),
				new google.maps.LatLng(-38.709501, -62.273313),
				new google.maps.LatLng(-38.705817, -62.267134),
				new google.maps.LatLng(-38.699253, -62.273142) ],
		// naposta
		[ new google.maps.LatLng(-38.705522505646, -62.26674413396),
				new google.maps.LatLng(-38.703312141174, -62.262195107471),
				new google.maps.LatLng(-38.708268620868, -62.255757805835),
				new google.maps.LatLng(-38.712956866511, -62.261250969897),
				new google.maps.LatLng(-38.705589485321, -62.266658303271) ],
		// palihue
		[ new google.maps.LatLng(-38.700230913062, -62.263267991075),
				new google.maps.LatLng(-38.695407854714, -62.255028244982),
				new google.maps.LatLng(-38.701034724499, -62.248333451281),
				new google.maps.LatLng(-38.707464890746, -62.254684922228) ],
		// pedro pico
		[ new google.maps.LatLng(-38.724877020465, -62.263482567798),
				new google.maps.LatLng(-38.730367658414, -62.268975731859),
				new google.maps.LatLng(-38.735322262148, -62.264169213305),
				new google.maps.LatLng(-38.729832004995, -62.255929467212) ],

		// pacifico
		[ new google.maps.LatLng(-38.714832078682, -62.289703843125),
				new google.maps.LatLng(-38.709742102629, -62.282322403916),
				new google.maps.LatLng(-38.714564194241, -62.275455948838),
				new google.maps.LatLng(-38.720457420024, -62.282322403916) ],
		// la falda
		[ new google.maps.LatLng(-38.707866756937, -62.253826615343),
				new google.maps.LatLng(-38.703981955806, -62.249706742296),
				new google.maps.LatLng(-38.708000711831, -62.244556900988),
				new google.maps.LatLng(-38.711349502641, -62.250221726428) ],
		// villa mitre
		[ new google.maps.LatLng(-38.735456165588, -62.24588727666),
				new google.maps.LatLng(-38.728492853874, -62.238677498828),
				new google.maps.LatLng(-38.723805627277, -62.245844361315),
				new google.maps.LatLng(-38.723939552304, -62.252710816393),
				new google.maps.LatLng(-38.730300701957, -62.253054139147) ] ];

// Filas Tabla de estadisticas
var row_names = [ ['Habitantes','', 'people.png'],[ 'Luz', 'KWh', 'light.png' ], [ 'Gas', 'm\u00B3', 'flame.png' ],
		[ 'Agua', 'm\u00B3', 'water.png' ], [ 'Llamados 911', '', '911.png' ],
		[ 'Llamados Municipalidad', '', 'phone.png' ], [ 'Accidentes Transito', '', 'car-crash.png' ],
		[ 'Delitos', '' , 'thief.png'] ];
