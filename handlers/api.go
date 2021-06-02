package handlers

import (
	"statsnet/utils"

	"github.com/gofiber/fiber/v2"
)

type Status struct {
	Code int
	Msg  string
}

func LoginAPI(c *fiber.Ctx) error {
	err := utils.Login(c)
	if err != nil {
		return utils.SendJSON(c, Status{Code: 400, Msg: err.Error()})
	}

	return utils.SendJSON(c, Status{Code: 200, Msg: "Done"})
}

func RegisterAPI(c *fiber.Ctx) error {
	err := utils.Register(c)
	if err != nil {
		return utils.SendJSON(c, Status{Code: 400, Msg: err.Error()})
	}

	return utils.SendJSON(c, Status{Code: 200, Msg: "Done"})
}

func LogoutAPI(c *fiber.Ctx) error {
	utils.ClearAuthCookie(c)
	return utils.SendJSON(c, Status{Code: 200, Msg: "Done"})
}
