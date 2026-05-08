<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Address;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function catalog()
    {
        Inertia::render('Client/Catalog', []);
    }
}
