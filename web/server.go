package web

import (
	"context"
	"log/slog"
	"os"

	"veryinf/emulator/core"
	"veryinf/emulator/slave"
	"veryinf/emulator/web/common"
	"veryinf/emulator/web/controllers"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

var (
	apiPrefix = "/api"
)

// Server represents the web server
type Server struct {
	*echo.Echo
}

// NewServer creates a new web server with the given slave manager and config
func NewServer(slaveMgr *slave.Manager, config *core.Config) *Server {
	e := InitHttpServer(slaveMgr, config)
	return &Server{Echo: e}
}

// InitHttpServer initializes the HTTP server with the given slave manager and config
func InitHttpServer(slaveMgr *slave.Manager, config *core.Config) *echo.Echo {
	e := echo.New()
	e.Debug = true
	e.HideBanner = true
	e.HTTPErrorHandler = common.LeErrorHandler
	e.Use(common.LeMiddleware(common.LeMiddlewareConfig{}))
	e.Use(middleware.StaticWithConfig(middleware.StaticConfig{
		HTML5: true,
		Root:  "public",
	}))
	logger := slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
		ReplaceAttr: func(groups []string, a slog.Attr) slog.Attr {
			if a.Key == slog.TimeKey {
				return slog.String(a.Key, a.Value.Time().Format("06-01-02 15:04:05"))
			}
			return a
		},
	}))
	e.Use(middleware.RequestLoggerWithConfig(middleware.RequestLoggerConfig{
		LogStatus:   true,
		LogURI:      true,
		LogMethod:   true,
		HandleError: false,
		LogValuesFunc: func(c echo.Context, v middleware.RequestLoggerValues) error {
			logger.LogAttrs(context.Background(), slog.LevelInfo, "REQUEST",
				slog.String("method", v.Method),
				slog.String("uri", v.URI),
				slog.Int("status", v.Status),
			)
			return nil
		},
	}))

	//生产环境
	if !core.G.IsDevelopment() {
		e.Debug = false
		e.Use(middleware.Recover())
	}

	// 初始化基础控制器
	baseController := common.BaseHandler{}

	// API routes
	api := e.Group(apiPrefix)

	// Slave routes
	slaveHandler := &controllers.SlaveController{BaseHandler: baseController, SlaveManager: slaveMgr, Config: config}
	api.GET("/application", slaveHandler.GetApplication)
	api.GET("/slaves", slaveHandler.GetAllSlaves)
	api.GET("/slaves/:slaveId", slaveHandler.GetSlave)
	api.POST("/slaves/:slaveId/set-point", slaveHandler.SetPoint)
	api.GET("/slaves/:slaveId/subscribe", slaveHandler.Subscribe)

	return e
}

// Start starts the web server
func (s *Server) Start(addr string) error {
	return s.Echo.Start(addr)
}
