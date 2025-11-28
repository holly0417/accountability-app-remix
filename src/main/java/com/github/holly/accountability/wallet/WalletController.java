package com.github.holly.accountability.wallet;

import com.github.holly.accountability.purchase.PurchaseService;
import com.github.holly.accountability.user.AccountabilitySessionUser;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


import java.util.List;

@Controller
@RequestMapping("/api/wallet")
@ResponseBody
public class WalletController {

    private final WalletService walletService;

    public WalletController(WalletService walletService, PurchaseService purchaseService) {
        this.walletService = walletService;
    }

    @GetMapping("")
    public WalletDto getWallet(@AuthenticationPrincipal AccountabilitySessionUser user){

        Wallet userWallet = walletService.findWalletByUserId(user.getId());
        return convertWalletToWalletDto(userWallet);
    }

    @GetMapping("/get-wallet")
    public Page<WalletDto> getWallets(@RequestParam(required = false) List<Long> userIds,
                                     @PageableDefault(size=20) Pageable pageable){

        return walletService.findWalletsByUserIds(userIds, pageable)
                .map(this::convertWalletToWalletDto);
    }

    private WalletDto convertWalletToWalletDto(Wallet wallet){
        WalletDto walletDto = new WalletDto();
        walletDto.setBalance(wallet.getBalance());
        walletDto.setUserId(wallet.getUser().getId());
        walletDto.setUserName(wallet.getUser().getUsername());
        return walletDto;
    }
}