# Estágio de build
FROM node:20 AS build
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY prisma ./prisma

# Instalar dependências e gerar o Prisma Client
RUN npm install
RUN npx prisma generate

# Copiar o restante do código e construir a aplicação
COPY . .
RUN npm run build

# Estágio de produção
FROM node:20
WORKDIR /app

# Copiar arquivos necessários do estágio de build
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
COPY --from=build /app/prisma ./prisma

# Instalar apenas dependências de produção
RUN npm install --production

# Expor a porta e iniciar a aplicação
EXPOSE 3000
CMD ["npm", "run", "test:e2e:inside-container"]