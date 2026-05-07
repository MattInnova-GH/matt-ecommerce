<?php

namespace App\Enums;

enum TicketStatus: string
{
    case PENDING = 'PENDING';
    case IN_REVIEW = 'IN_REVIEW';
    case RESOLVED = 'RESOLVED';
    case CLOSED = 'CLOSED';
}
