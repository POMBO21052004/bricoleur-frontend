# Dockerfile
FROM node:20-alpine AS development

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm ci

# Copier le code source
COPY . .

# Port exposé
EXPOSE 3000

# Commande de démarrage en développement
CMD ["npm", "run", "dev", "--", "--host"]

# Build pour production
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

# Installer les dépendances de production uniquement
RUN npm ci --only=production

# Copier le code source
COPY . .

# Build de l'application
RUN npm run build

# Serveur de production léger
FROM nginx:alpine AS production

# Copier les fichiers buildés depuis l'étape builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copier la configuration nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]