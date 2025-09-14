<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TrainingNeed extends Model
{
    use HasFactory;

    protected $fillable = [
        'competency_element_id',
        'training_title',
        'training_description',
        'duration_hours',
        'training_type',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function competencyElement(): BelongsTo
    {
        return $this->belongsTo(CompetencyElement::class);
    }
}
