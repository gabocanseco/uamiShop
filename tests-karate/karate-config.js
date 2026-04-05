function fn() {
  var env = java.lang.System.getenv('KARATE_ENV') || 'dev';

  karate.log('Entorno detectado por el Sistema:', env);

  var config = {
    baseUrl: 'http://localhost:8080',
    catalogoUrl: 'http://localhost:8081',
    ventasUrl: 'http://localhost:8082',
    ordenesUrl: 'http://localhost:8083',
  };

  if (env === 'docker') {
    config.baseUrl = 'http://uamishop-gateway:8080';
    config.catalogoUrl = 'http://uamishop-catalogo:8080';
    config.ventasUrl = 'http://uamishop-ventas:8080';
    config.ordenesUrl = 'http://uamishop-ordenes:8080';
  }

  return config;
}
