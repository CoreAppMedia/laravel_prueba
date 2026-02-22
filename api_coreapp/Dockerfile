FROM php:8.2-cli

WORKDIR /var/www

# Dependencias sistema necesarias para PostgreSQL
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libpq-dev

# Extensiones PHP necesarias
RUN docker-php-ext-install pdo_pgsql

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copiar proyecto
COPY . .

# Instalar dependencias Laravel
RUN composer install --no-dev --optimize-autoloader

# Permisos Laravel
RUN chmod -R 775 storage bootstrap/cache

# Limpiar cache y migrar DB
RUN php artisan config:clear && \
    php artisan route:clear && \
    php artisan view:clear && \
    php artisan migrate --force

# Puerto Render
ENV PORT=10000
EXPOSE 10000

CMD php artisan serve --host=0.0.0.0 --port=$PORT