<?php


namespace App\Controllers;

use App\Controller;


class PartnersController extends Controller
{
	public function index(): void
	{
		echo $this->templates->render('partners');
	}

}
