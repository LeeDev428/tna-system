<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('evaluation_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('evaluation_form_id')->constrained('evaluation_forms')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // The person taking the evaluation
            $table->foreignId('evaluated_user_id')->nullable()->constrained('users')->onDelete('cascade'); // The person being evaluated (for supervisors)
            $table->enum('session_type', ['self', 'supervisor']); // Type of evaluation
            $table->string('response_type')->default('instructor'); // For compatibility: 'instructor' for self, 'supervisor' for supervisor
            $table->enum('status', ['not_started', 'in_progress', 'completed'])->default('not_started');
            $table->enum('supervisor_status', ['not_evaluated', 'in_progress', 'completed'])->default('not_evaluated'); // Track supervisor evaluation status
            $table->integer('total_elements')->default(0); // Total number of elements to evaluate
            $table->integer('completed_elements')->default(0); // Number of elements completed
            $table->decimal('completion_percentage', 5, 2)->default(0.00); // Percentage completed
            $table->timestamp('started_at')->nullable(); // When evaluation was started
            $table->timestamp('completed_at')->nullable(); // When evaluation was completed
            $table->timestamps();

            // Unique constraint to prevent duplicate sessions
            $table->unique(['evaluation_form_id', 'user_id', 'evaluated_user_id', 'session_type'], 'unique_evaluation_session');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('evaluation_sessions');
    }
};
