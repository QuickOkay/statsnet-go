package main

import (
	"statsnet/database"
	"statsnet/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/template/html"
)

func main() {
	// Engine Init
	engine := html.New("views", ".html")

	// Fiber App Init
	app := fiber.New(fiber.Config{
		Views: engine,
	})

	// Database Init
	database.DBClient = database.DBInit()

	// Routes Init
	routes.RoutesInit(app)

	app.Listen(":3000")
}
