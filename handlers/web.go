package handlers

import "github.com/gofiber/fiber/v2"

func HomePage(c *fiber.Ctx) error {
	return c.Render("home", fiber.Map{})
}

func LoginPage(c *fiber.Ctx) error {
	return c.Render("login", fiber.Map{})
}

func RegisterPage(c *fiber.Ctx) error {
	return c.Render("register", fiber.Map{})
}

func PersonalPage(c *fiber.Ctx) error {
	return c.Render("personal", fiber.Map{})
}
