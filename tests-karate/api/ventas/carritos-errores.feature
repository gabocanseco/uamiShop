Feature: API Ventas — errores de carrito

  Background:
    * url baseUrl

  Scenario: Carrito inexistente devuelve 404
    Given path '/v1/carritos', '00000000-0000-4000-8000-000000000088'
    When method get
    Then status 404
