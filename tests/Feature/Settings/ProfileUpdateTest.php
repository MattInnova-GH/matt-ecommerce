<?php

use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Support\Facades\Hash;

beforeEach(function () {
    $this->seed(RoleSeeder::class);
});

test('profile page is displayed', function () {
    $user = User::factory()->create();
    $user->assignRole('client');

    $response = $this
        ->actingAs($user)
        ->get(route('client.profile.index'));

    $response->assertOk();
});

test('profile information can be updated', function () {
    $user = User::factory()->create();
    $user->assignRole('client');

    $response = $this
        ->actingAs($user)
        ->put(route('client.profile.update'), [
            'first_name' => 'Test',
            'last_name' => 'User',
            'email' => 'test@example.com',
        ]);

    $response->assertSessionHasNoErrors();

    $user->refresh();

    expect($user->first_name)->toBe('Test');
    expect($user->last_name)->toBe('User');
    expect($user->email)->toBe('test@example.com');
});

test('profile update requires valid email', function () {
    $user = User::factory()->create();
    $user->assignRole('client');

    $response = $this
        ->actingAs($user)
        ->put(route('client.profile.update'), [
            'first_name' => 'Test',
            'last_name' => 'User',
            'email' => 'not-an-email',
        ]);

    $response->assertSessionHasErrors('email');
});

test('password can be updated', function () {
    $user = User::factory()->create();
    $user->assignRole('client');

    $response = $this
        ->actingAs($user)
        ->put(route('client.profile.password'), [
            'current_password' => 'password',
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ]);

    $response->assertSessionHasNoErrors();

    expect(Hash::check('new-password', $user->refresh()->password))->toBeTrue();
});

test('correct current password must be provided to update password', function () {
    $user = User::factory()->create();
    $user->assignRole('client');

    $response = $this
        ->actingAs($user)
        ->put(route('client.profile.password'), [
            'current_password' => 'wrong-password',
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ]);

    $response->assertSessionHasErrors('current_password');

    expect(Hash::check('password', $user->refresh()->password))->toBeTrue();
});
