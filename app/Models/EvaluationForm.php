<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EvaluationForm extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'designation',
        'office',
        'division',
        'period_covered',
        'is_active',
        'created_by',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function competencyUnits(): HasMany
    {
        return $this->hasMany(CompetencyUnit::class)->orderBy('order_index');
    }

    public function ratingCriteria(): HasMany
    {
        return $this->hasMany(RatingCriteria::class)->orderBy('order_index');
    }

    public function ratingScaleDescriptions(): HasMany
    {
        return $this->hasMany(RatingScaleDescription::class);
    }

    public function evaluationSessions(): HasMany
    {
        return $this->hasMany(EvaluationSession::class);
    }

    // Helper method to get criteria by type
    public function getCriteriaByType(string $type): ?RatingCriteria
    {
        return $this->ratingCriteria->where('type', $type)->first();
    }

    // Helper method to get scale descriptions by type
    public function getScaleDescriptions(string $type): array
    {
        $scale = $this->ratingScaleDescriptions->where('scale_type', $type)->first();
        return $scale ? $scale->descriptions : [];
    }
}
