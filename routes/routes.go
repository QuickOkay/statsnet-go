package routes

import (
	"statsnet/handlers"

	"github.com/gofiber/fiber/v2"
)

func RoutesInit(app *fiber.App) {
	app.Static("/", "./public")

	web := app.Group("/")
	web.Get("/", handlers.HomePage)
	web.Get("/login", handlers.LoginPage)
	web.Get("/register", handlers.RegisterPage)
	web.Get("/me", handlers.PersonalPage)

	api := app.Group("/api")
	api.Post("/login", handlers.LoginAPI)
	api.Post("/register", handlers.RegisterAPI)
	api.Post("/logout", handlers.LogoutAPI)
}
