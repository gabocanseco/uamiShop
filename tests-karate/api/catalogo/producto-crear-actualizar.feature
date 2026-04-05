Feature: API Catálogo — crear y actualizar producto

  Background:
    * url baseUrl
    * def sufijo = java.lang.System.currentTimeMillis()

  Scenario: Crear producto con categoría existente y leerlo por ID
    Given path '/v1/categorias'
    When method get
    Then status 200
    * def catId = response.length > 0 ? response[0].id : null
    * if (!catId) karate.abort('Sin categorías: ejecuta el seed del catálogo')

    * def nombreProd = 'Karate-Prod-' + sufijo
    Given path '/v1/productos'
    And request
      """
      {
        nombre: '#(nombreProd)',
        descripcion: 'Descripción mínima de al menos diez caracteres para el producto',
        precio: 12.5,
        categoriaId: '#(catId)'
      }
      """
    When method post
    Then status 201
    And match response.nombre == nombreProd
    * def pid = response.id

    Given path '/v1/productos', pid
    When method get
    Then status 200
    And match response.id == pid

  Scenario: Actualizar nombre y precio de un producto existente
    Given path '/v1/categorias'
    When method get
    Then status 200
    * def catId2 = response.length > 0 ? response[0].id : null
    * if (!catId2) karate.abort('Sin categorías')

    * def nombreA = 'Karate-Upd-A-' + sufijo
    Given path '/v1/productos'
    And request
      """
      {
        nombre: '#(nombreA)',
        descripcion: 'Descripción para prueba de actualización de producto',
        precio: 20,
        categoriaId: '#(catId2)'
      }
      """
    When method post
    Then status 201
    * def pid2 = response.id

    Given path '/v1/productos', pid2
    And request
      """
      {
        nombre: 'Karate-Upd-B',
        descripcion: 'Descripción actualizada para el producto de prueba',
        precio: 25,
        categoriaId: '#(catId2)'
      }
      """
    When method put
    Then status 200
    And match response.nombre == 'Karate-Upd-B'
    And match response.precio.cantidad == 25
