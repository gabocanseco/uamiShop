function fn() {
  var env = karate.env; // obtener variable de entorno
  var config = {
    baseUrlCatalogo: 'http://localhost:8081',
    baseUrlVentas: 'http://localhost:8082',
    baseUrlOrdenes: 'http://localhost:8083',
  };

  if (env == 'docker') {
    config.baseUrlCatalogo = 'http://catalogo:8081';
    config.baseUrlVentas = 'http://ventas:8082';
    config.baseUrlOrdenes = 'http://ordenes:8083';
  }

  return config;
}
