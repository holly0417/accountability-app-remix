package com.github.holly.accountability.relationships;

import com.github.holly.accountability.config.BeanContextHelper;
import jakarta.persistence.PostPersist;
import jakarta.persistence.PostRemove;
import jakarta.persistence.PostUpdate;

import java.time.LocalDateTime;


public class RelationshipEntityListener {

    @PostPersist
    public void postPersist(Relationship target) {
        RelationshipHistoryRepository repository = BeanContextHelper.getBean(RelationshipHistoryRepository.class);
        var history = new RelationshipHistory(target.getId(), target.getRequester().getId(), target.getRecipient().getId(), target.getStatus(), LocalDateTime.now());
        repository.save(history);
    }

    @PostUpdate
    public void postUpdate(Relationship target) {
        RelationshipHistoryRepository repository = BeanContextHelper.getBean(RelationshipHistoryRepository.class);
        var history = new RelationshipHistory(target.getId(), target.getRequester().getId(), target.getRecipient().getId(), target.getStatus(), LocalDateTime.now());
        repository.save(history);
    }

    @PostRemove
    public void postDelete(Relationship target) {
    }
}