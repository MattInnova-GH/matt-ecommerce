<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('roles')
            ->orderBy('created_at', 'desc')
            ->get();

        $roles = Role::all();

        return Inertia::render('Admin/Users/Users', [
            'users' => $users,
            'roles' => $roles,
        ]);
    }

    public function changeRole(Request $request, User $user)
    {
        $request->validate([
            'role' => 'required|string|exists:roles,name',
        ]);

        // Remover todos los roles actuales y asignar el nuevo
        $user->syncRoles([$request->role]);

        return redirect()->back();
    }

    public function toggleBlock(User $user)
    {
        $user->update([
            'is_active' => ! $user->is_active,
        ]);

        return redirect()->back();
    }

    public function destroy(User $user)
    {
        // Eliminar datos relacionados
        $user->addresses()->delete();
        $user->reviews()->delete();
        $user->cart()->delete();
        $user->sessions()->delete();

        // Eliminar usuario
        $user->delete();

        return redirect()->back();
    }
}
