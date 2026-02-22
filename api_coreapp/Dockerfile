FROM php:8.2-cli

# Dependencias sistema + Node + PHP extensions
RUN apt-get update && apt-get install -y \
    git unzip curl libpq-dev libzip-dev libonig-dev \
    nodejs npm \
    && docker-php-ext-install pdo pdo_pgsql zip mbstring \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Copiar proyecto
COPY . .

# Instalar dependencias PHP
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Instalar dependencias frontend
RUN npm install

# Build Vite producción
RUN npm run build

# Permisos Laravel
RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Puerto Render
ENV PORT=10000
EXPOSE 10000

# Arranque
CMD php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache && \
    php artisan migrate --force && \
    php artisan serve --host=0.0.0.0 --port=$PORT