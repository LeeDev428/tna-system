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
        Schema::create('training_needs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('competency_element_id')->constrained('competency_elements')->onDelete('cascade');
            $table->string('training_title');
            $table->text('training_description')->nullable();
            $table->integer('duration_hours')->nullable(); // Optional: training duration
            $table->string('training_type')->default('workshop'); // workshop, seminar, course, etc.
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            // Index for faster queries
            $table->index('competency_element_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('training_needs');
    }
};
