variable "rg_name" {
  description = "The name of the resource group"
  type        = string
  default     = "mixit-resources"
}

variable "location" {
  description = "The location of the resources"
  type        = string
  default     = "westeurope"
}

variable "db_name" {
  description = "The name of the database"
  type        = string
  default     = "mixit-db"
}

variable "db_server_name" {
  description = "The name of the database server"
  type        = string
  default     = "mixit-db-server"
}
variable "backend_sp_name" {
  description = "The name of the backend service plan"
  type        = string
  default     = "mixit-service-plan"
}

variable "backend_app_name" {
  description = "The name of the backend app"
  type = string
  #   default     = "mixit-backend"
  default     = "mixit-backend-01"
}

variable "backend_docker_image_name" {
  description = "The name of the backend docker image"
  type        = string
  default     = ""
}

variable "docker_registry_url" {
  description = "The URL of the docker registry"
  type        = string
  default     = ""
}

variable "frontend_storage_account_name" {
  description = "The name of the frontend service plan"
  type        = string
  default     = "vuestorageaccount"
}

variable "client_id" {
  description = "Client ID for the backend"
  type        = string
  default     = ""
}

variable "client_secret" {
  description = "Client Secret for the backend"
  type        = string
  default     = ""
}

variable "authority" {
  description = "Authority URL for authentication"
  type        = string
  default     = ""
}

variable "scopes" {
  description = "Scopes for the application"
  type = list(string)
  default = ["https://graph.microsoft.com/.default"]
}

variable "redirect_path" {
  description = "Redirect path for the application"
  type        = string
  default     = "/getAToken"
}


variable "dbAdminUsername" {
  description = "Username for Database"
  type        = string
  default     = "quentin"
}

variable "dbAdminPassword" {
  description = "Password for Database"
  type        = string
  default     = ""
}

variable "prefix" {
  default = ""
}

variable REGISTRY_BACKEND_USER {}

variable REGISTRY_BACKEND_TOKEN {}

variable "REGISTRY_URL" {}

variable "KEY_VAULT_NAME" {}
