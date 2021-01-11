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
	<link rel="apple-touch-icon" sizes="57x57" href="/fav/apple-icon-57x57.png">
	<link rel="apple-touch-icon" sizes="60x60" href="/fav/apple-icon-60x60.png">
	<link rel="apple-touch-icon" sizes="72x72" href="/fav/apple-icon-72x72.png">
	<link rel="apple-touch-icon" sizes="76x76" href="/fav/apple-icon-76x76.png">
	<link rel="apple-touch-icon" sizes="114x114" href="/fav/apple-icon-114x114.png">
	<link rel="apple-touch-icon" sizes="120x120" href="/fav/apple-icon-120x120.png">
	<link rel="apple-touch-icon" sizes="144x144" href="/fav/apple-icon-144x144.png">
	<link rel="apple-touch-icon" sizes="152x152" href="/fav/apple-icon-152x152.png">
	<link rel="apple-touch-icon" sizes="180x180" href="/fav/apple-icon-180x180.png">
	<link rel="icon" type="image/png" sizes="192x192"  href="/fav/android-icon-192x192.png">
	<link rel="icon" type="image/png" sizes="32x32" href="/fav/favicon-32x32.png">
	<link rel="icon" type="image/png" sizes="96x96" href="/fav/favicon-96x96.png">
	<link rel="icon" type="image/png" sizes="16x16" href="/fav/favicon-16x16.png">
	<link rel="manifest" href="/fav/manifest.json">
	<meta name="msapplication-config" content="/fav/browserconfig.xml">
	<meta name="msapplication-TileColor" content="#fafafa">
	<meta name="msapplication-TileImage" content="/fav/ms-icon-144x144.png">
	<meta name="theme-color" content="#fafafa">

	<style><?php include path('public/css/style.css'); ?></style>

</head>
<body role="document" itemscope itemtype="https://schema.org/WebPage">
	<div id="site" role="document" itemscope="" itemtype="http://schema.org/WebPage">
		<section id="site-header" class="site-header">
			<header id="header" class="header" role="banner" itemscope="" itemtype="http://schema.org/WPHeader">
				<div class="header__wrapper">
				</div>
			</header>
<!--			<nav id="handheld-nav" class="handheld-navigation" role="navigation" aria-label="Navigation mobile">-->
<!--				<ul id="menu-menu-principal-1" class="menu"><li class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-68"><a href="http://localhost:8080/collections/clothing/">Clothing</a></li>-->
<!--					<li class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-69"><a href="http://localhost:8080/collections/clothing/tshirts/">Tshirts</a></li>-->
<!--					<li class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-67"><a href="http://localhost:8080/collections/clothing/hoodies/">Hoodies</a></li>-->
<!--				</ul>-->
<!--			</nav>-->
		</section>
		<section id="site-content" class="site-content">
			<main id="main" class="main" role="main" itemprop="mainContentOfPage">
				<?=$this->section('content')?>
			</main>

			<footer id="footer" class="footer" role="contentinfo" itemscope="" itemtype="http://schema.org/WPFooter">
				<div class="footer__inner">
				</div>
			</footer>
		</section>
	</div>
	<div id="loader" class="loader"></div>
	<script><?php include path('public/js/app.js'); ?></script>
</body>
</html>
