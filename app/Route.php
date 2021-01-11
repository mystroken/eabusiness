<?php


namespace App;


class Route
{
	/**
	 * The router that registered the route.
	 *
	 * @var Router
	 */
//	protected $router;

	/**
	 * @var string
	 */
	protected $controllerNamespace = '\App\Controllers';

	/**
	 * The name of the route.
	 *
	 * @var string
	 */
	protected $name;

	/**
	 * The route controller.
	 *
	 * @var string
	 */
	protected $controller;

	/**
	 * The route parameters.
	 *
	 * @var array
	 * @example /projects/{slug}
	 */
	protected $parameters = [];

	/**
	 * Route constructor.
	 *
	 * @param string $controller
	 */
	public function __construct(string $controller)
	{
		$this->controller = "$this->controllerNamespace\\$controller";
	}

	public function render(): void
	{
		[$controller, $method] = explode('@', $this->controller);
		(new $controller)->$method( implode(',', $this->parameters) );
	}

	/**
	 * Set the route name.
	 *
	 * @param string $name
	 * @return $this
	 */
	public function name(string $name): Route
	{
		$this->name = $name;
		return $this;
	}

	/**
	 * Get the route parameters.
	 *
	 * @return array
	 */
	public function getParameters(): array
	{
		return $this->parameters;
	}

	/**
	 * @param array $parameters
	 * @return Route
	 */
	public function setParameters(array $parameters): Route
	{
		$this->parameters = $parameters;
		return $this;
	}
}
