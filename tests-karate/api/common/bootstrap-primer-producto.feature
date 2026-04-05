@ignore
Feature: Utilidad — primer producto vía gateway (solo para call read; excluido del runner con -t ~@ignore)

  Scenario:
    * url baseUrl
    Given path '/v1/productos'
    When method get
    Then status 200
    * def primerProducto = response.length > 0 ? response[0] : null
