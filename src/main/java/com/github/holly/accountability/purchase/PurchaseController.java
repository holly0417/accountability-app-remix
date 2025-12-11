package com.github.holly.accountability.purchase;

import com.github.holly.accountability.user.AccountabilitySessionUser;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Controller
@RequestMapping("/api/purchase")
@ResponseBody
public class PurchaseController {

    private final PurchaseService purchaseService;

    public PurchaseController(PurchaseService purchaseService) {
        this.purchaseService = purchaseService;
    }

    @GetMapping("")
    public Page<PurchaseDto> getPurchaseListByType(@AuthenticationPrincipal AccountabilitySessionUser user,
                                                   @RequestParam(defaultValue = "") List<Long> userIds,
                                                    @RequestParam(defaultValue = "LISTED, PURCHASED"
                                                    ) List<PurchaseStatus> status,
                                                    @PageableDefault(size = 20) Pageable pageable){

        if(userIds.isEmpty()){
            return purchaseService.findByUserIdAndStatus(List.of(user.getId()), status, pageable);
        }

        return purchaseService.findByUserIdAndStatus(userIds, status, pageable);
    }

    @PostMapping("/{purchaseId}")
    public PurchaseDto purchase(@PathVariable Long purchaseId){

        PurchaseDto purchase = purchaseService.makePurchase(purchaseId);

        if (purchase == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Insufficient balance");
        }

        return purchase;
    }

    @PostMapping("/add-to-wishlist")
    public PurchaseDto addToWishList(@AuthenticationPrincipal AccountabilitySessionUser user,
                                @RequestBody PurchaseDto purchaseDto){

        return purchaseService.addToWishList(user.getId(), purchaseDto.getPrice(), purchaseDto.getDescription());
    }

}