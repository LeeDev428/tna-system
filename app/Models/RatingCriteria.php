<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RatingCriteria extends Model
{
    use HasFactory;

    protected $table = 'rating_criteria';

    protected $fillable = [
        'evaluation_form_id',
        'type',
        'label',
        'scale_options',
        'order_index',
    ];

    protected $casts = [
        'scale_options' => 'array',
    ];

    public function evaluationForm(): BelongsTo
    {
        return $this->belongsTo(EvaluationForm::class);
    }
}
