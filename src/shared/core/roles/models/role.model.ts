export class RoleModel {
  idrole: number;
  description?: string;

  constructor(data: Partial<RoleModel>) {
    Object.assign(this, data);
  }

  static fromEntity(entity: any): RoleModel {
    return new RoleModel({
      idrole: entity.idrole,
      description: entity.description,
    });
  }

  toEntity(): any {
    return {
      idrole: this.idrole,
      description: this.description,
    };
  }
}
