<?php
/**
 * @author Mystro Ken <mystroken@gmail.com>
 */

namespace App;

/**
 * Class Application
 * @package App
 */
class Application
{
	/**
	 * The router.
	 * With the current request uri, the router knows
	 * which route to render.
	 *
	 * @var Router
	 */
	protected $router;

	public function __construct()
	{
		$this->router = Router::getInstance();
	}

	/**
	 * Display a response to the user.
	 */
	public function run(): void
	{
		// Depending of the current REQUEST_URI,
		// the router knows which controller to call.
		$this->router->callAction();
	}

	/**
	 * Register a route.
	 *
	 * @param string $method
	 * @param string $uri
	 * @param string $controller
	 * @return Route The registered route.
	 */
	protected function registerRoute(string $method, string $uri, string $controller): Route
	{
		// We have to remove the trailing slash
		// from the uri before using it (except on the root).
		$uri = remove_trailing_slashes( $uri );

		$route = new Route( $controller );
		$this->router->routes[$method][$uri] = $route;
		return $route;
	}

	/**
	 * Register a GET route.
	 *
	 * @param string $uri
	 * @param string $controller
	 * @return Route
	 */
	public function get(string $uri, string $controller): Route
	{
		return $this->registerRoute('GET', $uri, $controller);
	}

	/**
	 * Register a POST route.
	 *
	 * @param string $uri
	 * @param string $controller
	 * @return Route
	 */
	public function post(string $uri, string $controller): Route
	{
		return $this->registerRoute('POST', $uri, $controller);
	}
}
