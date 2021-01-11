<?php


namespace App\Controllers;

use App\Controller;
use App\Models\Service;

class HomeController extends Controller
{
	public function index(): void
	{
		//var_dump(Service::getAll());
		echo $this->templates->render('home');
	}
}
