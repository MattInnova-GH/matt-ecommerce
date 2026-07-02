<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        $rules = [
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
        ];

        if (isset($input['registration_type']) && $input['registration_type'] === 'seller') {
            $rules = array_merge($rules, [
                'business_name' => ['required', 'string', 'max:255'],
                'business_type' => ['required', 'string', 'max:255'],
                'document_type' => ['required', 'string', 'in:DNI,RUC'],
                'document_number' => ['required', 'string', 'max:255'],
                'address' => ['required', 'string', 'max:500'],
                'experience' => ['required', 'string'],
            ]);
        }

        Validator::make($input, $rules)->validate();

        return DB::transaction(function () use ($input) {
            $user = User::create([
                'first_name' => $input['name'],
                'last_name' => $input['last_name'] ?? null,
                'email' => $input['email'],
                'phone' => $input['phone'],
                'password' => $input['password'],
                'dni' => $input['document_number'] ?? null,
            ]);

            if (isset($input['registration_type']) && $input['registration_type'] === 'seller') {
                $user->assignRole('seller');

            } else {
                $user->assignRole('client');
            }

            return $user;
        });
    }
}
