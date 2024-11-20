provider "grafana" {
  url  = var.grafana_url
  auth = var.grafana_service_account_key
}

resource "grafana_folder" "test_folder" {
  title = "prod - shubham's app"
}

resource "grafana_dashboard" "dashboards" {
  for_each    = fileset("${path.module}/models", "*.json")
  config_json = file("${path.module}/models/${each.key}")

  depends_on = [
    grafana_folder.test_folder
  ]
}