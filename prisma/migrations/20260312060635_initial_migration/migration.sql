-- CreateTable
CREATE TABLE "actions" (
    "id" SERIAL NOT NULL,
    "description" VARCHAR(255),
    "slug" VARCHAR(255),

    CONSTRAINT "actions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "module" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "description" VARCHAR(255),
    "module" VARCHAR(255),
    "uuid" UUID DEFAULT gen_random_uuid(),
    "slug" VARCHAR(255),

    CONSTRAINT "module_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(255),
    "name" VARCHAR(255),
    "description" VARCHAR(255),
    "is_active" BOOLEAN DEFAULT true,
    "action_id" INTEGER,
    "module_id" INTEGER,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role" (
    "idrole" SERIAL NOT NULL,
    "description" VARCHAR(255),
    "is_super" BOOLEAN DEFAULT false,
    "hierarchy_level" INTEGER,

    CONSTRAINT "role_pkey" PRIMARY KEY ("idrole")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "id" SERIAL NOT NULL,
    "role_id" INTEGER NOT NULL,
    "permission_id" INTEGER NOT NULL,
    "is_active" BOOLEAN DEFAULT true,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_permissions" (
    "id" SERIAL NOT NULL,
    "idsysuser" INTEGER NOT NULL,
    "id_permission" INTEGER NOT NULL,

    CONSTRAINT "user_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_status" (
    "id_user_status" SERIAL NOT NULL,
    "status_name" VARCHAR(255),

    CONSTRAINT "user_status_pkey" PRIMARY KEY ("id_user_status")
);

-- CreateTable
CREATE TABLE "sysUser" (
    "idsysUser" SERIAL NOT NULL,
    "role" INTEGER,
    "uuid" VARCHAR(255) DEFAULT gen_random_uuid(),
    "userEmail" VARCHAR(255),
    "userName" VARCHAR(255),
    "userLastName" VARCHAR(255),
    "userPhone" VARCHAR(50),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "sysuserstatus_idsysuserstatus" INTEGER,
    "userPassword" VARCHAR(255),
    "loggedbyfirsttime" BOOLEAN DEFAULT false,
    "is_active" BOOLEAN DEFAULT true,
    "activation_token" VARCHAR(255),
    "activation_expires" TIMESTAMP(6),
    "reset_password_token" VARCHAR(255),
    "reset_password_expires" TIMESTAMP(6),

    CONSTRAINT "sysuser_pkey" PRIMARY KEY ("idsysUser")
);

-- CreateIndex
CREATE INDEX "idx_permissions_action" ON "permissions"("action_id");

-- CreateIndex
CREATE INDEX "idx_permissions_module" ON "permissions"("module_id");

-- CreateIndex
CREATE INDEX "idx_roleperm_permission" ON "role_permissions"("permission_id");

-- CreateIndex
CREATE INDEX "idx_roleperm_role" ON "role_permissions"("role_id");

-- CreateIndex
CREATE INDEX "idx_userperm_permission" ON "user_permissions"("id_permission");

-- CreateIndex
CREATE INDEX "idx_userperm_user" ON "user_permissions"("idsysuser");

-- CreateIndex
CREATE INDEX "idx_sysuser_role" ON "sysUser"("role");

-- CreateIndex
CREATE INDEX "idx_sysuser_status" ON "sysUser"("sysuserstatus_idsysuserstatus");

-- AddForeignKey
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_action_id_fkey" FOREIGN KEY ("action_id") REFERENCES "actions"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "module"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("idrole") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_permissions" ADD CONSTRAINT "user_permissions_id_permission_fkey" FOREIGN KEY ("id_permission") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_permissions" ADD CONSTRAINT "user_permissions_idsysuser_fkey" FOREIGN KEY ("idsysuser") REFERENCES "sysUser"("idsysUser") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sysUser" ADD CONSTRAINT "sysuser_role_idrole_fkey" FOREIGN KEY ("role") REFERENCES "role"("idrole") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sysUser" ADD CONSTRAINT "sysuser_sysuserstatus_idsysuserstatus_fkey" FOREIGN KEY ("sysuserstatus_idsysuserstatus") REFERENCES "user_status"("id_user_status") ON DELETE SET NULL ON UPDATE NO ACTION;
