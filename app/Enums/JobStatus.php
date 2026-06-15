<?php

namespace App\Enums;

enum JobStatus: string
{
    case Intake = 'Intake';
    case AiExtraction = 'AI Extraction';
    case Verification = 'Verification';
    case Generation = 'Generation';
    case PdfGenerated = 'PDF Generated';
    case SentToAirline = 'Sent to Airline';
    case AirlineConfirmed = 'Airline Confirmed';
    case Completed = 'Completed';
    case Lost = 'Lost';
}
