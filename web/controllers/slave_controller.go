package controllers

import (
	"encoding/json"
	"log/slog"
	"strconv"

	"github.com/go-ozzo/ozzo-validation/v4"
	"github.com/labstack/echo/v4"
	"github.com/samber/lo"
	modbusSlave "github.com/veryinf/modbus-kit/slave"
	"veryinf/emulator/core"
	"veryinf/emulator/slave"
	"veryinf/emulator/web/common"
)

// SlaveController handles slave-related API requests
type SlaveController struct {
	common.BaseHandler
	SlaveManager *slave.Manager
}

type PointValue struct {
	Type    string `json:"type"`
	Address uint16 `json:"address"`
	Value   uint16 `json:"value"`
}

// GetAllSlaves handles getting all slaves
func (h *SlaveController) GetAllSlaves(ctx echo.Context) error {
	devices := h.SlaveManager.ListDevices()
	ds := lo.Map(devices, func(device *slave.DeviceInstance, index int) map[string]any {
		return map[string]any{
			"slaveId":  device.Config.SlaveID,
			"title":    device.Config.Title,
			"protocol": string(device.Config.Protocol),
		}
	})

	return core.NewDataSet(ds, int64(len(ds)))
}

// GetSlave handles getting a specific slave
func (h *SlaveController) GetSlave(ctx echo.Context) error {
	// Validate slaveId parameter
	id := ctx.Param("slaveId")
	slaveID, err := strconv.ParseUint(id, 10, 8)
	if err != nil {
		return h.Error(-11, "Invalid slave ID")
	}
	// Check if slave exists
	device, exists := h.SlaveManager.GetDevice(uint8(slaveID))
	if !exists {
		return h.Error(404, "Slave not found")
	}
	points := lo.Map(device.Slave.Store.GetAllPoints(), func(point modbusSlave.Point, index int) PointValue {
		return PointValue{
			Type:    string(point.Type),
			Address: point.Address,
			Value:   point.Value,
		}
	})
	ret := map[string]any{
		"slaveId":  device.Config.SlaveID,
		"title":    device.Config.Title,
		"protocol": string(device.Config.Protocol),
		"points": map[string]any{
			"coils": lo.Filter(points, func(point PointValue, index int) bool { return point.Type == string(modbusSlave.PointTypeCoil) }),
			"discreteInputs": lo.Filter(points, func(point PointValue, index int) bool {
				return point.Type == string(modbusSlave.PointTypeDiscreteInput)
			}),
			"holdingRegisters": lo.Filter(points, func(point PointValue, index int) bool {
				return point.Type == string(modbusSlave.PointTypeHoldingRegister)
			}),
			"inputRegisters": lo.Filter(points, func(point PointValue, index int) bool {
				return point.Type == string(modbusSlave.PointTypeInputRegister)
			}),
		},
	}

	return core.NewData(ret)
}

// SetPoint handles setting a single point
func (h *SlaveController) SetPoint(ctx echo.Context) error {
	// Validate slaveId parameter
	id := ctx.Param("slaveId")
	slaveID, err := strconv.ParseUint(id, 10, 8)
	if err != nil {
		return h.Error(-11, "Invalid slave ID")
	}
	// Check if slave exists
	device, exists := h.SlaveManager.GetDevice(uint8(slaveID))
	if !exists {
		return h.Error(404, "Slave not found")
	}
	input := &struct {
		Type    string `json:"type"` // coils, discreteInputs, holdingRegisters, inputRegisters
		Address uint16 `json:"address"`
		Value   uint16 `json:"value"`
	}{}
	if err := ctx.Bind(input); err != nil {
		return err
	}
	if err := validation.ValidateStruct(input,
		validation.Field(&input.Type, validation.Required, validation.In(string(modbusSlave.PointTypeCoil), string(modbusSlave.PointTypeDiscreteInput), string(modbusSlave.PointTypeHoldingRegister), string(modbusSlave.PointTypeInputRegister))),
		validation.Field(&input.Address),
		validation.Field(&input.Value),
	); err != nil {
		return err
	}
	device.Slave.Store.Write(modbusSlave.PointType(input.Type), input.Address, input.Value)
	return h.Success()
}

// Subscribe handles subscribing to point change events via SSE
func (h *SlaveController) Subscribe(ctx echo.Context) error {
	// Validate slaveId parameter
	id := ctx.Param("slaveId")
	slaveID, err := strconv.ParseUint(id, 10, 8)
	if err != nil {
		return h.Error(-11, "Invalid slave ID")
	}
	// Check if slave exists
	device, exists := h.SlaveManager.GetDevice(uint8(slaveID))
	if !exists {
		return h.Error(404, "Slave not found")
	}

	// Set SSE headers
	ctx.Response().Header().Set(echo.HeaderContentType, "text/event-stream")
	ctx.Response().Header().Set("Cache-Control", "no-cache")
	ctx.Response().Header().Set("Connection", "keep-alive")
	ctx.Response().Header().Set("Access-Control-Allow-Origin", "*")

	// Flush headers immediately
	if flusher, ok := ctx.Response().Writer.(interface{ Flush() }); ok {
		flusher.Flush()
	}

	// Create a channel to signal when the client disconnects
	done := make(chan struct{})
	defer close(done)

	// Create a unique callback ID to manage the callback lifecycle
	// Add callback to listen for write events
	callback := func(event modbusSlave.Point) {
		select {
		case <-done:
			return
		default:
			// Create JSON response
			message := PointValue{string(event.Type), event.Address, event.Value}

			// Marshal to JSON
			if jsonData, err := json.Marshal(message); err == nil {
				if _, err := ctx.Response().Write([]byte("data: " + string(jsonData) + "\n\n")); err != nil {
					slog.Error("Failed to write SSE event", "error", err)
					return
				}
			}
			// Send SSE event with proper format
			if flusher, ok := ctx.Response().Writer.(interface{ Flush() }); ok {
				flusher.Flush()
			}
		}
	}

	// Add the callback to the store
	device.Slave.Store.AddWriteEventCallback(callback)

	// Send initial keepalive
	if _, err := ctx.Response().Write([]byte("data: {\"type\":\"keepalive\"}\n\n")); err != nil {
		slog.Error("Failed to send initial keepalive", "error", err)
		return err
	}
	if flusher, ok := ctx.Response().Writer.(interface{ Flush() }); ok {
		flusher.Flush()
	}

	// Wait for client to disconnect
	<-ctx.Request().Context().Done()
	device.Slave.Store.RemoveWriteEventCallback(callback)
	return nil
}
