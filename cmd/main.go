package main

import (
	"context"
	"log"
	"log/slog"
	"os"

	"veryinf/emulator/core"
	"veryinf/emulator/slave"
	"veryinf/emulator/web"

	"github.com/labstack/echo/v4"
	"github.com/urfave/cli/v3"
)

// Config holds the application configuration
type Config struct {
	HTTPAddr   string
	ModbusAddr string
	ConfigPath string
}

// runApp runs the main application logic
func runApp(ctx context.Context, cfg Config) error {
	// Initialize slave manager
	slaveMgr := slave.NewManager()
	// Load devices from configuration
	config, err := core.NewConfigFromFile(cfg.ConfigPath)
	if err != nil {
		slog.Error("Failed to load configuration", "error", err)
		panic(err)
	}
	for _, device := range config.Devices {
		slaveMgr.AddDevice(&device)
	}
	// Set Modbus TCP server listening address
	slaveMgr.StartListening(cfg.ModbusAddr)

	// Create and start web server with injected slave manager and config
	webServer := web.InitHttpServer(slaveMgr, config)
	defer func(webServer *echo.Echo) {
		_ = webServer.Close()
	}(webServer)
	err = webServer.Start(cfg.HTTPAddr)
	if err != nil {
		panic(err)
	}
	return nil
}

func init() {
	cli.VersionPrinter = func(c *cli.Command) {
		core.G.PrintWelcome()
	}
}

func main() {
	app := &cli.Command{
		Name:    "modbus-emulator",
		Usage:   "A high-performance, web-based Modbus slave device emulator",
		Version: core.G.BuildVersion(),
		Flags: []cli.Flag{
			&cli.StringFlag{
				Name:    "http-addr",
				Value:   ":4000",
				Usage:   "specify the HTTP server address",
				Sources: cli.EnvVars("HTTP_ADDR"),
			},
			&cli.StringFlag{
				Name:    "modbus-addr",
				Value:   ":502",
				Usage:   "specify the Modbus TCP server address",
				Sources: cli.EnvVars("MODBUS_ADDR"),
			},
			&cli.StringFlag{
				Name:    "config",
				Value:   "config.json",
				Usage:   "specify the device configuration file path",
				Sources: cli.EnvVars("CONFIG_FILE"),
			},
		},
		Action: func(ctx context.Context, cmd *cli.Command) error {
			// Create config from command line flags
			cfg := Config{
				HTTPAddr:   cmd.String("http-addr"),
				ModbusAddr: cmd.String("modbus-addr"),
				ConfigPath: cmd.String("config"),
			}

			// Run the main application
			return runApp(ctx, cfg)
		},
	}

	if err := app.Run(context.Background(), os.Args); err != nil {
		log.Fatalf("Failed to run application: %v", err)
	}
}
