package core

import (
	"encoding/json"
	"io"
	"os"

	"github.com/veryinf/modbus-kit/slave"
)

type ProtocolType string

const (
	ProtocolTypeTCP        ProtocolType = "tcp"
	ProtocolTypeRTUOverTCP ProtocolType = "rtu-over-tcp"
)

// UIConfig represents the UI configuration in the config file
type UIConfig struct {
	Host          string `json:"host"`
	Port          int    `json:"port"`
	Email         string `json:"email"`
	Phone         string `json:"phone"`
	Address       string `json:"address"`
	WorkingHours  string `json:"workingHours"`
	Website       string `json:"website"`
}

// Config represents the application configuration
type Config struct {
	UI      UIConfig       `json:"ui"`
	Devices []DeviceConfig `json:"devices"`
}

// DeviceConfig represents a device configuration in the config file
type DeviceConfig struct {
	SlaveID     uint8        `json:"slaveId"`
	Protocol    ProtocolType `json:"protocol"` // "tcp" or "rtu-over-tcp"
	Title       string       `json:"title"`
	Description string       `json:"description,omitempty"`
	Points      *PointConfig `json:"points,omitempty"`
}

func (c *DeviceConfig) ToStore() *slave.MemoryDataStore {
	store := slave.NewMemoryDataStore()

	if c.Points != nil {
		// Set coils
		for addr, value := range c.Points.Coils {
			var uintValue uint16
			if value {
				uintValue = 1
			} else {
				uintValue = 0
			}
			store.Write(slave.PointTypeCoil, addr, uintValue)
		}

		// Set discrete inputs
		for addr, value := range c.Points.DiscreteInputs {
			var uintValue uint16
			if value {
				uintValue = 1
			} else {
				uintValue = 0
			}
			store.Write(slave.PointTypeDiscreteInput, addr, uintValue)
		}

		// Set input registers
		for addr, value := range c.Points.InputRegisters {
			store.Write(slave.PointTypeInputRegister, addr, value)
		}

		// Set holding registers
		for addr, value := range c.Points.HoldingRegisters {
			store.Write(slave.PointTypeHoldingRegister, addr, value)
		}
	}

	return store
}

// PointConfig represents the pre-defined point data for a device
type PointConfig struct {
	Coils            map[uint16]bool   `json:"coils,omitempty"`
	DiscreteInputs   map[uint16]bool   `json:"discreteInputs,omitempty"`
	InputRegisters   map[uint16]uint16 `json:"inputRegisters,omitempty"`
	HoldingRegisters map[uint16]uint16 `json:"holdingRegisters,omitempty"`
}

// NewConfigFromFile loads the configuration from the specified file path
func NewConfigFromFile(configPath string) (*Config, error) {
	// Check if config file exists, if not return empty config
	if _, err := os.Stat(configPath); os.IsNotExist(err) {
		return &Config{Devices: []DeviceConfig{}}, nil
	}

	// Open config file
	file, err := os.Open(configPath)
	if err != nil {
		return nil, err
	}
	defer func(file *os.File) {
		err := file.Close()
		if err != nil {

		}
	}(file)

	// Read file content
	content, err := io.ReadAll(file)
	if err != nil {
		return nil, err
	}

	// Parse JSON
	var config Config
	if err := json.Unmarshal(content, &config); err != nil {
		return nil, err
	}

	return &config, nil
}
