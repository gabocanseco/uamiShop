CREATE DATABASE IF NOT EXISTS uamishop_catalogo;
CREATE DATABASE IF NOT EXISTS uamishop_ventas;
CREATE DATABASE IF NOT EXISTS uamishop_ordenes;


-- 2. Asegurar que el usuario tenga permisos en las 3
-- Usamos 'uamishop'@'%' para que pueda conectarse desde cualquier IP interna de Docker
GRANT ALL PRIVILEGES ON uamishop_catalogo.* TO 'uamishop'@'%';
GRANT ALL PRIVILEGES ON uamishop_ventas.* TO 'uamishop'@'%';
GRANT ALL PRIVILEGES ON uamishop_ordenes.* TO 'uamishop'@'%';

-- 3. Aplicar cambios
FLUSH PRIVILEGES;