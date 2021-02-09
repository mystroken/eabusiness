<?php


namespace App\Controllers;

use App\Controller;


class ContactController extends Controller
{

	public function index(): void
	{
		$sendMail = $this->sendMail() ;
		echo $this->templates->render('contact',[
			'sendMail' => $sendMail,
		] );
	}


	public function sendMail()
	{
		if(isset($_POST['email']) && $_POST['email'] !='')
		{
			if(filter_var($_POST['email'], FILTER_VALIDATE_EMAIL))
			{
				$name = $_POST['name'];
				$email = $_POST['email'];
				$message = $_POST['message'];
				$to ="aaa@gmail.com";
				mail($to, $email, $message);
			}
		}
		else
		{
			echo "champ de validation incorret !";
		}
	}

}
