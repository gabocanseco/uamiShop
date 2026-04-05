Feature: API Ventas — clientes

  Background:
    * url baseUrl

  Scenario: Crear cliente anónimo responde 201 con UUID
    Given path '/v1/clientes'
    When method post
    Then status 201
    And match response.id == '#regex ^[0-9a-fA-F-]{36}$'

  Scenario: Obtener cliente por ID devuelve el mismo recurso
    Given path '/v1/clientes'
    When method post
    Then status 201
    * def clienteId = response.id

    Given path '/v1/clientes', clienteId
    When method get
    Then status 200
    And match response.id == clienteId
