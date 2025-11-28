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

    public Page<Purchase> getPurchasesByUserIdDescTime(Long userId, Pageable pageable){
        return purchaseRepository.findByUserIdOrderByPurchaseTimeDesc(userId, pageable);
    }

    public Page<Purchase> findByUserIdAndStatus(Long userId, PurchaseStatus status, Pageable pageable){
        return purchaseRepository.findByUserIdAndStatus(userId, status, pageable);
    }

    public Purchase makePurchase(Long purchaseId){

        Purchase purchase = purchaseRepository.getReferenceById(purchaseId);

        if(!walletService.subtractBalance(purchase.getUser().getId(), purchase.getPrice())){
            return null;
        }

        purchase.setStatus(PurchaseStatus.PURCHASED);
        purchase.setPurchaseTime(LocalDateTime.now());
        purchaseRepository.save(purchase);
        return purchase;
    }

    public Purchase addToWishList(Long userId, Double price, String description){
        Purchase purchase = new Purchase();

        purchase.setPrice(price);
        purchase.setDescription(description);
        purchase.setUser(userService.findUserById(userId));
        purchase.setStatus(PurchaseStatus.LISTED);
        purchaseRepository.save(purchase);
        return purchase;
    }

}
