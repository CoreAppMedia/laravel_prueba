# ========================
# ETAPA 1: BUILD FRONTEND
# ========================
FROM node:20 AS frontend

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ========================
# ETAPA 2: PHP + NGINX
# ========================
FROM php:8.2-fpm

# Instalar dependencias + nginx
RUN apt-get update && apt-get install -y \
    nginx \
    git unzip curl libpq-dev libzip-dev libonig-dev \
    && docker-php-ext-install pdo pdo_pgsql zip mbstring \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Copiar proyecto
COPY . .

# Copiar build frontend
COPY --from=frontend /app/public/build /var/www/public/build

# Instalar Laravel
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Configurar permisos
RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Copiar config nginx
COPY nginx/default.conf /etc/nginx/sites-available/default

# Exponer puerto
EXPOSE 80

# Script de arranque
CMD service nginx start && php-fpm