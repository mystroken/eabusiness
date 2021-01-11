<?php

namespace App;

Interface ModelContract
{
    public static function getByIdOrSlug($id): array;
    public static function getAll(): array;
}
