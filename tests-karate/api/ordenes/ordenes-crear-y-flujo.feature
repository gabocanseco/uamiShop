Feature: API Órdenes — crear directo y flujo desde carrito

  Background:
    * url baseUrl
    * def boot = call read('../common/bootstrap-primer-producto.feature')
    * def p = boot.primerProducto
    * def dir =
      """
      {
        nombreDestinatario: "Karate Orden",
        calle: "Av. Siempre Viva 742",
        ciudad: "CDMX",
        estado: "CDMX",
        codigoPostal: "01000",
        pais: "México",
        telefono: "5550001111",
        instrucciones: "Llamar al llegar"
      }
      """
    * def pago = { metodoPago: 'Tarjeta débito' }

  Scenario: Crear orden directa (POST /v1/ordenes) con ítem de catálogo
    * if (!p) karate.abort('Sin productos en catálogo')

    Given path '/v1/clientes'
    When method post
    Then status 201
    * def clienteId = response.id

    Given path '/v1/ordenes'
    And request
      """
      {
        clienteId: '#(clienteId)',
        items: [
          {
            productoId: '#(p.id)',
            nombreProducto: '#(p.nombre)',
            sku: 'KARATE-ORD-1',
            cantidad: 1,
            precioUnitario: '#(p.precio.cantidad)'
          }
        ],
        direccion: '#(dir)',
        resumenPago: '#(pago)'
      }
      """
    When method post
    Then status 201
    And match response.id == '#regex ^[0-9a-fA-F-]{36}$'
    And match response.items == '#[1]'
    * def ordenId = response.id

    Given path '/v1/ordenes', ordenId
    When method get
    Then status 200
    And match response.id == ordenId

  Scenario: Crear orden desde carrito y confirmar
    * if (!p) karate.abort('Sin productos en catálogo')

    Given path '/v1/clientes'
    When method post
    Then status 201
    * def cli = response.id

    Given path '/v1/carritos', cli
    When method post
    Then status 201
    * def cartId = response.id

    Given path '/v1/carritos', cartId, 'productos'
    And request
      """
      {
        productoRef: {
          productoId: '#(p.id)',
          nombreProducto: '#(p.nombre)',
          sku: 'KARATE-ORD-CART'
        },
        cantidad: 2,
        precioUnitario: '#(p.precio.cantidad)'
      }
      """
    When method post
    Then status 201

    Given path '/v1/ordenes', cartId
    And request { direccionEnvio: '#(dir)', resumenPago: '#(pago)' }
    When method post
    Then status 201
    * def oid = response.id
    And match response.estado == 'PENDIENTE'

    Given path '/v1/ordenes', oid, 'confirmar'
    When method post
    Then status 201
    And match response.estado == 'CONFIRMADA'

  Scenario: Crear orden sin ítems devuelve error de validación de negocio
    Given path '/v1/clientes'
    When method post
    Then status 201
    * def cid = response.id

    Given path '/v1/ordenes'
    And request
      """
      {
        clienteId: '#(cid)',
        items: [],
        direccion: '#(dir)',
        resumenPago: '#(pago)'
      }
      """
    When method post
    Then status 422
