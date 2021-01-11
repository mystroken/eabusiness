<?php
/*
|---------------------------------------------------------
| Create the application.
|---------------------------------------------------------
|
| We need to create the application.
|
*/

$app = new \App\Application();

$request = $_SERVER['REQUEST_URI'];

$get = sanitize_input( filter_input_array( INPUT_GET ) );
$post = sanitize_input( filter_input_array( INPUT_POST ) );

return $app;
