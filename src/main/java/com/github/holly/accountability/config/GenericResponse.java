package com.github.holly.accountability.config;


public class GenericResponse {
    private String message;
    private boolean error;

    public GenericResponse(String message, boolean error) {
        this.message = message;
        this.error = error;
    }

    public GenericResponse(String message) {
        this(message, false);
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getMessage() {
        return this.message;
    }

    public boolean isError() {
        return error;
    }

    public void setError(boolean error) {
        this.error = error;
    }
}
