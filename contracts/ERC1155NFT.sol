// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract CreatorsStudioNFT is ERC1155 {
    string private constant NFT_URI =
        "https://rlho.github.io/nft_sample/{id}}.json";
    uint256 public constant ITEM_DOCUMENTS = 0;
    uint256 public constant ITEM_FLOWER_1 = 1;

    constructor() ERC1155(NFT_URI) {}

    function mint(token_id, num) public{
        if (token_id == ITEM_DOCUMENTS) {
            mintDocuments(num);
        } else if (token_id == ITEM_FLOWER_1) {
            mintFlower1(num);
        }
    }

    function mintDocuments(num) private{
        require(balanceOf(msg.sender, ITEM_DOCUMENTS) == 0, "You already have a Documents.")
        _mint(msg.sender, ITEM_DOCUMENTS, num, "");
    }

    function mintFlower1(num) private{
        require(balanceOf(msg.sender, ITEM_FLOWER_1) == 0, "You already have a Flower1.")
        _mint(msg.sender, ITEM_FLOWER_1, num, "");
    }
}
