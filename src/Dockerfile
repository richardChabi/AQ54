# Utilisez l'image Node.js comme base
FROM node:14-alpine

# Créez le répertoire de travail de l'application
WORKDIR /app

# Copiez les fichiers nécessaires à l'installation des dépendances
COPY package*.json ./

# Installez les dépendances
RUN npm install

# Copiez le reste des fichiers de l'application
COPY . .

# Compilez l'application React
RUN npm run build

# Exposez le port sur lequel l'application écoute (assurez-vous qu'il correspond à celui configuré dans votre application React)
EXPOSE 3000

# Commande pour démarrer l'application lorsque le conteneur est lancé
CMD ["npm", "start"]
