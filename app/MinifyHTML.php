<?php


namespace App;

use League\Plates\Engine;
use League\Plates\Extension\ExtensionInterface;

class MinifyHTML implements ExtensionInterface
{
	protected $engine;
	public $template; // must be public

	public function register(Engine $engine)
	{
		$this->engine = $engine;

		// Access template data:
		$data = $this->template->data();

		// Register functions
		// ...
	}
}
