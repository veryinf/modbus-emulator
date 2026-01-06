package common

import (
	"github.com/labstack/echo/v4"
)

type LeContext struct {
	echo.Context
}

type LeMiddlewareConfig struct {
	IgnorePaths []string
}

func LeMiddleware(config LeMiddlewareConfig) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			cc := &LeContext{Context: c}
			// 由于当前项目不需要认证，简化中间件实现
			return next(cc)
		}
	}
}
