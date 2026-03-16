import React, { useEffect, useMemo, useState } from 'react';
import http from '../../../../lib/http';
import Card from '../../../../Components/UI/Card';
import DataTable from '../../../../Components/UI/DataTable';
import SearchBar from '../../../../Components/UI/SearchBar';
import Modal from '../../../../Components/UI/Modal';
import toast from 'react-hot-toast';
import { Edit, Trash2, UserCog, ShieldCheck, ShieldX, KeyRound } from 'lucide-react';
import UserForm from './UserForm';
import UserPasswordForm from './UserPasswordForm';

export default function UsersContent() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [passwordUser, setPasswordUser] = useState(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await http.get('/api/users');
            setUsers(res.data);
        } catch (e) {
            toast.error('Error al cargar usuarios');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = useMemo(() => {
        const q = searchTerm.trim().toLowerCase();
        if (!q) return users;

        return users.filter((u) => {
            const permiso = u?.permiso?.nombre || '';
            const rol = u?.rol?.nombre || '';
            const fullName = `${u?.nombre || ''} ${u?.apellido_paterno || ''} ${u?.apellido_materno || ''}`;

            return (
                (u?.name || '').toLowerCase().includes(q) ||
                (u?.email || '').toLowerCase().includes(q) ||
                fullName.toLowerCase().includes(q) ||
                permiso.toLowerCase().includes(q) ||
                rol.toLowerCase().includes(q)
            );
        });
    }, [users, searchTerm]);

    const handleEdit = (u) => {
        setEditingUser(u);
        setIsEditModalOpen(true);
    };

    const handlePassword = (u) => {
        setPasswordUser(u);
        setIsPasswordModalOpen(true);
    };

    const handleToggleStatus = async (u) => {
        const nextActive = !u.active;
        try {
            await http.patch(`/api/users/${u.id}/status`, { active: nextActive });
            toast.success(`Usuario ${nextActive ? 'activado' : 'desactivado'} con éxito`);
            fetchUsers();
        } catch (e) {
            toast.error('Error al actualizar estatus');
        }
    };

    const handleDelete = async (u) => {
        if (!window.confirm(`¿Seguro que deseas eliminar al usuario ${u.email}?`)) return;
        try {
            await http.delete(`/api/users/${u.id}`);
            toast.success('Usuario eliminado con éxito');
            fetchUsers();
        } catch (e) {
            toast.error('Error al eliminar usuario');
        }
    };

    const columns = [
        {
            header: 'Usuario',
            accessor: 'email',
            render: (row) => (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14, color: 'var(--color-text-primary)' }}>
                        {row?.email}
                    </div>
                    <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        {row?.name}
                    </div>
                </div>
            ),
        },
        {
            header: 'Nombre',
            accessor: 'nombre',
            hiddenMobile: true,
            render: (row) => (
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 700, color: 'var(--color-text-secondary)' }}>
                    {`${row?.nombre || ''} ${row?.apellido_paterno || ''} ${row?.apellido_materno || ''}`.trim() || '-'}
                </div>
            ),
        },
        {
            header: 'Permiso',
            accessor: 'permiso',
            render: (row) => (
                <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '4px 10px',
                    borderRadius: 999,
                    fontFamily: 'var(--font-body)',
                    fontSize: 11,
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    color: 'var(--color-text-secondary)',
                    background: 'var(--color-bg-muted)',
                    border: '1px solid var(--color-border-subtle)',
                }}>
                    <UserCog size={14} />
                    {row?.permiso?.nombre || '-'}
                </span>
            ),
        },
        {
            header: 'Rol',
            accessor: 'rol',
            hiddenMobile: true,
            render: (row) => (
                <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '4px 10px',
                    borderRadius: 999,
                    fontFamily: 'var(--font-body)',
                    fontSize: 11,
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    color: 'var(--color-text-secondary)',
                    background: 'var(--color-bg-muted)',
                    border: '1px solid var(--color-border-subtle)',
                }}>
                    {row?.rol?.nombre || '-'}
                </span>
            ),
        },
        {
            header: 'Estado',
            accessor: 'active',
            render: (row) => (
                <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '4px 10px',
                    borderRadius: 999,
                    fontFamily: 'var(--font-body)',
                    fontSize: 11,
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    color: row?.active ? 'var(--color-sage)' : 'var(--color-terra)',
                    background: row?.active ? 'var(--color-sage-light)' : 'var(--color-terra-light)',
                    border: '1px solid var(--color-border-subtle)',
                }}>
                    {row?.active ? <ShieldCheck size={14} /> : <ShieldX size={14} />}
                    {row?.active ? 'Activo' : 'Inactivo'}
                </span>
            ),
        },
    ];

    const actions = (row) => (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
                onClick={() => handleToggleStatus(row)}
                className="btn-ghost"
                style={{ padding: 6, color: row.active ? 'var(--color-terra)' : 'var(--color-sage)', borderRadius: 6 }}
                title={row.active ? 'Desactivar' : 'Activar'}
            >
                {row.active ? <ShieldX size={18} /> : <ShieldCheck size={18} />}
            </button>
            <button
                onClick={() => handlePassword(row)}
                className="btn-ghost"
                style={{ padding: 6, color: 'var(--color-slate)', borderRadius: 6 }}
                title="Cambiar contraseña"
            >
                <KeyRound size={18} />
            </button>
            <button
                onClick={() => handleEdit(row)}
                className="btn-ghost"
                style={{ padding: 6, color: 'var(--color-slate)', borderRadius: 6 }}
                title="Editar"
            >
                <Edit size={18} />
            </button>
            <button
                onClick={() => handleDelete(row)}
                className="btn-ghost"
                style={{ padding: 6, color: 'var(--color-terra)', borderRadius: 6 }}
                title="Eliminar"
            >
                <Trash2 size={18} />
            </button>
        </div>
    );

    return (
        <>
            <Card title="Administración de Usuarios">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                    <SearchBar
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder="Buscar por email, nombre, permiso o rol..."
                        width="320px"
                    />
                    <div />
                </div>
                <br />

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                        Cargando usuarios...
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={filteredUsers}
                        actions={actions}
                    />
                )}
            </Card>

            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title={editingUser ? 'Editar Usuario' : 'Configurar Usuario'}
            >
                <UserForm
                    user={editingUser}
                    onCancel={() => setIsEditModalOpen(false)}
                    onSuccess={() => {
                        setIsEditModalOpen(false);
                        fetchUsers();
                    }}
                />
            </Modal>

            <Modal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
                title="Cambiar Contraseña"
            >
                <UserPasswordForm
                    user={passwordUser}
                    onCancel={() => setIsPasswordModalOpen(false)}
                    onSuccess={() => {
                        setIsPasswordModalOpen(false);
                        fetchUsers();
                    }}
                />
            </Modal>
        </>
    );
}
