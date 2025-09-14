<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EvaluationSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'evaluation_form_id',
        'user_id',
        'evaluated_user_id',
        'session_type',
        'response_type',
        'status',
        'supervisor_status',
        'total_elements',
        'completed_elements',
        'completion_percentage',
        'started_at',
        'completed_at',
    ];

    protected $casts = [
        'completion_percentage' => 'float',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
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

    public function evaluationResponses(): HasMany
    {
        $responseType = $this->session_type; // 'self' or 'supervisor'
        
        return $this->hasMany(EvaluationResponse::class, 'evaluation_form_id', 'evaluation_form_id')
                    ->where('user_id', $this->user_id)
                    ->where('response_type', $responseType);
    }

    /**
     * Update completion status based on responses
     */
    public function updateCompletionStatus()
    {
        $totalElements = $this->evaluationForm->competencyUnits()
            ->withCount('elements')
            ->get()
            ->sum('elements_count');

        $completedElements = EvaluationResponse::where([
            'evaluation_form_id' => $this->evaluation_form_id,
            'user_id' => $this->user_id,
            'evaluated_user_id' => $this->evaluated_user_id,
            'response_type' => $this->session_type,
        ])->whereNotNull('criticality_rating')
          ->whereNotNull('competence_rating')
          ->whereNotNull('frequency_rating')
          ->count();

        $this->total_elements = $totalElements;
        $this->completed_elements = $completedElements;
        $this->completion_percentage = $totalElements > 0 ? round(($completedElements / $totalElements) * 100, 2) : 0.00;

        if ($this->completion_percentage == 100) {
            $this->status = 'completed';
            $this->completed_at = now();
        } elseif ($this->completion_percentage > 0) {
            $this->status = 'in_progress';
            if (!$this->started_at) {
                $this->started_at = now();
            }
        }

        $this->save();
    }

    /**
     * Check if evaluation is completed
     */
    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    /**
     * Check if evaluation is in progress
     */
    public function isInProgress(): bool
    {
        return $this->status === 'in_progress';
    }

    /**
     * Check if evaluation is not started
     */
    public function isNotStarted(): bool
    {
        return $this->status === 'not_started';
    }
}
