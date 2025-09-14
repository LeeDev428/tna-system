<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RatingScaleDescription extends Model
{
    use HasFactory;

    protected $fillable = [
        'evaluation_form_id',
        'scale_type',
        'descriptions',
    ];

    protected $casts = [
        'descriptions' => 'array',
    ];

    public function evaluationForm(): BelongsTo
    {
        return $this->belongsTo(EvaluationForm::class);
    }
}
