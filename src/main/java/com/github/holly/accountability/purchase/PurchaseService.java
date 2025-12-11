package com.github.holly.accountability.purchase;

import com.github.holly.accountability.user.UserService;
import com.github.holly.accountability.wallet.WalletService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class PurchaseService {

    private final PurchaseRepository purchaseRepository;
    private final UserService userService;
    private final WalletService walletService;

    public PurchaseService(PurchaseRepository purchaseRepository,
                           UserService userService,
                           WalletService walletService) {
        this.purchaseRepository = purchaseRepository;
        this.userService = userService;
        this.walletService = walletService;
    }

    public Page<PurchaseDto> findByUserIdAndStatus(List<Long> userIds, List<PurchaseStatus> statuses, Pageable pageable){
        return purchaseRepository.findByUserIdAndStatus(userIds, statuses, pageable).map(this::convertPurchaseToDto);
    }

    public PurchaseDto makePurchase(Long purchaseId){

        Purchase purchase = purchaseRepository.getReferenceById(purchaseId);

        if(!walletService.subtractBalance(purchase.getUser().getId(), purchase.getPrice())){
            return null;
        }

        purchase.setStatus(PurchaseStatus.PURCHASED);
        purchase.setPurchaseTime(LocalDateTime.now());
        purchaseRepository.save(purchase);
        return convertPurchaseToDto(purchase);
    }

    public PurchaseDto addToWishList(Long userId, Double price, String description){
        Purchase purchase = new Purchase();

        purchase.setPrice(price);
        purchase.setDescription(description);
        purchase.setUser(userService.findUserById(userId));
        purchase.setStatus(PurchaseStatus.LISTED);
        purchaseRepository.save(purchase);
        return convertPurchaseToDto(purchase);
    }

    private PurchaseDto convertPurchaseToDto(Purchase purchase){
        PurchaseDto purchaseDto = new PurchaseDto();
        purchaseDto.setId(purchase.getId());
        purchaseDto.setDescription(purchase.getDescription());
        purchaseDto.setPrice(purchase.getPrice());
        purchaseDto.setUserId(purchase.getUser().getId());
        purchaseDto.setStatus(purchase.getStatus());
        purchaseDto.setUserName(purchase.getUser().getUsername());

        if (purchase.getPurchaseTime() != null) {
            LocalDateTime purchaseTime = purchase.getPurchaseTime();

            String[] date = purchaseTime.toString().split("T");

            String[] time = date[1].split(":");

            String timestamp = date[0] + " " + time[0] + ":" + time[1];

            purchaseDto.setPurchaseTimeString(timestamp);
        }
        return purchaseDto;
    }

}
