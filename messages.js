/* Mensajes centralizados para la ruta de pistas
   Modifica aquí los textos y los cambios se verán en todas las páginas.
*/
window.MESSAGES = {
  "index.title1": "Feli",
  "index.title2": "¿Quieres ser mi San Valentín?",
  "index.yes": "Sí",
  "index.no": "No",
  "index.countdown_format": "{days}:{hours}:{minutes}:{seconds}",
  "index.result_wait": "Ten paciencia… mañana tendrás otra palabra",
  "index.password_full": "Contraseña: EL CALCETIN DE PAPELES DE MI TIA FELIPE DICE QUE LA CONTRASEÑA ES \"07022026\"",
  "index.password_day0": "Contraseña: EL CALCETIN DE PAPELES DE MI TIA FELIPE DICE QUE",
  "index.password_day1": "Contraseña: EL CALCETIN DE PAPELES DE MI TIA FELIPE",
  "index.password_day2": "Contraseña: EL CALCETIN DE PAPELES",
  "index.password_day3": "Contraseña: EL CALCETIN",
  "index.sayYes_header": "Sabía que dirías que sí",
  "index.input_placeholder": "Introduce la contraseña",
  "index.try_button": "Probar",

  "route.next": "Siguiente pista",

  "pista1.title": "Pista 1",
  "pista1.desc": "Aquí comienza el aperitivo, donde aceitunas, anchoas y picante viven.",
  "pista1.address_label": "Dirección:",
  "pista1.address": "Calle de Santa Engracia, 105",

  "pista2.title": "Pista 2",
  "pista2.desc": "Sigue las coordenadas para encontrar un lugar castizo donde Madrid se vuelve costumbre y las cañas saben a “de siempre”.",
  "pista2.coords": "40.43176, -3.70085",

  "pista3.title": "Pista 3",
  "pista3.desc": "Gildas con ritmo y cócteles con música. Un \u201c<strong>HAUS</strong>\u201d moderno donde la <strong>GILDA</strong> y la noche comparten la vida.",

  "pista4.title": "Pista 4",
  "pista4.desc": "Donde el <strong>SALMON</strong> no nada, pero los cócteles sí son arte. Busca el templo <strong>GURU</strong> de mezclas en <strong>ECHEGARAY</strong>.",

  "ruta.title": "Ruta de Gildas y Cócteles - San Valentín",
  "ruta.h1": "Ruta de Gildas y Cócteles",
  "ruta.h2": "San Valentín"
};

window.getMessage = function(id) {
  return (window.MESSAGES && window.MESSAGES[id]) || '';
};

// Reemplaza elementos con atributo data-msg por su texto correspondiente
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('[data-msg]').forEach(function(el) {
    const key = el.getAttribute('data-msg');
    const msg = getMessage(key);
    if (msg !== '') {
      el.innerHTML = msg;
    }
  });
});
