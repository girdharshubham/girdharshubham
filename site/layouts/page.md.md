---
title: {{ .Title | jsonify }}
date: {{ .Date.Format "2006-01-02" }}
author: {{ site.Title }}
url: {{ .Permalink }}
{{- with .Description }}
description: {{ . | jsonify }}
{{- end }}
---

# {{ .Title }}

{{ .RawContent | strings.TrimSpace }}
