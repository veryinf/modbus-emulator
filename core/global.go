package core

import (
	"github.com/samber/lo"
)

type global struct {
}

var (
	buildEnv     string
	buildTime    string
	buildVersion string
)

var G = global{}

func (g *global) IsDevelopment() bool {
	return buildEnv == "development" || buildEnv == "dev"
}

func (g *global) BuildVersion() string {
	return buildVersion
}

func (g *global) PrintWelcome() {
	println("Welcome to Modbus Emulator")
	println("Build Env: ", lo.If(g.IsDevelopment(), "development").Else("production"))
	println("Version: ", buildVersion)
	println("Build Date: ", buildTime)
}
