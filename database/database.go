package database

import (
	"context"
	"fmt"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	uri      string = "mongodb+srv://statsnet-admin:BZAxGq2CgxljTKJl@statsnetdb.5auq3.mongodb.net/statsnet?retryWrites=true&w=majority"
	DBClient mongo.Client
)

func DBInit() mongo.Client {
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(uri))
	if err != nil {
		panic(err)
	}

	// Ping to database
	if err := client.Ping(context.TODO(), nil); err != nil {
		panic(err)
	}

	fmt.Println("Successfully connected and pinged.")

	return *client
}

func GetCollection(collectionName string) *mongo.Collection {
	collection := DBClient.Database("statsnet").Collection(collectionName)
	return collection
}
