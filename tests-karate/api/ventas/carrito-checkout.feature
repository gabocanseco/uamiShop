Feature: API Ventas — checkout y abandonar

  Background:
    * url baseUrl
    * def boot = call read('../common/bootstrap-primer-producto.feature')
    * def p = boot.primerProducto

  Scenario: Iniciar y completar checkout con carrito que tiene ítems
    * if (!p) karate.abort('Sin productos en catálogo')

    Given path '/v1/clientes'
    When method post
    Then status 201
    * def cli = response.id

    Given path '/v1/carritos', cli
    When method post
    Then status 201
    * def cart = response.id

    Given path '/v1/carritos', cart, 'productos'
    And request
      """
      {
        productoRef: {
          productoId: '#(p.id)',
          nombreProducto: '#(p.nombre)',
          sku: 'CHK-1'
        },
        cantidad: 1,
        precioUnitario: '#(p.precio.cantidad)'
      }
      """
    When method post
    Then status 201

    Given path '/v1/carritos', cart, 'checkout'
    When method post
    Then status 201

    Given path '/v1/carritos', cart, 'completar'
    When method post
    Then status 201

  Scenario: Abandonar carrito vacío recibe respuesta 200
    Given path '/v1/clientes'
    When method post
    Then status 201
    * def cli2 = response.id

    Given path '/v1/carritos', cli2
    When method post
    Then status 201
    * def cart2 = response.id

    Given path '/v1/carritos', cart2, 'abandonar'
    When method post
    Then status 201
