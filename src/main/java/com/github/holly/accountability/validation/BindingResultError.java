package com.github.holly.accountability.validation;

import java.util.List;

public class BindingResultError{
    private final String field;
    private final List<String> messages;

    public BindingResultError(String field, List<String> messages) {
        this.field = field;
        this.messages = messages;
    }

    //immutable objects (set in creation by constructor and can only be read)
    public String getField() {
        return field;
    }

    public List<String> getMessages() {
        return messages;
    }
}
