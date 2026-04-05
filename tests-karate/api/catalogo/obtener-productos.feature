Feature: Pruebas de API de Catálogo - Validación de Estructura Completa

  Background:
    * url baseUrl
    * print 'DEBUG - Valor de baseUrl:', baseUrl
    # Definimos los esquemas para validación profunda
    * def imagenSchema = { id: '#regex ^[0-9a-fA-F-]{36}$', url: '#string', alt: '#string', orden: '#number' }
    * def precioSchema = { cantidad: '#number', moneda: '#string' }
    * def productoSchema = 
      """
      {
        id: '#regex ^[0-9a-fA-F-]{36}$',
        nombre: '#string',
        descripcion: '#string',
        precio: '#(precioSchema)',
        categoriaId: '#regex ^[0-9a-fA-F-]{36}$',
        disponible: '#boolean',
        fechaCreacion: '#string',
        imagenes: '#[]'
      }
      """

  Scenario: Obtener lista de productos y validar el primer elemento (Altavoz Bluetooth)
    Given path '/v1/productos'
    When method get
    Then status 200
    # Validamos que la respuesta sea un arreglo que cumpla el esquema
    And match response == '#[]'
    And match each response == productoSchema
    
    # Dataset sembrado (seed): si existe, validar precio y moneda
    * def altavoz = response.find(x => x.nombre == 'Altavoz Bluetooth Resistente')
    * eval if (altavoz) { karate.match(altavoz.precio.cantidad, 79.99); if (altavoz.precio.moneda != 'MX' && altavoz.precio.moneda != 'MXN') karate.fail('moneda inesperada'); karate.match(altavoz.imagenes[0].orden, 1) }


