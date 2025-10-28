CREATE TABLE "wallet" (
    id BIGSERIAL PRIMARY KEY NOT NULL,
    user_id BIGINT NOT NULL,
    balance DOUBLE PRECISION DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES "user"(id)
);

CREATE TABLE "tasks"(
    id BIGSERIAL PRIMARY KEY NOT NULL,
    user_id BIGINT NOT NULL,
    description VARCHAR(511),
    status VARCHAR(255) NOT NULL,
    time_start TIMESTAMP,
    time_end TIMESTAMP,
    duration BIGINT,

    FOREIGN KEY (user_id) REFERENCES "user"(id)
);

CREATE TABLE "relationships"(
    id BIGSERIAL PRIMARY KEY NOT NULL,
    user_id BIGINT NOT NULL,
    partner_id BIGINT NOT NULL,
    status VARCHAR(255) NOT NULL,

    FOREIGN KEY (user_id) REFERENCES "user"(id),
    FOREIGN KEY (partner_id) REFERENCES "user"(id)
);