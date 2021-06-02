package utils

import (
	"crypto/rand"
	"encoding/json"
	"fmt"
	"regexp"

	"github.com/gofiber/fiber/v2"
)

var emailRegex = regexp.MustCompile("^[a-zA-Z0-9.!#$%&'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")

func GenerateToken() string {
	token := make([]byte, 16)
	rand.Read(token)
	return fmt.Sprintf("%x", token)
}

func SendJSON(c *fiber.Ctx, res interface{}) error {
	return json.NewEncoder(c.Type("json", "utf-8").Response().BodyWriter()).Encode(res)
}

func IsEmail(email string) bool {
	if len(email) < 3 && len(email) > 254 {
		return false
	}
	return emailRegex.MatchString(email)
}
