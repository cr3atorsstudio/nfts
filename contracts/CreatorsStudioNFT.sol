// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CreatorsStudioNFT is ERC1155, Ownable {
    string public name;
    string public symbol;
    uint256 public constant ITEM_CREATOR = 0;
    uint256 public constant ITEM_SUPPORTER = 1;
    uint256 public constant MAX_SUPPLY = 100;
    uint256 public constant MAX_PER_WALLET = 1;
    uint256 public mintedToken = 0;
    mapping(address => uint256) public mintedCreatorTokens;
    mapping(address => uint256) public mintedSupporterTokens;

    constructor(string memory initialBaseURI) ERC1155(initialBaseURI) {
        name = "Sample";
        symbol = "sample";
    }

    function mint(uint256 token_id, uint256 num) external {
        if (token_id == ITEM_CREATOR) {
            mintCreators(num);
        } else if (token_id == ITEM_SUPPORTER) {
            mintSupporters(num);
        }
        mintedToken += num;
    }

    function mintCreators(uint256 num) private {
        require(mintedToken + num <= MAX_SUPPLY, "Max token supply reached");
        require(
            mintedCreatorTokens[msg.sender] + num <= MAX_PER_WALLET,
            "Max supply of wallet reached"
        );
        _mint(msg.sender, ITEM_CREATOR, num, "");
        mintedCreatorTokens[msg.sender] += num;
    }

    function mintSupporters(uint256 num) private {
        require(mintedToken + num <= MAX_SUPPLY, "Max token supply reached");
        require(
            mintedSupporterTokens[msg.sender] + num <= MAX_PER_WALLET,
            "Max supply of wallet reached"
        );
        _mint(msg.sender, ITEM_SUPPORTER, num, "");
        mintedSupporterTokens[msg.sender] += num;
    }

    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) external onlyOwner {
        uint256 i;
        uint256 sum = 0;
        _mintBatch(to, ids, amounts, data);
        for (i = 0; i < amounts.length; i++) {
            sum = sum + amounts[i];
        }
        mintedToken += sum;
    }

    function withdraw() public payable onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }
}
