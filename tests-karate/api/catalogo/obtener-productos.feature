Feature: Pruebas de API de Catálogo - Validación de Estructura Completa

  Background:
    * url baseUrlCatalogo
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
        imagenes: '#[] imagenSchema'
      }
      """

  Scenario: Obtener lista de productos y validar el primer elemento (Altavoz Bluetooth)
    Given path '/v1/productos'
    When method get
    Then status 200
    # Validamos que la respuesta sea un arreglo que cumpla el esquema
    And match response == '#[] productoSchema'
    
    # Validación específica para un producto conocido en tu dataset
    * def altavoz = response.find(x => x.nombre == 'Altavoz Bluetooth Resistente')
    And match altavoz.precio.cantidad == 79.99
    And match altavoz.precio.moneda == 'MX'
    And match altavoz.imagenes[0].orden == 1

  Scenario: Validar que todos los productos tengan imágenes configuradas
    Given path '/v1/productos'
    When method get
    Then status 200
    # Usamos '[*]' para indicarle a Karate que itere sobre cada objeto del arreglo
    And match each response[*].imagenes == '#[1]'
    And match each response[*].imagenes[*].url contains 'https://'

  Scenario: Obtener detalle de un libro específico (Cien Años de Soledad)
    * def libroId = 'ac263893-ff85-4968-b42c-cbc4a0db3d9d'
    Given path '/v1/productos', libroId
    When method get
    Then status 200
    And match response.nombre == 'Cien Años de Soledad'
    And match response.precio.cantidad == 29.99
    # Validar que la descripción no esté vacía
    And match response.descripcion == '#notnull'