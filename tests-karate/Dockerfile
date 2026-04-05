FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

# Copiamos el JAR y el config
COPY karate-2.0.0.jar karate.jar
COPY karate-config.js /app/karate-config.js

# Copiamos el resto de las carpetas
COPY api/ /app/api/

# CAMBIO CRÍTICO: Usamos Classpath para que encuentre el config.js en el punto (.)
ENTRYPOINT ["java", "-cp", ".:karate.jar", "com.intuit.karate.Main"]

# Ejecuta features bajo api/ excepto los marcados con @ignore (helpers para call read)
CMD ["run", "-t", "~@ignore", "api"]