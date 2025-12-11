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
        return relationshipService.getRelationshipListFromSearch(username, user.getId());
    }

    //5 Dec 2025: got more comfortable returning response entities to frontend (lots of try-catch)
    @GetMapping("/get-partners")
    public List<UserDto> getPartners(@AuthenticationPrincipal AccountabilitySessionUser user,
                                       @PageableDefault(size = 20) Pageable pageable
    ){
        return relationshipService.getPartners(user.getId(), pageable)
                .stream().map(RelationshipDto::getPartner).toList();
    }

    @GetMapping("")
    public Page<RelationshipDto> getRelationshipsByStatus(
            @AuthenticationPrincipal AccountabilitySessionUser user,
            @RequestParam(defaultValue =
                      "APPROVED, REJECTED, PENDING")
                      List<RelationshipStatus> statuses,
            @RequestParam(defaultValue =
                      "REQUESTER, RECIPIENT")
                      List<RelationshipDirection> directions,
            @PageableDefault(size = 20) Pageable pageable
    ){
        return relationshipService
                .getRelationshipsByStatus(user.getId(), statuses, directions, pageable);
    }

    @PutMapping("/{partnerId}")
    public RelationshipDto sendRequest(@AuthenticationPrincipal AccountabilitySessionUser user,
                                             @PathVariable Long partnerId) {

        RelationshipDto requestedRelationships =
                relationshipService.sendRequest(user.getId(), partnerId);

        if (requestedRelationships == null) {
            throw new IllegalArgumentException("Relationship already exists");
        }

        return requestedRelationships;
    }

    @DeleteMapping("/{relationshipId}")
    public ResponseEntity<Void> deleteRequest(@PathVariable Long relationshipId) {

        relationshipService.deleteRequest(relationshipId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{relationshipId}")
    public RelationshipDto answerRequest(@AuthenticationPrincipal AccountabilitySessionUser user,
                                         @PathVariable Long relationshipId,
                                         @RequestBody RelationshipStatusDto status) {

        //is the user the recipient of the request?
        if(!relationshipService.checkIfUserIsRecipient(relationshipId, user.getId())) {
            throw new IllegalArgumentException("You cannot change this relationship");
        }

        return relationshipService.answerRequest(relationshipId, status.getStatus());
    }

}
