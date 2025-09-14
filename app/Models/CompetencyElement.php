<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CompetencyElement extends Model
{
    use HasFactory;

    protected $fillable = [
        'competency_unit_id',
        'description',
        'order_index',
    ];

    public function competencyUnit(): BelongsTo
    {
        return $this->belongsTo(CompetencyUnit::class);
    }
}
