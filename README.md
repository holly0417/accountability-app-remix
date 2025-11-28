# Accountability App
Note: This copy of my Accountability App uses Postgres instead of H2 and will switch over the frontend language from Vue.js to React/Remix. Work in progress.

Accountability App is a web-based application designed to help you complete day-to-day tasks using a rewards-based accountability system. 
The purpose of this app is to bring a form of instant gratification to our mundane, every-day tasks but in a way that feels more meaningful via actual accountability from other people. 
Users can request partnerships with other users, keep track of payments, and earn "money" through having their completed tasks approved by their partners. 
You can compare your earnings with that of your partners and "spend" those earnings through registering payments into your wallet. <br>

Disclaimer: This app is still very much in development! It's my personal sandbox project for learning how to develop apps. 
So if you'd like to pull this image, know that it may not run as smoothly as you may expect. 

## Built With
* Spring Web framework
* [Spring Boot 3.5+](https://spring.io/projects/spring-boot)
* [Flyway](org.flywaydb:flyway-core) - Database Migration
* [Gradle 9.0](https://gradle.org/) - Dependency Management
* [Postgres](https://www.postgresql.org/) - Database
* [Hibernate](https://hibernate.org/) - ORM
* [Docker](https://www.docker.com/) - For database containerization

### Features
- Spring Boot 3.5 with Java 25
- Caffeine caching
- Frontend integration with Node.js build pipeline
- Docker containerization with Paketo Buildpacks

# How to install
## Prerequisites
- JDK 25 or later
- Gradle 9.0+
- Docker

# Setting up your Postgres database
### In your `docker-compose.yml`
You can set the Postgres image as well as the name, username, and password for the database. 
In the terminal, run `docker compose up` to run the container alongside the app. 
```
services:
  postgres:
    image: postgres:18
    environment:
      POSTGRES_DB: <database name>
      POSTGRES_USER: <username>
      POSTGRES_PASSWORD: <password>
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql

volumes:
  postgres_data:
```
### In your `application.yml`
Set up the url, username, password, and driver class. 
```
spring:
  datasource:
    url: "jdbc:postgresql://localhost:5432/<database name>"
    username: <username>
    password: <password>
    hikari:
      driver-class-name: org.postgresql.Driver
```

### Gmail SMTP server setup
You can also set a [Gmail SMTP server](https://support.google.com/a/answer/176600?hl=en) in your `application.yml` so that you can send emails with password reset links if needed. <br>
Make sure to set up an [app password](https://support.google.com/mail/answer/185833?hl=en) for this. 

See example here: <br>
```
spring:
  mail:
    host: "smtp.gmail.com"
    port: 587
    username: "email address of the Gmail account you want to use"
    password: "the app password (not your real password!)"
    properties:
      mail:
        smtp:
          auth: true
          starttls:
            enable: true
```

# How to use (for users)
When first registering, each user starts out with a value of 0 in their wallet. <br>
You can start earning money and increase the value in your wallet by completing tasks and having your partners approve them.<br>
<br>
# Registration & resetting password
Users can sign in, reset their passwords if they forget them by having a reset token link sent to their email, and see their account information.<br>
<br>

# Main Functionality: Tasks
Once you submit a new task, it will show up in your To-do list.<br>
<br>
From there, you can choose to either start or delete the task.<br>
Once started, the task will go into the "Tasks in progress" section where it will be time-tracked.<br><br>
The amount of time taken on each task is grouped by status and a total is calculated for how much the user could potentially "earn".<br><br>
However, earnings are added to the wallet only after a task has been completed and approved by a partner.<br><br>
Users can also see a list of their approved & rejected tasks, how much they've earned in their personal wallet, as well as recent tasks from their partners.<br><br>


# Find partners
Users can find other existing users in the platform and request a partnership.<br>
<br>

Once a partnership is requested, users can either approve, reject, or delete the request based on whether they sent or received the request. <br>
<br>
Only requesters can delete a pending request while only senders of a rejection can undo a rejected partnership.<br>
<br>

# Wallet & purchases
Users can also make "purchases" using the earnings available in their wallets.<br>
<br>

