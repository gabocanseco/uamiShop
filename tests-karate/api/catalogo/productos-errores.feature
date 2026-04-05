Feature: API Catálogo — errores de producto

  Background:
    * url baseUrl

  Scenario: Producto inexistente devuelve 404
    Given path '/v1/productos', '00000000-0000-4000-8000-000000000001'
    When method get
    Then status 404

  Scenario: Crear producto con precio inválido devuelve 400
    Given path '/v1/categorias'
    When method get
    Then status 200
    * def catId = response.length > 0 ? response[0].id : null
    * if (!catId) karate.abort('Sin categorías en BD')

    Given path '/v1/productos'
    And request
      """
      {
        nombre: 'Prod bad price',
        descripcion: 'Descripción válida para validación de precio',
        precio: -1,
        categoriaId: '#(catId)'
      }
      """
    When method post
    Then status 400
