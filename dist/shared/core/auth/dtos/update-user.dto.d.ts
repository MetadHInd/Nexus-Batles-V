export declare class UpdateUserDto {
    userName?: string;
    userLastName?: string;
    userEmail?: string;
    userPhone?: string;
    role_idrole?: number;
    is_active?: boolean;
}
export declare class ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
}
