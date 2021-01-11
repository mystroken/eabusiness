<?php


namespace App;


class Router
{

	/**
	 * Hold the class instance.
	 *
	 * @var Router|null
	 */
	private static $instance = null;

	/**
	 * All registered routes.
	 */
	public $routes = [
		'GET' => [],
		'POST' => []
	];

	/**
	 * Keep track on the current route.
	 *
	 * @var Route
	 */
	protected $currentRoute = null;

	/**
	 * Router constructor.
	 * The singleton's constructor should always be private to prevent direct
	 * construction calls with the `new` operator.
	 */
	protected function __construct() {}

	/**
	 * Create an instance of the router from
	 * the globals variables.
	 *
	 * @return Router
	 */
	public static function getInstance(): Router
	{
		if (self::$instance === null) {
			self::$instance = new static;
		}

		return self::$instance;
	}

	/**
	 * @throws \Exception
	 * @return Route
	 */
	public function match(): Route
	{

		$uri = remove_trailing_slashes( parse_url( $_SERVER['REQUEST_URI'], PHP_URL_PATH ) );
		$method = $_SERVER['REQUEST_METHOD'];

		// If the URI match exactly,
		//return immediately the match.
		if (isset($this->routes[$method][$uri])) {
			return $this->routes[$method][$uri];
		}

		// else,
		// may be we have to extract params first
		// before taking our final decision.
		/**
		 * @var string $key
		 * @var Route $route
		 */
		foreach($this->routes[$method] as $key => $route) {
			preg_match_all('#{([^{}/]+)}#', $key, $matches, PREG_SET_ORDER, 0);

			// If this registration doesn't contain any custom
			// parameter, jump to the next.
			if ( empty( $matches ) ) {
				continue;
			}

			// The current registered route key contains custom params.
			// So let's check if it matches with the current URI.
			//
			// The first idea can be to
			// check if the URI and the $key have the same structure.
			$keyParts = explode('/', $key);
			$keyPartsNum = count( $keyParts );
			$uriParts = explode('/', $uri);
			if ( $keyPartsNum === count( $uriParts ) )
			{

				// Since both have same structure,
				// let check if each parts are matching.
				//
				// We'll first assume that there is matching.
				// Then we'll loop through the $keyParts and compare
				// each part with the corresponding $uriParts.
				$isMatching = true;
				$parameters = [];
				for ($i = 0; $i < $keyPartsNum; $i++) {

					// If the current $keyPart is a parameter (contains `{}`),
					// Let's extract it and jump the comparison.
					$keyPart = trim( $keyParts[$i] );
					if ( strpos( $keyPart, '{' ) === 0 ) {
						$paramKey = rtrim( ltrim( $keyPart, '{' ), '}' );
						$parameters[$paramKey] = $uriParts[$i];
						continue;
					}

					if ($keyPart !== $uriParts[$i]) {
						$isMatching = false;
					}
				}

				// Here if $isMatching is true,
				// that means here's our route.
				// we just have to set its params and to return it.
				if (true === $isMatching) {
					return $route->setParameters($parameters);
				}
			}
		}

		// At this stage, we definitely know that
		// the current URI doesn't match to
		// any of our registered routes.
		throw new \Exception('No route defined for this URI.');
	}

	/**
	 * Depending of the REQUEST_URI, call an action.
	 */
	public function callAction(): void
	{
		// If the REQUEST_URI match with a registered route,
		// then call that route.
		// Else, render a 404 view.
		try {
			$this->currentRoute = $this->match();
		} catch (\Exception $e) {
			view( 'errors/404' );
		}

		// Call the controller.
		$this->currentRoute->render();
	}
}
