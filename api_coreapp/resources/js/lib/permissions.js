export function getPermisoNombre(user) {
    return user?.permiso?.nombre || null;
}

export function getHomePathForUser(user) {
    const permiso = getPermisoNombre(user);

    if (!permiso) return '/panel';

    const map = {
        desarrollador: '/panel/desarrollador',
        admin: '/panel/admin',
        presidente: '/panel/presidente',
        delegado: '/panel/delegado',
        tesorero: '/panel/tesorero',
        secretario: '/panel/secretario',
        jugador: '/panel/jugador',
        entrenador: '/panel/entrenador',
        arbitro: '/panel/arbitro',
    };

    return map[permiso] || '/panel';
}
