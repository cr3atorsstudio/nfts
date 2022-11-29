// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract CreatorsStudioNFT is ERC1155 {
    uint256 public constant ITEM_0 = 0;
    uint256 public constant ITEM_1 = 1;

    constructor() ERC1155("https://rlho.github.io/nft_sample/{id}}.json") {
        _mint(msg.sender, ITEM_1, 1, "");
    }
}
