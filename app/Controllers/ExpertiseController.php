<?php


namespace App\Controllers;

use App\Controller;


class ExpertiseController extends Controller
{
	public function index(): void
	{
		echo $this->templates->render('expertise');
	}

}
