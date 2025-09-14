<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->boot();

use App\Models\TrainingNeed;

echo "Current training needs:\n";
$needs = TrainingNeed::with('competencyElement')->take(10)->get();

foreach($needs as $need) {
    echo $need->competencyElement->title . " => " . $need->training_title . "\n";
}
