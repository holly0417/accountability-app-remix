package com.github.holly.accountability.relationships;

import com.github.holly.accountability.user.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/api/relationships")
@ResponseBody
public class RelationshipController {

    private final RelationshipService relationshipService;

    public RelationshipController(RelationshipService relationshipService) {
        this.relationshipService = relationshipService;
    }

    @GetMapping("/search")
    public List<RelationshipDto> search(@AuthenticationPrincipal AccountabilitySessionUser user,
                                        @RequestParam String username
    ){
        return relationshipService.getRelationshipListFromSearch(username, user.getId())
                .stream()
                .map(this::convertRelationshipToRelationshipData)
                .toList();
    }

    //5 Dec 2025: got more comfortable returning response entities to frontend (lots of try-catch)
    @GetMapping("/get-partners")
    public ResponseEntity<List<UserDto>> getPartners(@AuthenticationPrincipal AccountabilitySessionUser user,
                                       @PageableDefault(size = 20) Pageable pageable
    ){
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return ResponseEntity.ok(relationshipService.getPartners(user.getId(), pageable));
    }

    @GetMapping("")
    public Page<RelationshipDto> getRelationshipsByStatus(
            @AuthenticationPrincipal AccountabilitySessionUser user,
            @RequestParam(defaultValue =
                      "REQUESTED, APPROVED, REJECTED, PENDING")
                      List<RelationshipStatus> statuses,
            @RequestParam(defaultValue =
                      "SENDER, RECEIVER")
                      List<RelationshipDirection> directions,
            @PageableDefault(size = 20) Pageable pageable
    ){
        return relationshipService
                .getRelationshipsByStatus(user.getId(), statuses, directions, pageable)
                .map(this::convertRelationshipToRelationshipData);

    }

    @PutMapping("/request/{partnerId}")
    public List<RelationshipDto> sendRequest(@AuthenticationPrincipal AccountabilitySessionUser user,
                                             @PathVariable Long partnerId) {

        List<Relationship> requestedRelationships =
                relationshipService.sendRequest(user.getId(), partnerId);

        if (requestedRelationships == null) {
            throw new IllegalArgumentException("Relationship already exists");
        }

        return requestedRelationships
                .stream()
                .map(this::convertRelationshipToRelationshipData).toList();
    }

    //delete request
    @DeleteMapping("/{relationshipId}")
    public ResponseEntity<Void> deleteRequest(@PathVariable Long relationshipId) {

        relationshipService.deletePartnerRequest(relationshipId);

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{relationshipId}")
    public RelationshipDto answerRequest(@AuthenticationPrincipal AccountabilitySessionUser user,
                                         @PathVariable Long relationshipId,
                                         @RequestBody RelationshipStatusDto status) {

        if(!relationshipService.checkIfRequestResponseValid(relationshipId, user.getId())) {
            throw new IllegalArgumentException("You cannot change this relationship");
        }

        Relationship relationship = relationshipService.answerRequest(relationshipId, status.getStatus());

        return convertRelationshipToRelationshipData(relationship);
    }

    //either finds whether there is an existing relationship between the two users
    //or creates a new relationship where the STATUS is NULL

    private RelationshipDto convertRelationshipToRelationshipData(Relationship relationship) {
        List<UserDto> userAndPartner = relationshipService.getUserDtosOfRelationship(relationship);

        return new RelationshipDto(
                relationship.getId(),
                relationship.getStatus(),
                userAndPartner.getFirst(),
                userAndPartner.get(1));
    }

}
