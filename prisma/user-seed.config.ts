import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
export const users = (async () => {
    return [
        {
            firstName: 'wsi',
            lastName: 'wsi',
            email: 'wsi.admin@wsi.com',
            password: await bcrypt.hash('vFx5fjDQoX@2&8cX', 10),
            role: Role.ADMIN
        },
        {
            firstName: 'wsi',
            lastName: 'wsi',
            email: 'wsi.user@wsi.com',
            password: await bcrypt.hash('Jz4fvB@T$2GVbX48xY', 10),
            role: Role.USER
        },
        {
            firstName: 'wsi',
            lastName: 'wsi',
            email: 'wsi.manager@wsi.com',
            password: await bcrypt.hash('WJ4B@T$ghsg24TRY', 10),
            role: Role.MANAGER
        }
    ];
})();