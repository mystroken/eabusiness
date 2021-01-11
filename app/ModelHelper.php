<?php
namespace App;


Trait ModelHelper
{
    static $table;

	/**
	 * Returns the list of projects.
	 * @return array
	 */
	public static function getAll(): array
	{
		/** @var \PDO $db */
		$db = static::getDB();
		$stmt = $db->query("SELECT * FROM ". static::$table);
		return $stmt->fetchAll(\PDO::FETCH_ASSOC);
	}

	/**
	 * Retrieve a row from table by passing Id or Slug.
	 * @param string|int $id
	 * @return array
	 */
	public static function getByIdOrSlug($id): array
	{
		/** @var \PDO $db */
		$db = static::getDB();
		$whereCondition = is_int($id) ? "id='$id'" : "slug='$id'";
		$stmt = $db->query("SELECT * FROM ". static::$table . " WHERE " . $whereCondition);
		return $stmt->fetchAll(\PDO::FETCH_ASSOC);
	}
}
