Feature: API Ventas — carritos (flujo con catálogo)

  Background:
    * url baseUrl
    * def boot = call read('../common/bootstrap-primer-producto.feature')
    * def p = boot.primerProducto

  Scenario: Crear carrito y consultarlo vacío
    * if (!p) karate.abort('Sin productos en catálogo (ejecuta seed)')

    Given path '/v1/clientes'
    When method post
    Then status 201
    * def clienteId = response.id

    Given path '/v1/carritos', clienteId
    When method post
    Then status 201
    And match response.clienteId == clienteId
    And match response.items == '#[0]'
    * def carritoId = response.id

    Given path '/v1/carritos', carritoId
    When method get
    Then status 200
    And match response.id == carritoId

  Scenario: Agregar producto al carrito y modificar cantidad
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
          sku: 'KARATE-SKU'
        },
        cantidad: 1,
        precioUnitario: '#(p.precio.cantidad)'
      }
      """
    When method post
    Then status 201
    And match response.items == '#[1]'
    And match response.items[0].cantidad == 1

    Given path '/v1/carritos', cart, 'productos', p.id
    And request { cantidad: 3 }
    When method put
    Then status 200
    And match response.items[0].cantidad == 3

  Scenario: Eliminar ítem del carrito y vaciar
    * if (!p) karate.abort('Sin productos en catálogo')

    Given path '/v1/clientes'
    When method post
    Then status 201
    * def cli2 = response.id

    Given path '/v1/carritos', cli2
    When method post
    Then status 201
    * def cart2 = response.id

    Given path '/v1/carritos', cart2, 'productos'
    And request
      """
      {
        productoRef: {
          productoId: '#(p.id)',
          nombreProducto: '#(p.nombre)',
          sku: 'KARATE-2'
        },
        cantidad: 2,
        precioUnitario: '#(p.precio.cantidad)'
      }
      """
    When method post
    Then status 201

    Given path '/v1/carritos', cart2, 'productos', p.id
    When method delete
    Then status 200
    And match response.items == '#[0]'

    Given path '/v1/carritos', cart2, 'productos'
    And request
      """
      {
        productoRef: {
          productoId: '#(p.id)',
          nombreProducto: '#(p.nombre)',
          sku: 'KARATE-3'
        },
        cantidad: 1,
        precioUnitario: '#(p.precio.cantidad)'
      }
      """
    When method post
    Then status 201

    Given path '/v1/carritos', cart2, 'productos'
    When method delete
    Then status 200
    And match response.items == '#[0]'
