<?php

/**
 * Poupy
 * A front-end starter kit for web development.
 *
 * @package Poupy
 * @author Mystro Ken <mystroken@gmail.com>
 */

//declare(strict_types=1);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// define('URI', $_SERVER['REQUEST_URI']);
// define('ROOT', $_SERVER['DOCUMENT_ROOT']);

/*
|---------------------------------------------------------
| Register the auto loader
|---------------------------------------------------------
|
| Composer provides a convenient, automatically generated class loader for
| our application. We just need to utilize it! We'll simply require it
| into the script here so that we don't have to worry about manual
| loading any of our classes later on. It feels great to relax.
|
*/

require __DIR__ . '/../vendor/autoload.php';

/*
|---------------------------------------------------------
| Initialize the application
|---------------------------------------------------------
|
| Initialize the application from the current request.
|
*/

$app = require __DIR__ . '/../bootstrap.php';

/*
|---------------------------------------------------------
| Register application routes.
|---------------------------------------------------------
|
| Register routes and run the application.
|
*/

$app->get('/', 'HomeController@index')->name('home');
$app->get('/a-propos/', 'AboutController@index')->name('about');
$app->get('/projets', 'ProjectController@index')->name('projects.all');
$app->get('/projets/{slug}/', 'ProjectController@show')->name('projects.show');

/*
|---------------------------------------------------------
| Run the application.
|---------------------------------------------------------
|
| Since we've registered the routes of the application,
| now we can run the application.
|
*/

$app->run();


//switch ($request) {
//	case '/' :
//		require __DIR__ . '/../resources/views/home.php';
//		break;
//	case '' :
//		require __DIR__ . '/../resources/views/home.php';
//		break;
//	case '/a-propos' :
//		require __DIR__ . '/../resources/views/about.php';
//		break;
//	case '/projets' :
//		require __DIR__ . '/../resources/views/projects/home.php';
//		break;
//	default:
//		require __DIR__ . '/../resources/views/404.php';
//		break;
//}
