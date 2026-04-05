Feature: API Órdenes — listado y errores

  Background:
    * url baseUrl

  Scenario: Listar órdenes responde 200
    Given path '/v1/ordenes'
    When method get
    Then status 200
    And match response == '#[]'

  Scenario: Orden inexistente devuelve 404
    Given path '/v1/ordenes', '00000000-0000-4000-8000-000000000077'
    When method get
    Then status 404
