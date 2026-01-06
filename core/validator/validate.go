package validator

import (
	"errors"
	"log/slog"

	"github.com/go-ozzo/ozzo-validation/v4"
	"github.com/samber/lo"
)

type translationEntry struct {
	defaultMessage string
	message        string
}

var translations = map[string][]translationEntry{
	"validation_required": {
		{"cannot be blank", "不能为空"},
	},
	"validation_in_invalid": {
		{"must be a valid value", "必须是有效值"},
	},
	"validation_is_json": {
		{"must be in valid JSON format", "必须是有效的json格式"},
	},
}

func ValidationTranslate(err error) validation.Errors {
	var vErrors validation.Errors
	if errors.As(err, &vErrors) {
		for key, vErr := range vErrors {
			var vError validation.ErrorObject
			if errors.As(vErr, &vError) {
				translationEntries, ok := translations[vError.Code()]
				if ok {
					tEntry, find := lo.Find(translationEntries, func(entry translationEntry) bool { return entry.defaultMessage == vError.Error() })
					if find {
						vErrors[key] = validation.NewError(vError.Code(), tEntry.message)
					} else {
						slog.Warn("no translation for code: " + vError.Code() + " message: " + vError.Error())
					}
				} else {
					slog.Warn("no translation for code: " + vError.Code())
				}
			}
		}
		return vErrors
	}
	return nil
}
