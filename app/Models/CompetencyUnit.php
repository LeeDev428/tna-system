<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CompetencyUnit extends Model
{
    use HasFactory;

    protected $fillable = [
        'evaluation_form_id',
        'title',
        'description',
        'order_index',
    ];

    public function evaluationForm(): BelongsTo
    {
        return $this->belongsTo(EvaluationForm::class);
    }

    public function elements(): HasMany
    {
        return $this->hasMany(CompetencyElement::class)->orderBy('order_index');
    }
}space App\Models;

use Illuminate\Database\Eloquent\Model;

class CompetencyUnit extends Model
{
    //
}
