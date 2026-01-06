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

func (g *global) PrintWelcome() {
	println("Welcome to Link Engine")
	println("Build Env: ", lo.If(g.IsDevelopment(), "development").Else("production"))
}
