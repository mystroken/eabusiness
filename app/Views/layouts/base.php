<!doctype html>
<html lang="fr">
<head>
	<meta charset="utf-8">
	<meta http-equiv="x-ua-compatible" content="ie=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php $title = isset($title)? $title . ' -  E&A Business Consulting' : 'E&A Business Consulting, votre cabinet d\'études et conseils.'; ?>
	<title><?=$this->e($title)?></title>
	<meta name="description" content="<?=$this->e($description ?? '')?>">

	<!-- Favicons -->
	<link rel="apple-touch-icon" sizes="57x57" href="/apple-icon-57x57.png">
	<link rel="apple-touch-icon" sizes="60x60" href="/apple-icon-60x60.png">
	<link rel="apple-touch-icon" sizes="72x72" href="/apple-icon-72x72.png">
	<link rel="apple-touch-icon" sizes="76x76" href="/apple-icon-76x76.png">
	<link rel="apple-touch-icon" sizes="114x114" href="/apple-icon-114x114.png">
	<link rel="apple-touch-icon" sizes="120x120" href="/apple-icon-120x120.png">
	<link rel="apple-touch-icon" sizes="144x144" href="/apple-icon-144x144.png">
	<link rel="apple-touch-icon" sizes="152x152" href="/apple-icon-152x152.png">
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-icon-180x180.png">
	<link rel="icon" type="image/png" sizes="192x192"  href="/android-icon-192x192.png">
	<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
	<link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png">
	<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
	<link rel="manifest" href="/manifest.json">
	<meta name="msapplication-TileImage" content="/ms-icon-144x144.png">
	<meta name="msapplication-TileColor" content="#002F61">
	<meta name="theme-color" content="#002F61">

	<style><?php include path('public/css/style.css'); ?></style>
</head>
<body>
	<div id="site" role="document" itemscope="" itemtype="http://schema.org/WebPage">
		<header id="header" class="header" role="banner" itemscope="" itemtype="http://schema.org/WPHeader">
			<div class="header__inner">
				<div class="header__left">
					<h1 class="header__brand" itemscope="" itemtype="http://schema.org/Organization">
						<a href="/" itemprop="url" class="header__logo">
							<span class="original">
								<img src="/img/e&a-business-consulting.png" itemprop="logo" alt="E&A Business Consulting Logo">
							</span>
							<span class="light">
								<img src="/img/e&a-business-consulting-light.png" alt="E&A Business Consulting Light logo">
							</span>
						</a>
					</h1>
					<nav id="navigation-primary" class="navigation-primary" role="navigation" aria-label="Navigation principale">
						<ul class="menu" itemscope itemtype="https://schema.org/SiteNavigationElement">
							<li class="menu-item" itemprop="name">
								<a class="menu-link" itemprop="url" href="/">Accueil</a>
							</li>
							<li class="menu-item" itemprop="name">
								<a class="menu-link" itemprop="url" href="/a-propos">Qui sommes-nous?</a>
							</li>
							<li class="menu-item" itemprop="name">
								<a class="menu-link" itemprop="url" href="/notre-expertise">Notre expertise</a>
							</li>
							<li class="menu-item" itemprop="name">
								<a class="menu-link" itemprop="url" href="/nos-partenaires">Nos partenaires</a>
							</li>
							<li class="menu-item" itemprop="name">
								<a class="menu-link" itemprop="url" href="/nos-evenements">Évènements</a>
							</li>
						</ul>
					</nav>
				</div>
				<div class="header__right">
					<div>+237 222 002 222</div>
					<a href="/contactez-nous" class="btn btn-primary">Nous contacter</a>
				</div>
			</div>
		</header>

		<main id="main" class="main" role="main" itemprop="mainContentOfPage">
			<?=$this->section('content')?>
		</main>

		<footer id="footer" class="footer" role="contentinfo" itemscope itemtype="http://schema.org/WPFooter">
			<div class="footer__logo text-center text-lg-left">
				<img src="/img/e&a-business-consulting-light.png" alt="E&A Business Consulting">
			</div>
			<div class="footer__content d-lg-flex text-center text-lg-left">
				<div class="footer__info mx-auto mx-lg-0" itemscope itemtype="https://schema.org/Organization">
					<span itemprop="name">E&A Business Consulting</span>
					<p>
						Cras mattis consectetur purus sit amet fermentum. Maecenas faucibus mollis interdum. Nullam quis risus eget urna mollis ornare vel eu leo.
					</p>
					<span itemprop="telephone">(+237) 242 68 53 00 </span><br>
					<span itemprop="email">info(at)eabusiness.africa</span>
				</div>
				<nav class="navigation-secondary d-md-flex justify-content-center w-100 mt-5 mt-lg-0">
					<div class="footer__nav__item">
						<h4 class="footer__nav__title">Menu #1</h4>
						<ul class="footer__menu menu menu-1">
							<li class="menu-item">
								<a href="#" class="menu-link">Link 1</a>
							</li>
							<li class="menu-item">
								<a href="#" class="menu-link">Element 2</a>
							</li>
							<li class="menu-item">
								<a href="#" class="menu-link">Link 3</a>
							</li>
						</ul>
					</div>
					<div class="footer__nav__item">
						<h4 class="footer__nav__title">Menu #2</h4>
						<ul class="footer__menu menu menu-1">
							<li class="menu-item">
								<a href="#" class="menu-link">Link 1</a>
							</li>
							<li class="menu-item">
								<a href="#" class="menu-link">Element 2</a>
							</li>
							<li class="menu-item">
								<a href="#" class="menu-link">Link 3</a>
							</li>
						</ul>
					</div>
					<div class="footer__nav__item">
						<h4 class="footer__nav__title">Menu #3</h4>
						<ul class="footer__menu menu menu-1">
							<li class="menu-item">
								<a href="#" class="menu-link">Link 1</a>
							</li>
							<li class="menu-item">
								<a href="#" class="menu-link">Element 2</a>
							</li>
							<li class="menu-item">
								<a href="#" class="menu-link">Link 3</a>
							</li>
						</ul>
					</div>
				</nav>
			</div>
			<div class="footer__copyright">
				Copyright © 2021 E&A Business Consulting  — Site conçu par <a target="_blank" href="https://www.flexyla.com">FlexyLa Studio</a>
			</div>
		</footer>
	</div>
	<div id="loader" class="loader"></div>
	<script><?php include path('public/js/app.js'); ?></script>
</body>
</html>
