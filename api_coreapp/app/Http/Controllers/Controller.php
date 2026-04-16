<?php

namespace App\Http\Controllers;

use App\Traits\LogsAudit;

abstract class Controller
{
    use LogsAudit;
}
