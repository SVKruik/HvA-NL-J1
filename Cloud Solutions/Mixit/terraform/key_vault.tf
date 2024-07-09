# data "azurerm_client_config" "current" {}
# data "azuread_client_config" "current_client" {}
#
# resource "azurerm_key_vault" "key_vault" {
#   name                        = var.KEY_VAULT_NAME
#   tenant_id = data.azurerm_client_config.current.tenant_id
#   location                    = azurerm_resource_group.resource_group.location
#   resource_group_name         = azurerm_resource_group.resource_group.name
#   sku_name                    = "standard"
#   soft_delete_retention_days = 7
#
#   access_policy {
#     tenant_id = data.azurerm_client_config.current.tenant_id
#     object_id = data.azuread_client_config.current_client.object_id
#     #object_id = azurerm_linux_web_app.web_app.identity[0].principal_id
#
#     secret_permissions = [
#       "GET",
#       "LIST",
#       "SET",
#       "DELETE",
#       "RECOVER",
#       "BACKUP",
#       "RESTORE"
#     ]
#   }
# }
#
# resource "azurerm_key_vault_secret" "client_id" {
#   name         = "CLIENT-ID"
#   value        = var.client_id
#   key_vault_id = azurerm_key_vault.key_vault.id
# }
#
# resource "azurerm_key_vault_secret" "client_secret" {
#   name         = "CLIENT-SECRET"
#   value        = var.client_secret
#   key_vault_id = azurerm_key_vault.key_vault.id
# }
#
# resource "azurerm_key_vault_secret" "authority" {
#   name         = "AUTHORITY"
#   value        = var.authority
#   key_vault_id = azurerm_key_vault.key_vault.id
# }
#
# resource "azurerm_key_vault_secret" "scopes" {
#   name         = "SCOPES"
#   value        = jsonencode(var.scopes)
#   key_vault_id = azurerm_key_vault.key_vault.id
# }
#
# resource "azurerm_key_vault_secret" "redirect_path" {
#   name         = "REDIRECT-PATH"
#   value        = var.redirect_path
#   key_vault_id = azurerm_key_vault.key_vault.id
# }
#
# resource "azurerm_key_vault_secret" "db_admin_password" {
#   name         = "DB-ADMIN-PASSWORD"
#   value        = var.dbAdminPassword
#   key_vault_id = azurerm_key_vault.key_vault.id
# }
#
# resource "azurerm_key_vault_secret" "db_admin_username" {
#   name         = "DB-ADMIN-USERNAME"
#   value        = var.dbAdminPassword
#   key_vault_id = azurerm_key_vault.key_vault.id
# }
