<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Models\Roles\Admin;
use App\Models\Roles\Instructor;
use App\Models\Roles\Supervisor;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * User roles constants
     */
    public const ROLE_ADMIN = 'admin';
    public const ROLE_SUPERVISOR = 'supervisor';
    public const ROLE_INSTRUCTOR = 'instructor';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'is_active',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Relationships
     */
    public function adminProfile(): HasOne
    {
        return $this->hasOne(Admin::class);
    }

    public function supervisorProfile(): HasOne
    {
        return $this->hasOne(Supervisor::class);
    }

    public function instructorProfile(): HasOne
    {
        return $this->hasOne(Instructor::class);
    }

    /**
     * Role helper methods
     */
    public function isAdmin(): bool
    {
        return $this->role === self::ROLE_ADMIN;
    }

    public function isSupervisor(): bool
    {
        return $this->role === self::ROLE_SUPERVISOR;
    }

    public function isInstructor(): bool
    {
        return $this->role === self::ROLE_INSTRUCTOR;
    }

    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }

    /**
     * Get dashboard route based on user role
     */
    public function getDashboardRoute(): string
    {
        return match ($this->role) {
            self::ROLE_ADMIN => '/admin/dashboard',
            self::ROLE_SUPERVISOR => '/supervisor/dashboard',
            self::ROLE_INSTRUCTOR => '/instructor/dashboard',
            default => '/dashboard',
        };
    }
}
