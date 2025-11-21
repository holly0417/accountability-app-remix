package com.github.holly.accountability.relationships;

import com.github.holly.accountability.user.User;
import com.github.holly.accountability.user.UserDto;
import com.github.holly.accountability.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;


@Component
public class RelationshipService {

    private final RelationshipRepository relationshipRepository;

    @Autowired
    private UserService userService;

    public RelationshipService(RelationshipRepository relationshipRepository,
                               UserService userService) {
        this.relationshipRepository = relationshipRepository;
        this.userService = userService;
    }

    public boolean checkIfRequestResponseValid(Long relationshipId, Long userId){
        Relationship relationship = relationshipRepository.findById(relationshipId).orElse(null);

        if(relationship == null) {
            return false;
        }

        if(relationship.getStatus() != RelationshipStatus.PENDING) {
            return false;
        }

        return Objects.equals(relationship.getUser().getId(), userId);
    }

    public boolean checkIfApprovedPartnership(Long currentUser, Long partner){
        List<Relationship> existingPartners = relationshipRepository
                .checkRelationshipExistsByStatusIgnoreDirection(
                        currentUser,
                        partner,
                        List.of(RelationshipStatus.APPROVED));

        return !existingPartners.isEmpty();
    }

    public Relationship findOrMakeRelationship(Long userId, Long partnerId){

        Relationship existingRelationship = relationshipRepository
                .findRelationship(userId, partnerId);

        if (existingRelationship != null) {
            //WHY: because REQUESTED stays the same in one direction even if updated
            //need to find status of relationship in other direction to see if PENDING, APPROVED, or REJECTED
            if(existingRelationship.getStatus() == RelationshipStatus.REQUESTED) {
                existingRelationship = relationshipRepository
                        .findRelationship(partnerId, userId);
            }

            return existingRelationship;
        }

        User user = userService.findUserById(userId);
        User partner = userService.findUserById(partnerId);

        Relationship relationship = new Relationship();
        relationship.setUser(user);
        relationship.setPartner(partner);
        return relationship;
    }

    public Relationship convertToRelationshipWhereGivenUserIsNeverPartner(Long currentUserId,
                                                                                  Relationship relationship){
        if (Objects.equals(relationship.getPartner().getId(), currentUserId)) {
            return relationship.flipped();
        }
        return relationship;
    }

    public List<UserDto> getPartnersUserInfoFromGivenListForGivenUser(Long userId,
                                                                       List<Relationship> relationships) {

        return relationships.stream()
                    .map(res ->
                            convertToRelationshipWhereGivenUserIsNeverPartner(userId, res))
                    .map(Relationship::getPartner)
                    .map(userService::convertUserToDto)
                    .toList();
    }


    public List<Relationship> getRelationshipListFromSearch(String search, Long currentUserId) {
        List<User> searchList = userService.findUsersByNameExceptOne(search, currentUserId);

        if (!Objects.equals(search, "")) { // an empty spring, caused by backspace
            return searchList.stream()
                    .map(partner ->
                            findOrMakeRelationship(currentUserId, partner.getId()
                            )
                    )
                    .map(relationship ->
                            convertToRelationshipWhereGivenUserIsNeverPartner(
                                    currentUserId, relationship
                            )
                    )
                    .toList();
        }

        return List.of();
    }

    public List<Long> getPartnerIdsOnly(Long currentUserId, Pageable pageable){
        Page<Relationship> relationships = relationshipRepository
                .getRelationshipsByUserIdAndStatusIgnoreDirection(
                        currentUserId, List.of(RelationshipStatus.APPROVED),
                        pageable);

        List<UserDto> partnerDtos = getPartnersUserInfoFromGivenListForGivenUser(
                currentUserId, relationships.getContent());

        return partnerDtos.stream().map(UserDto::getId).toList();
    }

    public Page<Relationship> getRelationshipsByStatus(Long currentUserId,
                                            List<RelationshipStatus> statuses,
                                            List<RelationshipDirection> directions,
                                            Pageable pageable){
        //REQUESTED SENDER = PENDING RECEIVER
        //REQUESTED RECEIVER = PENDING SENDER

        //current user is in the USER column of relationship
        if (directions.equals(List.of(RelationshipDirection.SENDER))) {
            return relationshipRepository
                    .getRelationshipsByUserIdAndStatus(
                            currentUserId, statuses, pageable);
            //requested: user requested
            //pending: requests where the user has to answer
            //reject: rejections sent by the user
        }

        //current user is in the PARTNER column of relationship
        if (directions.equals(List.of(RelationshipDirection.RECEIVER))) {
            return relationshipRepository
                    .getRelationshipsByPartnerIdAndStatus(
                            currentUserId, statuses, pageable);
            //requested: requests where the user has to wait
            //pending: requests where the user has to wait
            //reject: rejections received by the user from others
        }

        if (statuses.equals(List.of(RelationshipStatus.APPROVED))) {
            return relationshipRepository
                    //approval for relationships can happen from both the user and partner side
                    .getRelationshipsByUserIdAndStatusIgnoreDirection(
                            currentUserId, statuses, pageable)
                    .map(res -> convertToRelationshipWhereGivenUserIsNeverPartner(
                                    currentUserId, res));
        }

        return relationshipRepository
                .getRelationshipsByUserIdAndStatusIgnoreDirection(
                        currentUserId, statuses, pageable);
    }

    public List<Relationship> sendRequest(Long currentUserId, Long partnerId){
        if (relationshipRepository
                .findRelationship(currentUserId, partnerId) != null) {
            return null;
        }

        User thisUser = userService.findUserById(currentUserId);
        User partner = userService.findUserById(partnerId);

        Relationship newRelationshipRequest =
                new Relationship(thisUser, partner, RelationshipStatus.REQUESTED);

        Relationship newRelationshipPending =
                new Relationship(partner, thisUser, RelationshipStatus.PENDING);

        relationshipRepository.save(newRelationshipPending);
        relationshipRepository.save(newRelationshipRequest);

        List<Relationship> relationshipsToAdd = new ArrayList<>();

        relationshipsToAdd.add(newRelationshipRequest);
        relationshipsToAdd.add(newRelationshipPending);

        return relationshipsToAdd;
    }

    public void deletePartnerRequest(Long relationshipId){
        Relationship relationshipToDelete =
                relationshipRepository.getReferenceById(relationshipId);

        Relationship relationshipOtherDirection =
                relationshipRepository
                        .findRelationship(relationshipToDelete.getPartner().getId(),
                                relationshipToDelete.getUser().getId());

        relationshipRepository.delete(relationshipToDelete);
        relationshipRepository.delete(relationshipOtherDirection);
    }

    public Relationship answerRequest(Long relationshipId, RelationshipStatusDto status){
        Relationship relationship = relationshipRepository.getReferenceById(relationshipId);
        relationship.setStatus(status.getStatus());
        relationshipRepository.save(relationship);
        return relationship;
    }

    public List<UserDto> getUserDtosOfRelationship(Relationship relationship){
        List<UserDto> bothUsers = new ArrayList<>();
        UserDto user = userService.convertUserToDto(relationship.getUser());
        UserDto partner = userService.convertUserToDto(relationship.getPartner());
        bothUsers.add(user);
        bothUsers.add(partner);
        return bothUsers;
    }

}
