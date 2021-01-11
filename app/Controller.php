<?php


namespace App;

use League\Plates\Engine as TemplateEngine;

/**
 * Base Controller
 * @package App
 * @author Mystro Ken <mystroken@gmail.com>
 */
class Controller
{
	/**
	 * @var TemplateEngine
	 */
	protected $templates;

	public function __construct()
	{
		$this->templates = new TemplateEngine(path('app/Views'));
	}
}
