<?php


namespace App\Controllers;

use App\Controller;
use App\Models\Project;

class ProjectController extends Controller
{
	/**
	 * Projects homepage.
	 */
	public function index(): void
	{
		$projects = Project::getAll();
		echo $this->templates->render('projects/home', ['projects' => $projects]);
	}

	/**
	 * Details page.
	 * @param string $slug
	 */
	public function show(string $slug): void
	{
		$project = Project::getByIdOrSlug($slug);
		if (empty($project)) echo $this->templates->render('errors/404');
		else echo $this->templates->render('projects/details', [ 'project' => $project ]);
	}
}
