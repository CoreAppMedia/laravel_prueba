FROM php:8.2-cli

WORKDIR /var/www

# Dependencias sistema
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libpq-dev

# Extensión PostgreSQL
RUN docker-php-ext-install pdo_pgsql

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copiar proyecto
COPY . .

# Instalar dependencias
RUN composer install --no-dev --optimize-autoloader

# Permisos Laravel
RUN chmod -R 775 storage bootstrap/cache

# Limpiar cache (solo esto en build)
RUN php artisan config:clear && \
    php artisan route:clear && \
    php artisan view:clear

# Puerto Render
ENV PORT=10000
EXPOSE 10000

# 🔥 Migrar en runtime (correcto)
CMD php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=$PORT