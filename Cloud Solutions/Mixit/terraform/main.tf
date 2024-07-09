terraform {
  backend "http" {}
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "resource_group" {
  name     = var.rg_name
  location = var.location
}

output "pipeline_variable_test" {
  value = var.REGISTRY_URL
}
