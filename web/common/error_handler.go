package common

import (
	"encoding/json"
	"errors"
	"fmt"

	"github.com/labstack/echo/v4"
	"veryinf/emulator/core"
	"veryinf/emulator/core/validator"
)

func LeErrorHandler(err error, c echo.Context) {
	var he *echo.HTTPError
	if errors.As(err, &he) {
		var te *json.UnmarshalTypeError
		if errors.As(err, &te) {
			_ = c.JSON(200, core.NewResponse(-12, fmt.Sprintf("请求参数错误, 请检查: %s", he.Message)))
			return
		} else {
			_ = c.JSON(200, core.NewResponse(he.Code, fmt.Sprintf("%s", he.Message)))
			return
		}
	}
	ve := validator.ValidationTranslate(err)
	if ve != nil {
		_ = c.JSON(200, core.NewResponse(-11, fmt.Sprintf("%s", ve)))
		return
	}
	_ = c.JSON(200, err)
}
