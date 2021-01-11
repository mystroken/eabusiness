<?php
	$project = $project ?? [];
	$this->layout('layouts/base', ['title' => $project[0]['title']])
?>
<div id="page" class="project-detail-page page" data-key="project-detail">
	<h1><?=$this->e($project[0]['title'])?></h1>
</div>
