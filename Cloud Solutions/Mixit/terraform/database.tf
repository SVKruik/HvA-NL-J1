# resource "azurerm_mssql_server" "mssql_server" {
#   name                         = var.db_server_name
#   resource_group_name          = azurerm_resource_group.resource_group.name
#   location                     = azurerm_resource_group.resource_group.location
#   version                      = "12.0"
#   administrator_login          = var.dbAdminUsername
#   administrator_login_password = var.dbAdminPassword
# }
#
# resource "azurerm_mssql_database" "mssql_database" {
#   name                         = var.db_name
#   server_id                    = azurerm_mssql_server.mssql_server.id
#   sku_name                     = "GP_S_Gen5_2"
#   min_capacity                 = 0.5
#   max_size_gb                  = 2
#   auto_pause_delay_in_minutes  = 60
# }
#
# resource "azurerm_mssql_firewall_rule" "allow_all" {
#   name             = "allow-all"
#   server_id        = azurerm_mssql_server.mssql_server.id
#   start_ip_address = "0.0.0.0"
#   end_ip_address   = "255.255.255.255"
# }