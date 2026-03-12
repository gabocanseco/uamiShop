# ---------- STAGE 1: Build ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del proyecto
COPY . .

# Compilar TypeScript
RUN npm run build


# ---------- STAGE 2: Production ----------
FROM node:20-alpine

WORKDIR /app

# Copiar solo dependencias necesarias
COPY package*.json ./
RUN npm install --omit=dev

# Copiar build generado
COPY --from=builder /app/dist ./dist

# Copiar archivos necesarios si existen
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# Puerto típico de NestJS
EXPOSE 3000

# Comando para iniciar
CMD ["node", "dist/main.js"]