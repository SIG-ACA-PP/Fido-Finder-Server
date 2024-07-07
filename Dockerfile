# Usa una imagen de Node.js como base
FROM node:20-alpine

# Establece el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copia el package.json y el package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de la aplicación
COPY . .

# Genera el cliente de Prisma
RUN npx prisma generate

# Compila la aplicación
RUN npm run build

# Expone el puerto que usa la aplicación
EXPOSE 3000

# Ejecuta la aplicación
CMD npm run start:prod
