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
				$headers = 'From: webmaster@example.com' . "\r\n" .
				'Reply-To: webmaster@example.com' . "\r\n" .
				'X-Mailer: PHP/' . phpversion();
				try {
					mail($to, $subject, $message, $headers);
				} catch (\Exception $e) {
					echo $e->getMessage();
				}
				echo "Mail envoyé !";
			}
		}
		else
		{
			echo "champ de validation incorret !";
		}

// 		$apiKey = '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';
// //		$mailer = new Sendgrid($apiKey);
// //
// //		$email = (new Email())
// //			->addTo('mystroken@gmail.com')
// //			->setFrom('noreply@eabusiness.africa')
// //			->setSubject('Hello, world!')
// //			->setTextBody('Hello World! How are you?');
// //
// //		try {
// //			$mailer->send($email);
// //		} catch (Exception $e) {
// //			echo $e->getMessage();
// //		}
// 		$email = new \SendGrid\Mail\Mail();
// 		$email->setFrom("mystroken@gmail.com", "Mystro Ken");
// 		$email->setSubject("Sending with Twilio SendGrid is Fun");
// 		$email->addTo("emmanuel.kwene@flexyla.com", "Mystro Ken");
// 		$email->addContent("text/plain", "and easy to do anywhere, even with PHP");
// 		$email->addContent(
// 			"text/html", "<strong>and easy to do anywhere, even with PHP</strong>"
// 		);
// 		$sendgrid = new \SendGrid($apiKey);
// 		try {
// 			$response = $sendgrid->send($email);
// 			print $response->statusCode() . "\n";
// 			print_r($response->headers());
// 			print $response->body() . "\n";
// 		} catch (\Exception $e) {
// 			echo 'Caught exception: '. $e->getMessage() ."\n";
// 		}

//		echo $this->templates->render('contact');
	}

}
