# ======================
# STAGE 1: Build assets
# ======================
FROM node:18 as node

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

# ======================
# STAGE 2: PHP
# ======================
FROM php:8.2-fpm

RUN apt-get update && apt-get install -y \
    git unzip curl libpq-dev libzip-dev libonig-dev \
    && docker-php-ext-install pdo pdo_pgsql zip mbstring

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

COPY . .

RUN composer install --no-dev --optimize-autoloader --no-interaction

# Copiar assets compilados
COPY --from=node /app/public/build /var/www/public/build

# Permisos
RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# ======================
# NGINX
# ======================
FROM nginx:alpine

COPY --from=php:8.2-fpm /var/www /var/www
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80