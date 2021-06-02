package models

type User struct {
	ID          int64  `bson:"id"`
	Email       string `bson:"email"`
	Password    string `bson:"password"`
	Username    string `bson:"username"`
	Firstname   string `bson:"firstname"`
	Lastname    string `bson:"lastname"`
	PhoneNumber string `bson:"phonenumber"`
	Token       string `bson:"token"`
}
