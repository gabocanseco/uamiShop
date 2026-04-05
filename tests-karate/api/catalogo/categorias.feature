Feature: API Catálogo — categorías

  Background:
    * url baseUrl
    * def sufijo = java.lang.System.currentTimeMillis()

  Scenario: Listar categorías responde 200 y es un arreglo
    Given path '/v1/categorias'
    When method get
    Then status 200
    And match response == '#[]'

  Scenario: Crear categoría y obtenerla por ID
    * def nombreCat = 'Karate-Cat-' + sufijo
    Given path '/v1/categorias'
    And request { nombre: '#(nombreCat)', descripcion: 'Categoría creada por Karate' }
    When method post
    Then status 201
    And match response.id == '#regex ^[0-9a-fA-F-]{36}$'
    And match response.nombre == nombreCat
    * def catId = response.id

    Given path '/v1/categorias', catId
    When method get
    Then status 200
    And match response.nombre == nombreCat

  Scenario: Actualizar categoría existente
    * def nombre2 = 'Karate-Cat-Upd-' + sufijo
    Given path '/v1/categorias'
    And request { nombre: '#(nombre2)', descripcion: 'Antes de actualizar' }
    When method post
    Then status 201
    * def cid = response.id

    Given path '/v1/categorias', cid
    And request { nombre: 'Actualizada Karate', descripcion: 'Nueva descripción' }
    When method put
    Then status 200
    And match response.nombre == 'Actualizada Karate'

  Scenario: Categoría inexistente devuelve 404
    Given path '/v1/categorias', '00000000-0000-4000-8000-000000000099'
    When method get
    Then status 404
