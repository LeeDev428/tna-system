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
        Schema::create('evaluation_responses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('evaluation_form_id')->constrained('evaluation_forms')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // The person filling the form
            $table->foreignId('competency_element_id')->constrained('competency_elements')->onDelete('cascade');
            $table->foreignId('evaluated_user_id')->nullable()->constrained('users')->onDelete('cascade'); // The person being evaluated (for supervisor evaluations)
            $table->string('response_type')->default('self'); // 'self' for instructor, 'supervisor' for supervisor evaluation
            $table->integer('criticality_rating')->nullable(); // 1-3
            $table->integer('competence_rating')->nullable(); // 1-4
            $table->integer('frequency_rating')->nullable(); // 1-3
            $table->decimal('cpr_score', 8, 2)->nullable(); // Calculated CPR score
            $table->boolean('needs_training')->default(false); // True if CPR < 21
            $table->timestamps();

            // Update unique constraint to include evaluated_user_id and response_type
            $table->unique(['user_id', 'competency_element_id', 'evaluated_user_id', 'response_type'], 'unique_response');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('evaluation_responses');
    }
};
