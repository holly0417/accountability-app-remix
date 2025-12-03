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

    public WalletController(WalletService walletService) {
        this.walletService = walletService;
    }

    @GetMapping("")
    public Page<WalletDto> getWallet(@AuthenticationPrincipal AccountabilitySessionUser user,
                               @RequestParam(required = false) List<Long> userIds,
                               @PageableDefault(size=20) Pageable pageable){

        if(userIds == null || userIds.isEmpty()) {
            return walletService.findWalletsByUserIds(List.of(user.getId()), pageable)
                    .map(this::convertWalletToWalletDto);
        }
        return walletService.findWalletsByUserIds(userIds, pageable)
                .map(this::convertWalletToWalletDto);
    }

    @GetMapping("/history")
    public Page<WalletHistoryDto> getWalletHistory(@AuthenticationPrincipal AccountabilitySessionUser user,
                                                @RequestParam(required = false) List<Long> userIds,
                                                @PageableDefault(size=20) Pageable pageable){
        if(userIds == null || userIds.isEmpty()) {
            return walletService.findWalletHistoryByUserId(List.of(user.getId()), pageable)
                    .map(this::convertWalletHistoryToWalletHistoryDto);
        }
        return walletService.findWalletHistoryByUserId(userIds, pageable)
                .map(this::convertWalletHistoryToWalletHistoryDto);
    }


    private WalletDto convertWalletToWalletDto(Wallet wallet){
        WalletDto walletDto = new WalletDto();
        walletDto.setId(wallet.getId());
        walletDto.setBalance(wallet.getBalance());
        walletDto.setUserId(wallet.getUser().getId());
        walletDto.setUserName(wallet.getUser().getUsername());
        return walletDto;
    }

    private WalletHistoryDto convertWalletHistoryToWalletHistoryDto(WalletHistory walletHistory){
        WalletHistoryDto walletHistoryDto = new WalletHistoryDto();
        walletHistoryDto.setId(walletHistory.getId());
        walletHistoryDto.setUserId(walletHistory.getUserId());
        walletHistoryDto.setWalletId(walletHistory.getWalletId());
        walletHistoryDto.setBalance(walletHistory.getBalance());
        walletHistoryDto.setDateTime(walletHistory.getTimestamp());

        int month = walletHistory.getTimestamp().toLocalDate().getMonthValue();
        int day = walletHistory.getTimestamp().toLocalDate().getDayOfMonth();
        int year = walletHistory.getTimestamp().toLocalDate().getYear();

        String monthString = String.format("%02d-", month);
        String dayString = String.format("%02d-", day);
        String yearString = String.format("%02d", year);
        String dateTimeString = monthString.concat(dayString).concat(yearString);

        walletHistoryDto.setDateAsString(dateTimeString);

        return walletHistoryDto;
    }
}