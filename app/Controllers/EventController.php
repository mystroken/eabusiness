<?php


namespace App\Controllers;

use App\Controller;


class EventController extends Controller
{
	public function index(): void
	{
		echo $this->templates->render('events');
	}

}
