package mcpmock

//go:generate mockgen -destination ./mcpmock.go -package mcpmock github.com/coder/coder/v2/aibridge/mcp ServerProxier
