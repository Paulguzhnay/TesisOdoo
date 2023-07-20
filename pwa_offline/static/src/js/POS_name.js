// Realizar una solicitud AJAX para obtener el nombre de la caja actual
function getCurrentPosName() {
  $.ajax({
    url: '/get_current_pos_name',
    type: 'GET',
    dataType: 'json',
    success: function(response) {
      if (response) {
        // El nombre de la caja está disponible en la variable response
        console.log('Nombre de la caja actual:', response);
      } else {
        console.log('No se encontró una caja actual');
      }
    },
    error: function(xhr, textStatus, errorThrown) {
      console.log('Error en la solicitud AJAX:', errorThrown);
    }
  });
}

// Llamar a la función para obtener el nombre de la caja actual
getCurrentPosName();
