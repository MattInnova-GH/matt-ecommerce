import { useState } from 'react';
import { router } from '@inertiajs/react';
import {
    Users as UsersIcon,
    Search,
    MoreHorizontal,
    Trash2,
    Shield,
    Ban,
    CheckCircle,
    Mail,
    Calendar,
    UserCheck,
    UserX,
    RefreshCw,
    Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import admin from '@/routes/admin';

interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
    avatar: string | null;
    is_active: boolean;
    email_verified_at: string | null;
    created_at: string;
    roles: { id: number; name: string }[];
}

interface Props {
    users: User[];
    roles: { id: number; name: string }[];
}

export default function Users({ users, roles }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showRoleDialog, setShowRoleDialog] = useState(false);
    const [selectedRole, setSelectedRole] = useState<string>('');
    const [userToBlock, setUserToBlock] = useState<User | null>(null);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const filtered = users.filter(
        (user) =>
            user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const activeUsers = users.filter((u) => u.is_active).length;
    const blockedUsers = users.filter((u) => !u.is_active).length;

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const handleDelete = () => {
        if (!userToDelete) {
            return;
        }

        const id = userToDelete.id; // capturar antes
        setIsProcessing(true);

        router.delete(admin.users.destroy(id), {
            onSuccess: () => {
                setUserToDelete(null);
                setIsProcessing(false);
            },
            onError: () => {
                toast.error('Error al eliminar el usuario');
                setIsProcessing(false);
            },
        });
    };

    const handleChangeRole = () => {
        if (!selectedUser || !selectedRole) {
            return;
        }

        const id = selectedUser.id; // capturar antes
        setIsProcessing(true);

        router.post(
            admin.users.changeRole(id),
            { role: selectedRole },
            {
                onSuccess: () => {
                    setShowRoleDialog(false);
                    setSelectedUser(null);
                    setSelectedRole('');
                    toast.success('Rol actualizado exitosamente');
                    setIsProcessing(false);
                },
                onError: () => {
                    toast.error('Error al actualizar el rol');
                    setIsProcessing(false);
                },
            },
        );
    };

    const handleToggleBlock = () => {
        if (!userToBlock) {
            return;
        }

        const user = userToBlock; // capturar antes
        const wasActive = user.is_active;
        setIsProcessing(true);

        router.post(
            admin.users.toggleBlock(user.id),
            {},
            {
                onSuccess: () => {
                    setUserToBlock(null);
                    toast.success(
                        `Usuario ${wasActive ? 'desbloqueado' : 'bloqueado'} exitosamente`,
                    );
                    setIsProcessing(false);
                },
                onError: () => {
                    toast.error('Error al cambiar el estado del usuario');
                    setIsProcessing(false);
                },
            },
        );
    };

    const getRoleBadgeColor = (roleName: string) => {
        const colors: Record<string, string> = {
            admin: 'bg-red-100 text-red-700',
            seller: 'bg-blue-100 text-blue-700',
            customer: 'bg-green-100 text-green-700',
        };

        return colors[roleName] || 'bg-gray-100 text-gray-700';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        Usuarios
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Gestiona los usuarios y sus permisos
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Usuarios
                        </CardTitle>
                        <UsersIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{users.length}</div>
                        <p className="text-xs text-muted-foreground">
                            Usuarios registrados
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Usuarios Activos
                        </CardTitle>
                        <UserCheck className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {activeUsers}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Cuentas activas
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Usuarios Bloqueados
                        </CardTitle>
                        <UserX className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">
                            {blockedUsers}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Cuentas bloqueadas
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <div className="flex flex-1">
                <div className="relative flex-1">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por nombre o correo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="rounded-lg border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50">
                            <TableHead>Usuario</TableHead>
                            <TableHead>Correo</TableHead>
                            <TableHead>Rol</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Fecha Registro</TableHead>
                            <TableHead className="text-right">
                                Acciones
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="h-32 text-center"
                                >
                                    <div className="flex flex-col items-center justify-center text-gray-500">
                                        <UsersIcon className="mb-2 h-8 w-8" />
                                        <p>No se encontraron usuarios</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filtered.map((user) => (
                                <TableRow
                                    key={user.id}
                                    className="hover:bg-gray-50"
                                >
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage
                                                    src={
                                                        user.avatar || undefined
                                                    }
                                                />
                                                <AvatarFallback className="bg-indigo-100 text-indigo-600">
                                                    {getInitials(
                                                        user.first_name,
                                                        user.last_name,
                                                    )}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {user.first_name}{' '}
                                                    {user.last_name}
                                                </p>
                                                {user.phone && (
                                                    <p className="text-xs text-gray-500">
                                                        {user.phone}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-3 w-3 text-gray-400" />
                                            <span className="text-sm">
                                                {user.email}
                                            </span>
                                            {user.email_verified_at && (
                                                <CheckCircle className="h-3 w-3 text-green-500" />
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {user.roles.map((role) => (
                                                <Badge
                                                    key={role.id}
                                                    className={getRoleBadgeColor(
                                                        role.name,
                                                    )}
                                                >
                                                    {role.name === 'admin'
                                                        ? 'Administrador'
                                                        : role.name === 'seller'
                                                          ? 'Vendedor'
                                                          : 'Cliente'}
                                                </Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {user.is_active ? (
                                            <Badge className="bg-green-100 text-green-700">
                                                Activo
                                            </Badge>
                                        ) : (
                                            <Badge className="bg-red-100 text-red-700">
                                                Bloqueado
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-3 w-3 text-gray-400" />
                                            <span className="text-sm">
                                                {formatDate(user.created_at)}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>
                                                    Acciones
                                                </DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setSelectedRole(
                                                            user.roles[0]
                                                                ?.name || '',
                                                        );
                                                        setShowRoleDialog(true);
                                                    }}
                                                >
                                                    <Shield className="mr-2 h-4 w-4" />
                                                    Cambiar Rol
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        setUserToBlock(user)
                                                    }
                                                    className="text-orange-600"
                                                >
                                                    {user.is_active ? (
                                                        <>
                                                            <Ban className="mr-2 h-4 w-4" />{' '}
                                                            Bloquear Usuario
                                                        </>
                                                    ) : (
                                                        <>
                                                            <RefreshCw className="mr-2 h-4 w-4" />{' '}
                                                            Desbloquear Usuario
                                                        </>
                                                    )}
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        setUserToDelete(user)
                                                    }
                                                    className="text-red-600"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Eliminar Usuario
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Change Role Dialog */}
            <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Cambiar Rol de Usuario</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Usuario</Label>
                            <Input
                                value={
                                    selectedUser
                                        ? `${selectedUser.first_name} ${selectedUser.last_name}`
                                        : ''
                                }
                                disabled
                                className="bg-gray-50"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Nuevo Rol</Label>
                            <Select
                                value={selectedRole}
                                onValueChange={setSelectedRole}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar rol" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map((role) => (
                                        <SelectItem
                                            key={role.id}
                                            value={role.name}
                                        >
                                            {role.name === 'admin'
                                                ? 'Administrador'
                                                : role.name === 'seller'
                                                  ? 'Vendedor'
                                                  : 'Cliente'}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowRoleDialog(false)}
                                className="flex-1"
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleChangeRole}
                                disabled={isProcessing || !selectedRole}
                                className="flex-1"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Actualizando...
                                    </>
                                ) : (
                                    'Cambiar Rol'
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Block/Unblock Confirmation */}
            <AlertDialog
                open={!!userToBlock}
                onOpenChange={() => setUserToBlock(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {userToBlock?.is_active
                                ? 'Bloquear Usuario'
                                : 'Desbloquear Usuario'}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {userToBlock?.is_active ? (
                                <>
                                    ¿Estás seguro de desbloquear a{' '}
                                    <strong>
                                        {userToBlock?.first_name}{' '}
                                        {userToBlock?.last_name}
                                    </strong>
                                    ? El usuario podrá acceder nuevamente a la
                                    plataforma.
                                </>
                            ) : (
                                <>
                                    ¿Estás seguro de bloquear a{' '}
                                    <strong>
                                        {userToBlock?.first_name}{' '}
                                        {userToBlock?.last_name}
                                    </strong>
                                    ? El usuario no podrá acceder a la
                                    plataforma.
                                </>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleToggleBlock}
                            className={
                                userToBlock?.is_active
                                    ? 'bg-red-600 hover:bg-red-700'
                                    : 'bg-green-600 hover:bg-green-700'
                            }
                        >
                            {userToBlock?.is_active
                                ? 'Bloquear'
                                : 'Desbloquear'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Delete Confirmation */}
            <AlertDialog
                open={!!userToDelete}
                onOpenChange={() => setUserToDelete(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Eliminar Usuario</AlertDialogTitle>
                        <AlertDialogDescription>
                            ¿Estás seguro de eliminar a{' '}
                            <strong>
                                {userToDelete?.first_name}{' '}
                                {userToDelete?.last_name}
                            </strong>
                            ? Esta acción es irreversible y eliminará sus
                            datos (direcciones, reseñas, carrito, etc.). Si
                            tiene pedidos registrados, no podrá eliminarse
                            (bloquéalo en su lugar).
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
