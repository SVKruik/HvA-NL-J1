resource "azurerm_service_plan" "service_plan" {
  name                = var.backend_sp_name
  location            = azurerm_resource_group.resource_group.location
  resource_group_name = azurerm_resource_group.resource_group.name
  os_type             = "Linux"
  sku_name            = "S1"
}

resource "azurerm_linux_web_app" "web_app" {
  name                = var.backend_app_name
  location            = azurerm_resource_group.resource_group.location
  resource_group_name = azurerm_resource_group.resource_group.name
  service_plan_id     = azurerm_service_plan.service_plan.id

  identity {
    type = "SystemAssigned"
  }

  app_settings = {
    "WEBSITES_ENABLE_APP_SERVICE_STORAGE" = "false"
#     "DB_SERVER"                           = azurerm_mssql_server.mssql_server.fully_qualified_domain_name
#     "DB_NAME"                             = azurerm_mssql_database.mssql_database.name
#     "DB_USERNAME"                         = azurerm_mssql_server.mssql_server.administrator_login
#     "DB_PASSWORD"                         = azurerm_mssql_server.mssql_server.administrator_login_password
#     "DB_DRIVER"                           = "ODBC Driver 18 for SQL Server"
  }

  site_config {
    application_stack {
#       docker_image_name = var.backend_docker_image_name
            docker_image_name          = var.backend_docker_image_name
            docker_registry_url = var.docker_registry_url
            docker_registry_username = var.REGISTRY_BACKEND_USER
            docker_registry_password = var.REGISTRY_BACKEND_TOKEN
    }
  }
}


output "web_app_url" {
  value = azurerm_linux_web_app.web_app.default_hostname
}