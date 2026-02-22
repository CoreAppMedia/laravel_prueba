FROM php:8.2-cli

# Dependencias sistema + PostgreSQL + ZIP + mbstring
RUN apt-get update && apt-get install -y \
    git unzip curl libpq-dev libzip-dev libonig-dev \
    && docker-php-ext-install pdo pdo_pgsql zip mbstring \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Directorio app
WORKDIR /var/www

# Copiar proyecto
COPY . .

# Instalar dependencias Laravel
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Permisos Laravel
RUN chmod -R 775 storage bootstrap/cache

# Limpiar caches del repo (muy importante)
RUN php artisan config:clear && \
    php artisan route:clear && \
    php artisan view:clear

# Puerto Render
ENV PORT=10000
EXPOSE 10000

# Arranque runtime seguro
CMD ["sh","-c","php artisan config:cache && php artisan route:cache && php artisan view:cache && php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=$PORT"]