<?php


namespace App;

use PDO;

/**
 * Base Model
 * @package App
 * @author Mystro Ken <mystroken@gmail.com>
 */
abstract class Model
{
	use ModelHelper;

	/**
	 * Get the PDO database connection
	 *
	 * @return PDO
	 */
	protected static function getDB(): PDO
	{
		static $db = null;

		if ($db === null) {
			$db = new PDO('mysql:host=o2itty_db;dbname='.getenv('MYSQL_DATABASE'),getenv('MYSQL_USER'), getenv('MYSQL_PASSWORD'));
			$db->query('SET NAMES utf8mb4');
			$db->query('SET CHARACTER_SET utf8mb4_unicode_ci');

			// Throw an Exception when an error occurs
			// TODO: Remove for production
			$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		}

		return $db;
	}
}
