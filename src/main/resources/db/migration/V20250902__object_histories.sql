CREATE TABLE "task_history" (
    id BIGSERIAL PRIMARY KEY NOT NULL,
    user_id BIGINT NOT NULL,
    task_id BIGINT NOT NULL,
    description VARCHAR(511),
    status VARCHAR(511),
    time_start TIMESTAMP,
    time_end TIMESTAMP,
    timestamp TIMESTAMP
);

CREATE TABLE "wallet_history" (
      id BIGSERIAL PRIMARY KEY NOT NULL,
      wallet_id BIGINT NOT NULL,
      user_id BIGINT NOT NULL,
      balance DOUBLE PRECISION DEFAULT 0,
      timestamp TIMESTAMP
);

CREATE TABLE "relationship_history"(
       id BIGSERIAL PRIMARY KEY NOT NULL,
       relationship_id BIGINT NOT NULL,
       partnerA_id BIGINT NOT NULL,
       partnerB_id BIGINT NOT NULL,
       status VARCHAR(255) NOT NULL,
       timestamp TIMESTAMP
);