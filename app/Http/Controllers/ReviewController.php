<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|max:1000',
        ]);

        // Check if user has a completed/accepted order for this product
        $hasPurchased = Order::where('user_id', Auth::id())
            ->whereIn('status', ['ACCEPTED', 'SHIPPED', 'DELIVERED'])
            ->whereHas('items', function ($query) use ($validated) {
                $query->where('product_id', $validated['product_id']);
            })
            ->exists();

        if (! $hasPurchased) {
            return back()->withErrors(['review' => 'You must purchase this product before leaving a review.']);
        }

        Review::create([
            'user_id' => Auth::id(),
            'product_id' => $validated['product_id'],
            'rating' => $validated['rating'],
            'comment' => $validated['comment'],
            'is_approved' => false, // Needs admin approval
        ]);

        return back()->with('success', 'Your review has been submitted and is awaiting approval.');
    }
}
