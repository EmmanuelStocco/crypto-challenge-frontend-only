# Build + Run em um stage só (mais simples)
FROM node:18

WORKDIR /app

# Copia só package.json primeiro
COPY package*.json ./

RUN npm install

# Copia todo o resto do código
COPY . .

# Gera o build dentro do container
RUN npm run build

ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "start"]
