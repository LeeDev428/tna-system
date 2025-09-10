<?php

namespace App\Models\Roles;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Supervisor extends Model
{
    protected $fillable = [
        'user_id',
        'department',
        'assigned_instructors',
    ];

    protected function casts(): array
    {
        return [
            'assigned_instructors' => 'array',
        ];
    }

    /**
     * Get the user that owns the supervisor profile.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get instructors supervised by this supervisor
     */
    public function instructors(): HasMany
    {
        return $this->hasMany(Instructor::class, 'supervisor_id');
    }

    /**
     * Get assigned instructors count
     */
    public function getAssignedInstructorsCount(): int
    {
        return $this->instructors()->count();
    }
}
