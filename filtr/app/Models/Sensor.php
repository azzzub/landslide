<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sensor extends Model
{
    use HasFactory;

    protected $table = 'sensor';

    public const CREATED_AT = 'created_at';
    public const UPDATED_AT = 'updated_at';

    protected $primaryKey = 'id';
    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        's', 'e', 'x', 'y', 'z', 'wl'
    ];

    protected $nullable = [
        'wl'
    ];
}
