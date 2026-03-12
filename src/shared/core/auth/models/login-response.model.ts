import { ApiProperty } from '@nestjs/swagger';

export interface TenantInfo {
  tenant_sub: string;
  slug: string;
  name: string;
  is_default: boolean;
}

export class LoginResponseModel {
  @ApiProperty({
    description: 'JWT token de autenticación',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  token: string;

  @ApiProperty({
    description: 'Información del usuario autenticado',
    example: {
      uuid: '550e8400-e29b-41d4-a716-446655440000',
      email: 'user@example.com',
      userName: 'John',
      userLastName: 'Doe'
    }
  })
  user: {
    uuid: string;
    email: string;
    userName: string;
    userLastName: string;
    idsysUser: number;
  };

  @ApiProperty({
    description: 'Lista de tenants disponibles para el usuario (multitenancy deshabilitado)',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        tenant_sub: { type: 'string' },
        slug: { type: 'string' },
        name: { type: 'string' },
        is_default: { type: 'boolean' }
      }
    },
    required: false
  })
  tenants?: TenantInfo[];

  @ApiProperty({
    description: 'Tenant predeterminado del usuario (multitenancy deshabilitado)',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false
  })
  defaultTenant?: string;

  constructor(
    token: string,
    user: {
      uuid: string;
      email: string;
      userName: string;
      userLastName: string;
      idsysUser: number;
    },
    tenants?: TenantInfo[], 
    defaultTenant?: string
  ) {
    this.token = token;
    this.user = user;
    if (tenants && tenants.length > 0) {
      this.tenants = tenants;
    }
    if (defaultTenant) {
      this.defaultTenant = defaultTenant;
    }
  }
}
