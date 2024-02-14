package main

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Blog struct {
	Id int `gorm:"primaryKey" json:"id"`
	Title  string `json:"title"`
	Text   string `json:"text"`
	Images string `json:"images"`
}

var db *gorm.DB
var err error

func main() {
	e := echo.New()
	dsn := "user=postgres password=password dbname=simpletest host=localhost port=5433 sslmode=disable"
	db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		fmt.Println(err)
	}

	db.AutoMigrate(&Blog{})
	e.Use(middleware.CORS())

	e.Static("/", "./")

	e.POST("/upload", Upload)

	e.GET("/data", RealAll)
	e.POST("/api/data", InsertOne)
	e.DELETE("/api/data/:id", DeleteOne)
	e.PUT("/api/data/:id", UpdateOne)

	e.Start(":8080")

}
func RealAll(c echo.Context) error {
	var blogs []Blog

	err := db.Find(&blogs).Error
	if err != nil {
		return nil
	}
	fmt.Println(blogs)

	return c.JSON(http.StatusOK, blogs)

}
func InsertOne(c echo.Context) error {
    // Declare a variable of type Blog to store the request data
    var blog Blog
    
    // Bind the request body to the Blog struct
    if err := c.Bind(&blog); err != nil {
        // If there's an error binding, return a bad request response
        return c.String(http.StatusBadRequest, "bad request")
    }
    
    // Print the title for debugging purposes
    fmt.Println(blog.Title)
    
    // Assuming db is your database connection, create a new record
    if err := db.Create(&blog).Error; err != nil {
        // If there's an error creating the record, return an internal server error
        return c.String(http.StatusInternalServerError, "failed to create record")
    }
    
    // If everything went well, return a JSON response with status 201 (Created)
    return c.JSON(http.StatusCreated, blog)
}
func DeleteOne(c echo.Context) error {
	id := c.Param("id")

	var blogs Blog

	err := db.Delete(&blogs, id).Error
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err)
	}

	reponse := map[string]string{
		"Delete": "success",
	}
	return c.JSON(http.StatusOK, reponse)

}
func UpdateOne(c echo.Context) error {
	id := c.Param("id")

	var blogs Blog

	err := c.Bind(&blogs)
	if err != nil {
		return c.String(http.StatusBadRequest, "bad request")
	}

	result := db.Model(&Blog{}).Where("id = ?", id).Updates(blogs)
	if result.Error != nil {
		log.Println(result.Error)
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Error updating todo"})
	}

	if result.RowsAffected == 0 {
		return c.JSON(http.StatusOK, map[string]string{"message": "No changes made"})
	}

	return c.JSON(http.StatusOK, map[string]string{"message": "Update successful"})

}
func Upload(c echo.Context) error {
    // Retrieve the uploaded file
    file, err := c.FormFile("file")
    if err != nil {
        log.Println("Error retrieving file:", err)
        return err
    }

    // Retrieve the title and text data
    title := c.FormValue("title")
    text := c.FormValue("text")

    src, err := file.Open()
    if err != nil {
        log.Println("Error opening file:", err)
        return err
    }
    defer src.Close()

    // Create root directory if not exist
    rootFileName := "assets"
    if _, err := os.Stat(rootFileName); os.IsNotExist(err) {
        if err := os.Mkdir(rootFileName, 0755); err != nil {
            log.Println("Error creating directory:", err)
            return err
        }
    }

    // Create sub-directory with current date if not exist
    subFileName := time.Now().Format("02-Jan-2006")
    subDirPath := fmt.Sprintf("%s/%s", rootFileName, subFileName)
    if _, err := os.Stat(subDirPath); os.IsNotExist(err) {
        if err := os.Mkdir(subDirPath, 0755); err != nil {
            log.Println("Error creating sub-directory:", err)
            return err
        }
    }

    // Create destination file
    dst, err := os.Create(fmt.Sprintf("%s/%s", subDirPath, file.Filename))
    if err != nil {
        log.Println("Error creating destination file:", err)
        return err
    }
    defer dst.Close()

    // Copy the uploaded file to the destination
    if _, err := io.Copy(dst, src); err != nil {
        log.Println("Error copying file:", err)
        return err
    }

    // Save the file path to the database
    var blog Blog
    blog.Images = fmt.Sprintf("http://localhost:8080/%s/%s/%s", rootFileName, subFileName, file.Filename)
    blog.Title = title
    blog.Text = text

    if err := db.Create(&blog).Error; err != nil {
        log.Println("Error saving to database:", err)
        return err
    }

    // Return JSON response with uploaded file information
    return c.JSON(http.StatusOK, map[string]string{
        "images": blog.Images,
        "title":  blog.Title,
        "text":   blog.Text,
    })
}

