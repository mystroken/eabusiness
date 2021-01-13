<?php


namespace App\Controllers;

use App\Controller;


class ContactController extends Controller
{
	public function index(): void
	{
		echo $this->templates->render('contact');
	}

}
