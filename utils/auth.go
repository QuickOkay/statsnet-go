package utils

import (
	"context"
	"fmt"
	"statsnet/database"
	"statsnet/models"
	"time"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
)

func Login(c *fiber.Ctx) error {
	var body map[string]interface{}
	var user *models.User

	if err := c.BodyParser(&body); err != nil {
		return fmt.Errorf("empty_body_error")
	}

	var email, emailOk = body["email"].(string)
	var password, passOk = body["password"].(string)

	if !emailOk || !passOk {
		return fmt.Errorf("email_or_password_invalid")
	}

	if !IsEmail(email) {
		return fmt.Errorf("email_invalid")
	}

	res := database.GetCollection("users").FindOne(context.TODO(), bson.M{"email": email})
	if res.Err() != nil {
		return fmt.Errorf("no_result")
	}

	decodeError := res.Decode(&user)
	if decodeError != nil {
		return decodeError
	}

	if user == nil {
		return fmt.Errorf("email_or_password_invalid")
	}

	if password != user.Password {
		return fmt.Errorf("email_or_password_invalid")
	}

	token := GenerateToken()
	_, err := database.GetCollection("users").UpdateOne(
		context.TODO(),
		bson.M{"email": email},
		bson.D{
			{"$set", bson.D{{"token", token}}},
		},
	)
	if err != nil {
		return err
	}
	user.Token = token

	SetAuthCookie(c, token)

	return nil
}

func Register(c *fiber.Ctx) error {
	var body map[string]interface{}
	//var user *models.User

	if err := c.BodyParser(&body); err != nil {
		return fmt.Errorf("empty_body_error")
	}

	return nil
}

func AuthUser(c *fiber.Ctx) (*models.User, error) {
	token := c.Cookies("AUTH_TOKEN", "NULL")

	if token != "NULL" {
		res := database.GetCollection("users").FindOne(context.TODO(), bson.M{"token": token})

		if res.Err() != nil {
			return nil, res.Err()
		}

		var user *models.User
		decodeError := res.Decode(&user)

		if decodeError != nil {
			return nil, decodeError
		}

		return user, nil
	}

	return nil, fmt.Errorf("AuthUser(): Token = null")
}

func SetAuthCookie(c *fiber.Ctx, token string) {
	cookie := new(fiber.Cookie)
	cookie.Name = "AUTH_TOKEN"
	cookie.Value = token
	cookie.MaxAge = 21600
	cookie.Expires = time.Now().UTC().AddDate(0, 0, 7)
	c.Cookie(cookie)
}

func ClearAuthCookie(c *fiber.Ctx) {
	c.ClearCookie("AUTH_TOKEN")
}
