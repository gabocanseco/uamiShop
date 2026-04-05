Feature: API Órdenes — pago y cancelación

  Background:
    * url baseUrl
    * def boot = call read('../common/bootstrap-primer-producto.feature')
    * def p = boot.primerProducto
    * def dir =
      """
      {
        nombreDestinatario: "Pago Karate",
        calle: "Calle 2",
        ciudad: "CDMX",
        estado: "CDMX",
        codigoPostal: "02000",
        pais: "México",
        telefono: "5552223333",
        instrucciones: "Entrega en horario laboral"
      }
      """
    * def pago = { metodoPago: 'Transferencia' }

  Scenario: Confirmar orden y procesar pago
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
            sku: 'PAY-1',
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
    * def oid = response.id

    Given path '/v1/ordenes', oid, 'confirmar'
    When method post
    Then status 201

    Given path '/v1/ordenes', oid, 'procesar'
    And request { referenciaExterna: 'REF-KARATE-999' }
    When method post
    Then status 201
    And match response.estado == 'PAGO_PROCESADO'

  Scenario: Cancelar orden en estado pendiente
    * if (!p) karate.abort('Sin productos en catálogo')

    Given path '/v1/clientes'
    When method post
    Then status 201
    * def cid = response.id

    Given path '/v1/ordenes'
    And request
      """
      {
        clienteId: '#(cid)',
        items: [
          {
            productoId: '#(p.id)',
            nombreProducto: '#(p.nombre)',
            sku: 'CAN-1',
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
    * def oid2 = response.id

    Given path '/v1/ordenes', oid2, 'cancelar'
    And request { motivo: 'Prueba Karate — cancelación' }
    When method post
    Then status 201
    And match response.estado == 'CANCELADA'
