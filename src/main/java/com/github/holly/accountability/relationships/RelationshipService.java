package com.github.holly.accountability.relationships;

import com.github.holly.accountability.user.User;
import com.github.holly.accountability.user.UserDto;
import com.github.holly.accountability.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Objects;
import java.util.Optional;


@Component
public class RelationshipService {

    private final RelationshipRepository relationshipRepository;

    @Autowired
    private UserService userService;

    public RelationshipService(RelationshipRepository relationshipRepository, UserService userService) {
        this.relationshipRepository = relationshipRepository;
        this.userService = userService;
    }

    public boolean checkIfUserIsRecipient(Long relationshipId, Long userId) {
        Relationship relationship = relationshipRepository.findById(relationshipId).orElse(null);

        if (relationship == null) {
            return false;
        }

        if (relationship.getStatus() != RelationshipStatus.PENDING) {
            return false;
        }

        return Objects.equals(relationship.getRecipient().getId(), userId);
    }

    public boolean checkIfApprovedPartnership(Long currentUser, Long partner) {
        List<Relationship> existingPartners = relationshipRepository.checkRelationshipExistsByStatusIgnoreDirection(currentUser, partner, List.of(RelationshipStatus.APPROVED));

        return !existingPartners.isEmpty();
    }

    public Relationship findOrMakeRelationship(Long userId, Long partnerId) {

        Optional<Relationship> existingRelationship = relationshipRepository.findRelationship(userId, partnerId);

        if (existingRelationship.isPresent()) {
            return existingRelationship.get();
        }

        User user = userService.findUserById(userId);
        User partner = userService.findUserById(partnerId);

        Relationship relationship = new Relationship();
        relationship.setRequester(user);
        relationship.setRecipient(partner);
        return relationship;
    }

    public List<RelationshipDto> getRelationshipListFromSearch(String search, Long currentUserId) {
        List<User> searchList = userService.findUsersByNameExceptOne(search, currentUserId);

        if (!Objects.equals(search, "")) {
            if (!searchList.isEmpty()) {
                return searchList.stream().map(partner -> {
                    Relationship relationship = findOrMakeRelationship(currentUserId, partner.getId());
                    Relationship flipped = convertToRelationshipWhereGivenUserIsNeverPartner(currentUserId, relationship);
                    return convertRelationshipToRelationshipDto(flipped);
                }).toList();
            }
        }

        return List.of();
    }

    public List<RelationshipDto> getPartners(Long currentUserId, Pageable pageable) {

        Page<Relationship> relationships = relationshipRepository.getRelationshipsByUserIdAndStatusIgnoreDirection(currentUserId, List.of(RelationshipStatus.APPROVED), pageable);

        List<RelationshipDto> partnerDtos = relationships.stream().map(res -> convertToRelationshipWhereGivenUserIsNeverPartner(currentUserId, res)).map(this::convertRelationshipToRelationshipDto).toList();

        if (partnerDtos.isEmpty()) {
            return List.of();
        }

        return partnerDtos;
    }

    public Page<RelationshipDto> getRelationshipsByStatus(Long currentUserId, List<RelationshipStatus> statuses, List<RelationshipDirection> directions, Pageable pageable) {

        //return relationships where current user has sent the request
        if (directions.equals(List.of(RelationshipDirection.REQUESTER))) {
            return relationshipRepository.getRelationshipsByStatusAndUserAsRequester(currentUserId, statuses, pageable).map(this::convertRelationshipToRelationshipDto);
        }

        //return relationships where current user has to respond or already did
        if (directions.equals(List.of(RelationshipDirection.RECIPIENT))) {
            return relationshipRepository.getRelationshipsByStatusAndUserAsRecipient(currentUserId, statuses, pageable).map(relationship -> convertRelationshipToRelationshipDto(relationship.flipped()));
        }

        return relationshipRepository.getRelationshipsByUserIdAndStatusIgnoreDirection(currentUserId, statuses, pageable).map(res -> convertToRelationshipWhereGivenUserIsNeverPartner(currentUserId, res)).map(this::convertRelationshipToRelationshipDto);
    }

    //user as requester
    public RelationshipDto sendRequest(Long currentUserId, Long partnerId) {

        if (relationshipRepository.findRelationship(currentUserId, partnerId).isPresent()) {
            return null;
        }

        User thisUser = userService.findUserById(currentUserId);
        User partner = userService.findUserById(partnerId);


        Relationship newRequest = new Relationship(thisUser, partner, RelationshipStatus.PENDING);

        relationshipRepository.save(newRequest);

        return convertRelationshipToRelationshipDto(newRequest);
    }

    public void deleteRequest(Long relationshipId) {
        Relationship relationshipToDelete = relationshipRepository.getReferenceById(relationshipId);

        relationshipRepository.delete(relationshipToDelete);
    }

    //user is recipient here
    public RelationshipDto answerRequest(Long relationshipId, RelationshipStatus status) {
        Relationship relationship = relationshipRepository.getReferenceById(relationshipId);
        relationship.setStatus(status);
        relationshipRepository.save(relationship);
        return convertRelationshipToRelationshipDto(relationship.flipped());
    }

    public Relationship convertToRelationshipWhereGivenUserIsNeverPartner(Long currentUserId, Relationship relationship) {
        if (Objects.equals(relationship.getRecipient().getId(), currentUserId)) {
            return relationship.flipped();
        }
        return relationship;
    }

    private RelationshipDto convertRelationshipToRelationshipDto(Relationship relationship) {
        UserDto partner = userService.convertUserToDto(relationship.getRecipient());

        return new RelationshipDto(relationship.getId(), relationship.getStatus(), partner);
    }

}
