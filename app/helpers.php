<?php

use App\Router;


/**
 * Get the path from the project root.
 *
 * @param string|null $relative The relative path.
 * @return string
 */
function path(?string $relative): string
{
	$relative = $relative ?? '';
	return realpath( __DIR__.'/../'.$relative );
}

/**
 * Removes the trailing slashes on a uri.
 *
 * @param string $uri
 * @return string
 */
function remove_trailing_slashes(string $uri): string
{
	return rtrim($uri, '/');
}

/**
 * Render a view.
 *
 * @param string $name
 * @param array|null $args
 */
function view(string $name, ?array $args = []): void
{
	ob_start();
	require path( 'app/Views/' . $name . '.php' );
	$content = ob_get_clean();

	$htmlMin = new voku\helper\HtmlMin();
	echo $htmlMin->minify($content);
}

/**
 * @param array $input
 * @return array
 */
function sanitize_input( ?array $input ): array
{
	$input = $input ?? [];
	return array_map( 'htmlspecialchars', array_map( 'trim', $input ) );
}

/**
 * Get the router instance.
 * @return Router
 */
function router(): Router
{
	return Router::getInstance();
}

/**
 * Get a URL from the route name.
 * @param string $routeName The route's name.
 * @return string
 */
function url(string $routeName): string
{
	return router()->url($routeName);
}
