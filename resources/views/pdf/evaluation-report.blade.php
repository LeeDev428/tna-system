<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Training Needs Analysis Report</title>
    <style>
        @page {
            margin: 15mm;
            size: A4 landscape;
        }
        
        body {
            font-family: Arial, sans-serif;
            font-size: 10px;
            line-height: 1.2;
            margin: 0;
            padding: 0;
        }

        .header {
            text-align: center;
            margin-bottom: 15px;
            border-bottom: 2px solid #333;
            padding-bottom: 8px;
        }

        .header h1 {
            font-size: 16px;
            font-weight: bold;
            margin: 0 0 5px 0;
            color: #333;
        }

        .header h2 {
            font-size: 12px;
            font-weight: normal;
            margin: 0;
            color: #666;
        }

        .info-section {
            display: table;
            width: 100%;
            margin-bottom: 15px;
        }

        .info-row {
            display: table-row;
        }

        .info-cell {
            display: table-cell;
            padding: 3px 8px;
            vertical-align: top;
            width: 50%;
        }

        .info-label {
            font-weight: bold;
            color: #333;
        }

        .competency-section {
            margin-bottom: 15px;
        }

        .competency-title {
            background-color: #f0f0f0;
            padding: 5px 8px;
            font-weight: bold;
            font-size: 11px;
            border: 1px solid #ccc;
            margin-bottom: 0;
        }

        .evaluation-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 9px;
            margin-bottom: 15px;
        }

        .evaluation-table th {
            background-color: #f8f8f8;
            border: 1px solid #ccc;
            padding: 4px 2px;
            text-align: center;
            font-weight: bold;
            font-size: 8px;
            vertical-align: middle;
        }

        .evaluation-table td {
            border: 1px solid #ccc;
            padding: 4px 2px;
            text-align: center;
            vertical-align: middle;
        }

        .element-title {
            text-align: left !important;
            padding-left: 5px !important;
            font-size: 9px;
            max-width: 200px;
            word-wrap: break-word;
        }

        .rating-cell {
            font-weight: bold;
            font-size: 10px;
        }

        .sr-rating {
            color: #1e40af;
        }

        .sp-rating {
            color: #059669;
            font-weight: bold;
        }

        .cpr-score {
            font-weight: bold;
            font-size: 10px;
        }

        .cpr-pass {
            color: #059669;
        }

        .cpr-fail {
            color: #dc2626;
        }

        .training-required {
            background-color: #fee2e2;
            color: #dc2626;
            font-weight: bold;
            font-size: 8px;
        }

        .competent {
            background-color: #dcfce7;
            color: #059669;
            font-weight: bold;
            font-size: 8px;
        }

        .footer {
            margin-top: 20px;
            font-size: 9px;
            text-align: center;
            color: #666;
            border-top: 1px solid #ccc;
            padding-top: 8px;
        }

        .legend {
            margin-top: 15px;
            font-size: 8px;
        }

        .legend-title {
            font-weight: bold;
            margin-bottom: 3px;
        }

        .legend-item {
            margin-bottom: 1px;
        }

        .no-data {
            color: #999;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>TRAINING NEEDS ANALYSIS (TNA)</h1>
        <h2>{{ $evaluationForm->title }}</h2>
    </div>

    <div class="info-section">
        <div class="info-row">
            <div class="info-cell">
                <span class="info-label">NAME:</span> {{ $instructor->name }}
            </div>
            <div class="info-cell">
                <span class="info-label">DESIGNATION:</span> {{ $evaluationForm->designation ?? 'N/A' }}
            </div>
        </div>
        <div class="info-row">
            <div class="info-cell">
                <span class="info-label">OFFICE/UNIT:</span> {{ $evaluationForm->office ?? 'N/A' }}
            </div>
            <div class="info-cell">
                <span class="info-label">DIVISION:</span> {{ $evaluationForm->division ?? 'N/A' }}
            </div>
        </div>
        <div class="info-row">
            <div class="info-cell">
                <span class="info-label">PERIOD COVERED:</span> {{ $evaluationForm->period_covered ?? 'N/A' }}
            </div>
            <div class="info-cell">
                <span class="info-label">SUPERVISOR:</span> {{ $supervisor->name }}
            </div>
        </div>
    </div>

    @foreach($responsesByUnit as $unitData)
    <div class="competency-section">
        <div class="competency-title">
            {{ strtoupper($unitData['unit']['title']) }}
            <span style="font-weight: normal; font-size: 9px;">
                ({{ count($unitData['elements']) }} competency elements)
            </span>
        </div>
        
        <table class="evaluation-table">
            <thead>
                <tr>
                    <th rowspan="2" style="width: 200px; vertical-align: middle;">COMPETENCY ELEMENT</th>
                    <th colspan="2" style="background-color: #e3f2fd;">CRITICALITY</th>
                    <th colspan="2" style="background-color: #e8f5e8;">COMPETENCE OF USER</th>
                    <th colspan="2" style="background-color: #fff3e0;">FREQUENCY OF USE</th>
                    <th colspan="2" style="background-color: #fce4ec;">CPR</th>
                    <th rowspan="2" style="width: 35px; background-color: #f3e5f5;">TRAINING STATUS</th>
                </tr>
                <tr>
                    <th style="width: 25px; background-color: #e3f2fd;">SR</th>
                    <th style="width: 25px; background-color: #e3f2fd;">SP</th>
                    <th style="width: 25px; background-color: #e8f5e8;">SR</th>
                    <th style="width: 25px; background-color: #e8f5e8;">SP</th>
                    <th style="width: 25px; background-color: #fff3e0;">SR</th>
                    <th style="width: 25px; background-color: #fff3e0;">SP</th>
                    <th style="width: 30px; background-color: #fce4ec;">SR</th>
                    <th style="width: 30px; background-color: #fce4ec;">SP</th>
                </tr>
            </thead>
            <tbody>
                @foreach($unitData['elements'] as $elementData)
                <tr>
                    <td class="element-title">{{ $elementData['element']['title'] }}</td>
                    
                    <!-- Criticality -->
                    <td class="rating-cell sr-rating">
                        {{ $elementData['instructor_response'] ? $elementData['instructor_response']->criticality_rating : '-' }}
                    </td>
                    <td class="rating-cell sp-rating">
                        {{ $elementData['supervisor_response'] ? $elementData['supervisor_response']->criticality_rating : '-' }}
                    </td>
                    
                    <!-- Competence Level -->
                    <td class="rating-cell sr-rating">
                        {{ $elementData['instructor_response'] ? $elementData['instructor_response']->competence_rating : '-' }}
                    </td>
                    <td class="rating-cell sp-rating">
                        {{ $elementData['supervisor_response'] ? $elementData['supervisor_response']->competence_rating : '-' }}
                    </td>
                    
                    <!-- Frequency -->
                    <td class="rating-cell sr-rating">
                        {{ $elementData['instructor_response'] ? $elementData['instructor_response']->frequency_rating : '-' }}
                    </td>
                    <td class="rating-cell sp-rating">
                        {{ $elementData['supervisor_response'] ? $elementData['supervisor_response']->frequency_rating : '-' }}
                    </td>
                    
                    <!-- CPR Scores -->
                    <td class="cpr-score {{ $elementData['instructor_response'] && $elementData['instructor_response']->cpr_score >= 21 ? 'cpr-pass' : 'cpr-fail' }}">
                        {{ $elementData['instructor_response'] ? $elementData['instructor_response']->cpr_score : '-' }}
                    </td>
                    <td class="cpr-score {{ $elementData['supervisor_response'] && $elementData['supervisor_response']->cpr_score >= 21 ? 'cpr-pass' : 'cpr-fail' }}">
                        {{ $elementData['supervisor_response'] ? $elementData['supervisor_response']->cpr_score : '-' }}
                    </td>
                    
                    <!-- Training Status -->
                    <td class="{{ $elementData['needs_training'] ? 'training-required' : 'competent' }}">
                        {{ $elementData['needs_training'] ? 'TRAINING REQUIRED' : 'COMPETENT' }}
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    @endforeach

    <div class="legend">
        <div class="legend-title">LEGEND:</div>
        <div class="legend-item"><strong>SR:</strong> Self Rating (Instructor) | <strong>SP:</strong> Supervisor Rating</div>
        <div class="legend-item"><strong>Criticality:</strong> 1=Low, 2=Medium, 3=High</div>
        <div class="legend-item"><strong>Competence:</strong> 1=Beginner, 2=Intermediate, 3=Advanced, 4=Expert</div>
        <div class="legend-item"><strong>Frequency:</strong> 1=Rarely, 2=Sometimes, 3=Frequently</div>
        <div class="legend-item"><strong>CPR Formula:</strong> Criticality × Competence × Frequency | <strong>Green ≥21:</strong> Competent | <strong>Red &lt;21:</strong> Training Required</div>
        <div class="legend-item" style="margin-top: 5px;"><strong>Priority System:</strong> Supervisor evaluation overrides instructor self-evaluation</div>
    </div>

    <div class="footer">
        <div>Generated on {{ $exportDate }} | Training Needs Analysis System</div>
        <div style="margin-top: 3px;">
            <strong>Final Assessment:</strong> 
            @php
                $totalElements = 0;
                $trainingNeeded = 0;
                foreach($responsesByUnit as $unit) {
                    $totalElements += count($unit['elements']);
                    foreach($unit['elements'] as $element) {
                        if($element['needs_training']) $trainingNeeded++;
                    }
                }
                $competentElements = $totalElements - $trainingNeeded;
            @endphp
            {{ $competentElements }}/{{ $totalElements }} Competent Elements | 
            {{ $trainingNeeded }} Elements Need Training
        </div>
    </div>
</body>
</html>
