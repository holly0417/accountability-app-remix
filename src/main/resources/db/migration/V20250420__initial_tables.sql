CREATE TABLE "user"(
    id BIGSERIAL PRIMARY KEY NOT NULL,
    username VARCHAR(255),
    password VARCHAR(511),
    name VARCHAR(255),
    email VARCHAR(255)
);