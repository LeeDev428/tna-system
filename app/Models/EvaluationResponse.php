<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EvaluationResponse extends Model
{
    use HasFactory;

    protected $fillable = [
        'evaluation_form_id',
        'user_id',
        'competency_element_id',
        'evaluated_user_id',
        'response_type',
        'criticality_rating',
        'competence_rating',
        'frequency_rating',
        'cpr_score',
        'needs_training',
    ];

    protected $casts = [
        'cpr_score' => 'float',
        'needs_training' => 'boolean',
    ];

    public function evaluationForm(): BelongsTo
    {
        return $this->belongsTo(EvaluationForm::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function evaluatedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'evaluated_user_id');
    }

    public function competencyElement(): BelongsTo
    {
        return $this->belongsTo(CompetencyElement::class);
    }

    /**
     * Calculate and set the CPR score
     */
    public function calculateCPR(): ?float
    {
        if ($this->criticality_rating && $this->competence_rating && $this->frequency_rating) {
            $this->cpr_score = (float)($this->criticality_rating * $this->competence_rating * $this->frequency_rating);
            $this->needs_training = $this->cpr_score < 21;
            return $this->cpr_score;
        }
        return null;
    }
}
