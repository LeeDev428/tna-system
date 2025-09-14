<?php

use Illuminate\Support\Facades\Route;
use App\Models\TrainingNeed;
use App\Models\CompetencyElement;

Route::get('/test-training-needs', function () {
    $trainingNeeds = TrainingNeed::with('competencyElement')->get();
    
    $output = "<h1>Training Needs Test</h1>";
    $output .= "<table border='1' style='width:100%; border-collapse:collapse;'>";
    $output .= "<tr><th>Competency Element</th><th>Training Title</th></tr>";
    
    foreach($trainingNeeds as $need) {
        $output .= "<tr>";
        $output .= "<td>" . htmlspecialchars($need->competencyElement->description) . "</td>";
        $output .= "<td>" . htmlspecialchars($need->training_title) . "</td>";
        $output .= "</tr>";
    }
    
    $output .= "</table>";
    $output .= "<p><strong>Total training needs:</strong> " . count($trainingNeeds) . "</p>";
    
    return $output;
});
