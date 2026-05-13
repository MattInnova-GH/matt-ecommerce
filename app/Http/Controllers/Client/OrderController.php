<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        return Inertia::render('Client/Profile/Orders/Orders');
        // cuando conectes datos reales, pasarás los pedidos aquí
    }
}
