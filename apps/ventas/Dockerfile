# Etapa 1 (Builder)
# Imagen base con node.js v24 y alpine, que es una distribución de Linux ligera. Esta etapa se utiliza para construir la aplicación.
FROM node:24-alpine AS builder

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de configuración de npm al contenedor. Esto es necesario para instalar las dependencias de la aplicación.
COPY package.json .

# Instala las dependencias de la aplicación utilizando npm. Esto se hace en la etapa de construcción para que las dependencias no se incluyan en la imagen final, lo que reduce su tamaño.
RUN npm install

# Copia el codigo fuente de la aplicación al contenedor.
# COPY src ./src
COPY . .

# Copiar el archivo de configuración de TypeScript al contenedor. Esto es necesario para compilar el código TypeScript a JavaScript.
# COPY tsconfig.json .

# Compila el código TypeScript a JavaScript. El resultado de esta compilación se guardará en la carpeta 'dist', que se especifica en el archivo tsconfig.json.
# Esto es necesario porque Node.js no puede ejecutar código TypeScript directamente, sino que necesita JavaScript.
# RUN npm run build
RUN npm run build ventas 

# Elimina las dependencias de desarrollo para reducir el tamaño de la imagen final. Esto se hace después de la compilación, ya que las dependencias de desarrollo no son necesarias para ejecutar la aplicación.
RUN npm prune --production


# Etapa 2 (Runtime) Esta se utiliza para ejecutar la aplicación en un contenedor más ligero y es la imagen final que se desplegará.

# Utiliza la misma imagen base de node.js v24 y alpine para mantener la consistencia entre las etapas, pero esta vez se enfoca en ejecutar la aplicación en lugar de construirla.
FROM node:24-alpine AS runtime

# Crea nuevo directorio de trabajo para la etapa de ejecución. Esto es donde se copiarán los archivos necesarios para ejecutar la aplicación.
WORKDIR /app

# Crea nuevo grupo y usuario para ejecutar la aplicación de manera segura. Evita que la aplicación se ejecute con privilegios de root.
RUN addgroup -g 1001 -S appgroup && adduser -u 1001 -S appuser -G appgroup

# Cambia al nuevo usuario creado para ejecutar la aplicación. Esto asegura que la aplicación se ejecute con los permisos adecuados y mejora la seguridad.
USER appuser

# Copia los archivos necesarios para ejecutar la aplicación desde la etapa de construcción. Esto incluye las dependencias instaladas y el código compilado.

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Expone el puerto 3000 para que la aplicación pueda recibir tráfico. Esto es necesario para que la aplicación sea accesible desde fuera del contenedor.
EXPOSE 8080

# Comando para ejecutar la aplicación. Esto se ejecutará cuando el contenedor se inicie y lanzará la aplicación Node.js.
ENTRYPOINT ["node", "dist/apps/ventas/main.js"]