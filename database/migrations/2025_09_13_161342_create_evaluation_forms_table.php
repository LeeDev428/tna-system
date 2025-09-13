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
        // Evaluation Forms (main forms)
        Schema::create('evaluation_forms', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('designation')->nullable();
            $table->string('office')->nullable();
            $table->string('division')->nullable();
            $table->string('period_covered')->nullable();
            $table->boolean('is_active')->default(true);
            $table->foreignId('created_by')->constrained('users');
            $table->timestamps();
        });

        // Units of Competency
        Schema::create('competency_units', function (Blueprint $table) {
            $table->id();
            $table->foreignId('evaluation_form_id')->constrained('evaluation_forms')->onDelete('cascade');
            $table->string('title');
            $table->text('description')->nullable();
            $table->integer('order_index')->default(0);
            $table->timestamps();
        });

        // Elements within each unit
        Schema::create('competency_elements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('competency_unit_id')->constrained('competency_units')->onDelete('cascade');
            $table->text('description');
            $table->integer('order_index')->default(0);
            $table->timestamps();
        });

        // Rating Criteria (Criticality to Job, Level of Competence, Frequency of Utilization)
        Schema::create('rating_criteria', function (Blueprint $table) {
            $table->id();
            $table->foreignId('evaluation_form_id')->constrained('evaluation_forms')->onDelete('cascade');
            $table->string('type'); // 'criticality', 'competence_level', 'frequency'
            $table->string('label');
            $table->json('scale_options'); // ['1', '2', '3', '4'] with descriptions
            $table->integer('order_index')->default(0);
            $table->timestamps();
        });

        // Scale Descriptions for each rating criteria
        Schema::create('rating_scale_descriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('evaluation_form_id')->constrained('evaluation_forms')->onDelete('cascade');
            $table->string('scale_type'); // 'criticality', 'competence_level', 'frequency'
            $table->json('descriptions'); // Array of scale descriptions
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rating_scale_descriptions');
        Schema::dropIfExists('rating_criteria');
        Schema::dropIfExists('competency_elements');
        Schema::dropIfExists('competency_units');
        Schema::dropIfExists('evaluation_forms');
    }
};
