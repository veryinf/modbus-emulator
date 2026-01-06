package common

import (
	"github.com/labstack/echo/v4"
	"veryinf/emulator/core"
)

type BaseHandler struct {
}

func (h *BaseHandler) Context(c echo.Context) *LeContext {
	return c.(*LeContext)
}

func (h *BaseHandler) Success() *core.ResponseStruct {
	return h.Error(0, "ok")
}

func (h *BaseHandler) Error(code int, msg string) *core.ResponseStruct {
	return &core.ResponseStruct{
		ErrCode: code,
		ErrMsg:  msg,
	}
}

func (h *BaseHandler) GetToken(c echo.Context) string {
	authorization := c.Request().Header.Get("Authorization")
	if authorization == "" {
		return ""
	}
	return authorization[7:]
}
