FROM php:8.1-fpm

# Arguments defined in docker-compose.yml
ARG user=www
ARG uid=1000

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    # Install system dependencies
    git \
    nodejs npm \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libpng-dev \
    # Clear cache
    && apt-get clean && rm -rf /var/lib/apt/lists/* \
    # Install PHP extensions
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Create system user to run Composer and Artisan Commands
RUN useradd -G www-data,root -u $uid -d /home/$user $user \
    && mkdir -p /home/$user/.composer /app \
    && chown -R $user:$user /home/$user /app

# Set working directory
WORKDIR /app

# Set the user
USER $user

# Install project dependencies.
COPY package.json composer.json ./
RUN composer install && npm install

COPY --chown=$user:$user . .
RUN npm run build