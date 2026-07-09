<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;


class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         $users = [
            [
                'first_name' => 'Matt',
                'last_name' => 'Admin',
                'email' => 'admin@mattinnovasolution.com',
                'password' => '&d^x,h$?kUNy52I7B', // Replace with a secure password
            ],
            [
                'first_name' => 'Maki',
                'last_name' => 'Admin',
                'email' => 'admin@makitoolsperu.com',
                'password' => 'PVjS!y7zEk1uJ7~P&',
            ],
        ];

        foreach ($users as $data) {

            $user = User::updateOrCreate(
                ['email' => $data['email']],
                [
                    'first_name' => $data['first_name'],
                    'last_name' => $data['last_name'],
                    'password' => Hash::make($data['password']),
                    'email_verified_at' => now(),
                ]
            );

            $user->assignRole('admin');
        }
    }
}
