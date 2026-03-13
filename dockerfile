#Paso 1: Construcción del proyecto
FROM node:20-alpine AS builder
#alpine es una imagen ligera de Linux, ideal para aplicaciones Node.js en producción.
WORKDIR /app
# Establece el directorio de trabajo dentro del contenedor. Todos los comandos siguientes se ejecutarán desde este directorio.

# Copiar package files
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del proyecto
COPY . .

# Compilar TypeScript
RUN npm run build


#Paso 2: Imagen final para producción
FROM node:20-alpine

WORKDIR /app

# Copiar solo dependencias necesarias
COPY package*.json ./
RUN npm install --omit=dev

# Copiar build generado
COPY --from=builder /app/dist ./dist

# Copiar archivos necesarios si existen
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# Puerto 
EXPOSE 3000

# Comando para iniciar
CMD ["node", "dist/main.js"]
