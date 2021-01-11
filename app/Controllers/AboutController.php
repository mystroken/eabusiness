<?php


namespace App\Controllers;

use App\Controller;


class AboutController extends Controller
{
	public function index(): void
	{
		echo $this->templates->render('about');
	}

}
