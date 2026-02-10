/* Mensajes centralizados para la ruta de pistas
   Modifica aquí los textos y los cambios se verán en todas las páginas.
*/
window.MESSAGES = {
  // INDEX (index.html)
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

  // ROUTE / OVERVIEW (ruta.html)
  "route.title": "Ruta de Gildas y Cócteles - San Valentín",
  "route.h1": "Ruta de Gildas y Cócteles",
  "route.h2": "San Valentín",
  "route.pista1_title": "Pista 1: Doble & Gilda",
  "route.pista1_address": "Calle de Sta Engracia, 105, Chamberí, 28010 Madrid",
  "route.pista2_title": "Pista 2: La Gildería",
  "route.pista2_address": "Calle de Trafalgar, 15, Chamberí, 28010 Madrid",
  "route.pista3_title": "Pista 3: Gilda Haus",
  "route.pista3_address": "Calle de San Mateo, 6, Centro, 28004 Madrid",
  "route.pista4_title": "Pista 4: Salmon Guru",
  "route.pista4_address": "Calle de Echegaray, 21, Centro, 28014 Madrid",

  // NAV / COMMON
  "route.next": "Siguiente pista",

  // PISTAS (pista pages)
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
  "pista4.desc": "Donde el <strong>SALMON</strong> no nada, pero los cócteles sí son arte. Busca el templo <strong>GURU</strong> de mezclas en <strong>ECHEGARAY</strong>."
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
