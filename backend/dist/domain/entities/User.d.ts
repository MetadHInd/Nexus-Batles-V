export interface UserProps {
    id?: string;
    nombres: string;
    apellidos: string;
    email: string;
    password: string;
    apodo: string;
    avatar?: string;
    rol?: 'PLAYER' | 'ADMIN' | 'MODERATOR';
    emailVerified?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare class User {
    readonly id: string;
    readonly nombres: string;
    readonly apellidos: string;
    readonly email: string;
    readonly password: string;
    readonly apodo: string;
    readonly avatar: string | null;
    readonly rol: 'PLAYER' | 'ADMIN' | 'MODERATOR';
    readonly emailVerified: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    constructor(props: UserProps);
    private validate;
    private isValidEmail;
    toPublic(): Omit<UserProps, 'password'>;
    toPersistence(): UserProps;
    static fromPersistence(data: UserProps): User;
}
//# sourceMappingURL=User.d.ts.map