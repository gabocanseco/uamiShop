import { registerAs } from '@nestjs/config';

export default registerAs('services', () => ({
  catalogoUrl: process.env.CATALOGO_SERVICE_URL,
}));
