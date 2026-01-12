package slave

import (
	"fmt"
	"log"
	"log/slog"
	"sync"

	"veryinf/emulator/core"

	"github.com/panjf2000/gnet/v2"
	"github.com/samber/lo"
	"github.com/veryinf/modbus-kit/common"
	"github.com/veryinf/modbus-kit/slave"
)

type DeviceInstance struct {
	Config *core.DeviceConfig
	Slave  *slave.ModbusSlave
}

// Manager manages Modbus slave devices
type Manager struct {
	devices          map[uint8]*DeviceInstance
	mu               sync.RWMutex
	netServer        *common.NetServer
	listeningAddress string
}

// NewManager creates a new slave manager
func NewManager() *Manager {
	return &Manager{
		devices:   make(map[uint8]*DeviceInstance),
		netServer: common.NewNetServer(),
	}
}

// StartListening sets the Modbus TCP server listening address
func (m *Manager) StartListening(address string) {
	m.listeningAddress = address
	go func() {
		log.Printf("Starting TCP server on %s for all Modbus devices", address)
		// Use gnet.Run to start the server with tcp:// protocol
		if err := gnet.Run(m.netServer, "tcp://"+address); err != nil {
			// Log error with details
			log.Printf("Failed to start TCP server on %s: %v", address, err)
		}
	}()
}

func (m *Manager) GetAddress() string {
	return m.listeningAddress
}

func (m *Manager) AddDevice(config *core.DeviceConfig) {
	deviceInfo := &slave.DeviceInfo{
		Title: config.Title,
		Identification: &common.DeviceIdentification{
			VendorName:     "Veryinf Inc.",
			ProductCode:    "Modbus-Emulator-001",
			ProductName:    fmt.Sprintf("ME %s %d", lo.Ternary(config.Protocol == core.ProtocolTypeRTUOverTCP, "RTU", "TCP"), config.SlaveID),
			ProductVersion: "1.0.0",
			VendorUrl:      "https://github.com/veryinf/modbus-emulator",
		},
	}
	store := config.ToStore()
	var slaveDevice *slave.ModbusSlave
	if config.Protocol == core.ProtocolTypeTCP {
		slaveDevice = slave.NewModbusTCPSlave(config.SlaveID, deviceInfo, store)
	} else if config.Protocol == core.ProtocolTypeRTUOverTCP {
		slaveDevice = slave.NewModbusRTUOverTCPSlave(config.SlaveID, deviceInfo, store)
	} else {
		slog.Error("Invalid protocol", "protocol", config.Protocol)
		panic("Invalid protocol")
	}
	m.mu.Lock()
	m.devices[config.SlaveID] = &DeviceInstance{
		Config: config,
		Slave:  slaveDevice,
	}
	m.mu.Unlock()
	m.netServer.Enroll(&slaveDevice.ModbusDevice)
}

// GetDevice returns a device instance by ID
func (m *Manager) GetDevice(id uint8) (*DeviceInstance, bool) {
	m.mu.RLock()
	defer m.mu.RUnlock()
	device, exists := m.devices[id]
	return device, exists
}

// ListDevices returns all device instances
func (m *Manager) ListDevices() []*DeviceInstance {
	m.mu.RLock()
	defer m.mu.RUnlock()
	var devices []*DeviceInstance
	for _, device := range m.devices {
		devices = append(devices, device)
	}
	return devices
}
