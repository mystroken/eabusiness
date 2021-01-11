<?php


namespace App\Models;

use App\Model;
use App\ModelContract as Contract;

class Project extends Model implements Contract
{
	static $table = 'projects';
}
