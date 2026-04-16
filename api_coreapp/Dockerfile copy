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

RUN apt-get update && apt-get install -y \
    nginx \
    git unzip curl libpq-dev libzip-dev libonig-dev \
    && docker-php-ext-install pdo pdo_pgsql zip mbstring \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

COPY . .

COPY --from=frontend /app/public/build /var/www/public/build

RUN composer install --no-dev --optimize-autoloader --no-interaction

RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

COPY nginx/default.conf /etc/nginx/sites-available/default

# 🔥 IMPORTANTE: asegurar logs visibles
RUN ln -sf /dev/stdout /var/log/nginx/access.log \
    && ln -sf /dev/stderr /var/log/nginx/error.log

EXPOSE 80

# 🔥 FIX REAL DEL PROBLEMA
CMD ["sh", "-c", "php-fpm & nginx -g 'daemon off;'"]