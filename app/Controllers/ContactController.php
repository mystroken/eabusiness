<?php


namespace App\Controllers;

use App\Controller;


class ContactController extends Controller
{

	public function index(): void
	{
		echo $this->templates->render('contact');
	}


	public function send(): void
	{
		if(isset($_POST['email']) && $_POST['email'] !='')
		{
			if(filter_var($_POST['email'], FILTER_VALIDATE_EMAIL))
			{
				$name = $_POST['name'];
				$email = $_POST['email'];
				$message = $_POST['message'];

				$to ="mystroken@gmail.com";
				$subject = "Message depuis eabusiness.africa";
				$message = "Voici un message de test pour votre jolie et belle boite mail monsieur, madame.";
				mail($to, $subject, $message);
				echo "Mail envoyé !";
			}
		}
		else
		{
			echo "champ de validation incorret !";
		}

		echo $this->templates->render('contact');
	}

}
