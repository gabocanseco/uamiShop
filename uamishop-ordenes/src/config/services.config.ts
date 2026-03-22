import { registerAs } from '@nestjs/config';

export default registerAs('services', () => ({
  ventasUrl: process.env.VENTAS_SERVICE_URL,
}));
