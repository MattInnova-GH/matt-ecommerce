<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Inertia\Inertia;

class ReviewController extends Controller
{
    public function index()
    {
        $reviews = Review::with(['user', 'product'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Admin/Reviews/Review', [
            'reviews' => $reviews,
        ]);
    }

    public function approve(Review $review)
    {
        $review->update([
            'is_approved' => true,
        ]);

        return redirect()->back()->with('success', 'Review approved successfully.');
    }

    public function destroy(Review $review)
    {
        $review->delete();

        return redirect()->back()->with('success', 'Review deleted successfully.');
    }
}
