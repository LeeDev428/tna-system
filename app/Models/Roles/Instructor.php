<?php

namespace App\Models\Roles;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Instructor extends Model
{
    protected $fillable = [
        'user_id',
        'supervisor_id',
        'specialization',
        'certification_level',
        'hire_date',
    ];

    protected function casts(): array
    {
        return [
            'hire_date' => 'date',
        ];
    }

    /**
     * Get the user that owns the instructor profile.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the supervisor of this instructor
     */
    public function supervisor(): BelongsTo
    {
        return $this->belongsTo(Supervisor::class);
    }

    /**
     * Get instructor's experience in years
     */
    public function getExperienceYears(): int
    {
        if (!$this->hire_date) {
            return 0;
        }
        
        return $this->hire_date->diffInYears(\Carbon\Carbon::now());
    }
}
