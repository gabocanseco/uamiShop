Feature: API Catálogo — productos (lectura y más vendidos)

  Background:
    * url baseUrl
    * def imagenSchema = { id: '#string', url: '#string', alt: '#string', orden: '#number' }
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

  Scenario: Listar productos cumple esquema básico
    Given path '/v1/productos'
    When method get
    Then status 200
    And match response == '#[]'
    And match each response == productoSchema

  Scenario: Más vendidos con límite responde 200 y arreglo de productos
    Given path '/v1/productos/mas-vendidos'
    And param limit = 5
    When method get
    Then status 200
    And match response == '#[]'
    And match each response == productoSchema

  Scenario: Detalle de producto por ID cuando existe catálogo
    Given path '/v1/productos'
    When method get
    Then status 200
    * def pid = response.length > 0 ? response[0].id : null
    * if (!pid) karate.abort('Sin productos: ejecuta el seed del catálogo')

    Given path '/v1/productos', pid
    When method get
    Then status 200
    And match response == productoSchema
    And match response.id == pid

  Scenario: Estadísticas de producto — 200 o 404 según exista registro
    Given path '/v1/productos'
    When method get
    Then status 200
    * def pid2 = response.length > 0 ? response[0].id : null
    * if (!pid2) karate.abort('Sin productos')

    Given path '/v1/productos', pid2, 'estadisticas'
    When method get
    * assert responseStatus == 200 || responseStatus == 404
