// Script para arreglar las relaciones de Prisma
const fs = require('fs');
const path = require('path');

// Leer el schema actual
const schemaPath = path.join(__dirname, 'schema.prisma');
let schemaContent = fs.readFileSync(schemaPath, 'utf8');

console.log('🔧 Arreglando relaciones bidireccionales en schema.prisma...');

// Función para encontrar y reemplazar el modelo operator_application
function fixOperatorApplication(content) {
  const operatorApplicationRegex = /model operator_application \{[\s\S]*?\}/g;
  const fixedOperatorApplication = `model operator_application {
  id                     String                     @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  rule_id                Int?
  operator_id            Int?
  application_type_id    Int?
  value                  Int?
  is_active              Boolean?                   @default(true)
  created_at             DateTime?                  @default(now()) @db.Timestamp(6)
  updated_at             DateTime?                  @default(now()) @db.Timestamp(6)
  node_position          String?                    @db.VarChar
  category_has_menu_id   Int?
  is_mandatory           Boolean?                   @default(true)
  
  // Relaciones existentes
  operator_application_type operator_application_type? @relation(fields: [application_type_id], references: [id], onDelete: NoAction, onUpdate: NoAction)
  category_has_menu         category_has_menu?         @relation(fields: [category_has_menu_id], references: [id], onDelete: NoAction, onUpdate: NoAction, map: "operator_application_category_has_menu_fk")
  rule_operator             rule_operator?             @relation(fields: [operator_id], references: [id], onDelete: Cascade, onUpdate: NoAction)
  
  // Relaciones arregladas con rule_connector
  source_connectors         rule_connector[]           @relation("rule_connector_source_operator")
  target_connectors         rule_connector[]           @relation("rule_connector_target_operator")

  @@index([operator_id], map: "idx_operator_application_operator_id")
  @@index([rule_id], map: "idx_operator_application_rule_id")
}`;
  
  return content.replace(operatorApplicationRegex, fixedOperatorApplication);
}

// Función para encontrar y reemplazar el modelo rule_assignment
function fixRuleAssignment(content) {
  const ruleAssignmentRegex = /model rule_assignment \{[\s\S]*?\}/g;
  const fixedRuleAssignment = `model rule_assignment {
  id                    String                @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  assignment_type_id    Int?
  item_type_id          Int?
  category_has_menu_id  Int?
  category_variation_id Int?
  is_active             Boolean?              @default(true)
  created_at            DateTime?             @default(now()) @db.Timestamp(6)
  updated_at            DateTime?             @default(now()) @db.Timestamp(6)
  node_position         String                @db.VarChar
  
  // Relaciones existentes
  rule_assignment_type  rule_assignment_type? @relation(fields: [assignment_type_id], references: [id], onDelete: NoAction, onUpdate: NoAction)
  category_has_menu     category_has_menu?    @relation(fields: [category_has_menu_id], references: [id], onDelete: NoAction, onUpdate: NoAction)
  category_variation    category_variation?   @relation(fields: [category_variation_id], references: [id], onDelete: NoAction, onUpdate: NoAction)
  item_type             item_type?            @relation(fields: [item_type_id], references: [id_item_type], onDelete: NoAction, onUpdate: NoAction)
  
  // Relaciones arregladas con rule_connector
  source_connectors     rule_connector[]      @relation("rule_connector_source_assignment")
  target_connectors     rule_connector[]      @relation("rule_connector_target_assignment")

  @@index([category_has_menu_id], map: "idx_rule_assignment_category_menu")
  @@index([category_variation_id], map: "idx_rule_assignment_category_variation")
  @@index([item_type_id], map: "idx_rule_assignment_item_type")
  @@index([assignment_type_id], map: "idx_rule_assignment_type_id")
}`;
  
  return content.replace(ruleAssignmentRegex, fixedRuleAssignment);
}

// Función para encontrar y reemplazar el modelo rule_connector
function fixRuleConnector(content) {
  const ruleConnectorRegex = /model rule_connector \{[\s\S]*?\}/g;
  const fixedRuleConnector = `model rule_connector {
  id               String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  source_node_id   String? @db.Uuid
  source_node_type String  @db.VarChar(20)
  target_node_id   String? @db.Uuid
  target_node_type String  @db.VarChar(20)
  created_at       DateTime? @default(now()) @db.Timestamp(6)
  updated_at       DateTime? @default(now()) @db.Timestamp(6)
  
  // Relaciones bidireccionales arregladas
  source_assignment           rule_assignment?      @relation("rule_connector_source_assignment", fields: [source_node_id], references: [id], onDelete: Cascade, onUpdate: NoAction, map: "fk_source_assignment")
  source_operator_application operator_application? @relation("rule_connector_source_operator", fields: [source_node_id], references: [id], onDelete: Cascade, onUpdate: NoAction, map: "fk_source_operator")
  target_assignment           rule_assignment?      @relation("rule_connector_target_assignment", fields: [target_node_id], references: [id], onDelete: Cascade, onUpdate: NoAction, map: "fk_target_assignment")
  target_operator_application operator_application? @relation("rule_connector_target_operator", fields: [target_node_id], references: [id], onDelete: Cascade, onUpdate: NoAction, map: "fk_target_operator")

  @@index([source_node_id, source_node_type], map: "idx_rule_connector_source")
  @@index([target_node_id, target_node_type], map: "idx_rule_connector_target")
}`;
  
  return content.replace(ruleConnectorRegex, fixedRuleConnector);
}

try {
  // Aplicar todas las correcciones
  let fixedContent = schemaContent;
  fixedContent = fixOperatorApplication(fixedContent);
  fixedContent = fixRuleAssignment(fixedContent);
  fixedContent = fixRuleConnector(fixedContent);
  
  // Crear backup del archivo original
  fs.writeFileSync(schemaPath + '.backup', schemaContent);
  console.log('📋 Backup creado: schema.prisma.backup');
  
  // Escribir el archivo corregido
  fs.writeFileSync(schemaPath, fixedContent);
  console.log('✅ Schema corregido exitosamente!');
  
  console.log('\n🚀 Ahora puedes ejecutar:');
  console.log('npm run db:pull');
  
} catch (error) {
  console.error('❌ Error al arreglar el schema:', error.message);
}