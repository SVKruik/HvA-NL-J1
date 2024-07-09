locals {
  mime_types = {
    ".html" = "text/html"
    ".css"  = "text/css"
    ".js"   = "application/javascript"
    ".json" = "application/json"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".gif"  = "image/gif"
    ".svg"  = "image/svg+xml"
  }
}

resource "azurerm_storage_account" "frontend_storage_account" {
  name                     = var.frontend_storage_account_name
  resource_group_name      = azurerm_resource_group.resource_group.name
  location                 = azurerm_resource_group.resource_group.location
  account_tier             = "Standard"
#   account_kind             = "StorageV2"
  account_replication_type = "LRS"

  tags = {
    environment = "production"
  }

  static_website {
    index_document = "index.html"
  }
}

resource "azurerm_storage_blob" "vue_storage_blob" {
  for_each               = fileset("../frontend/dist", "**/*")
  name                   = each.value
  storage_account_name   = azurerm_storage_account.frontend_storage_account.name
  storage_container_name = "$web"
  type                   = "Block"
  source                 = "../frontend/dist/${each.value}"

  content_type = lookup(local.mime_types, regex("\\.[^.]+$", each.value), null)
}

output "endpoint" {
  value = azurerm_storage_account.frontend_storage_account.primary_web_endpoint
}
