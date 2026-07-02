<?php

use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Support\Facades\Notification;

beforeEach(function () {
    $this->seed(RoleSeeder::class);
});

test('registering sends a verification email and does not verify the account', function () {
    Notification::fake();

    $response = $this->post('/register', [
        'name' => 'Nuevo',
        'last_name' => 'Cliente',
        'email' => 'nuevo.cliente@example.com',
        'password' => 'Password123!',
        'password_confirmation' => 'Password123!',
    ]);

    $user = User::where('email', 'nuevo.cliente@example.com')->first();

    expect($user)->not->toBeNull();
    expect($user->hasVerifiedEmail())->toBeFalse();
    $response->assertRedirect(route('verification.notice'));

    Notification::assertSentTo($user, VerifyEmail::class);
});

test('unverified users are redirected away from client routes', function () {
    $user = User::factory()->unverified()->create();
    $user->assignRole('client');

    $response = $this->actingAs($user)->get(route('client.cart.index'));

    $response->assertRedirect(route('verification.notice'));
});

test('verified users can access client routes', function () {
    $user = User::factory()->create();
    $user->assignRole('client');

    $response = $this->actingAs($user)->get(route('client.cart.index'));

    $response->assertOk();
});
