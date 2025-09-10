<?php

namespace App\Models\Roles;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Admin extends Model
{
    protected $fillable = [
        'user_id',
        'permissions',
        'department',
    ];

    protected function casts(): array
    {
        return [
            'permissions' => 'array',
        ];
    }

    /**
     * Get the user that owns the admin profile.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Check if admin has specific permission
     */
    public function hasPermission(string $permission): bool
    {
        return in_array($permission, $this->permissions ?? []);
    }

    /**
     * Get all instructors count
     */
    public function getInstructorsCount(): int
    {
        return User::where('role', User::ROLE_INSTRUCTOR)->where('is_active', true)->count();
    }

    /**
     * Get all supervisors count
     */
    public function getSupervisorsCount(): int
    {
        return User::where('role', User::ROLE_SUPERVISOR)->where('is_active', true)->count();
    }
}
