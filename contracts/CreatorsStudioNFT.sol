// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CreatorsStudioNFT is ERC1155, Ownable {
    string public name;
    string public symbol;
    uint256 public constant ITEM_CREATOR = 0;
    uint256 public constant ITEM_FOLLOWER = 1;
    uint256 public constant MAX_SUPPLY_CREATOR = 100;
    uint256 public constant MAX_SUPPLY_FOLLOWER = 500;
    uint256 public mintedToken = 0;

    constructor(string memory initialBaseURI) ERC1155(initialBaseURI) {
        name = "Sample";
        symbol = "sample";
    }

    function mint(uint256 token_id, uint256 num) external {
        if (token_id == ITEM_CREATOR) {
            mintCreators(num);
        } else if (token_id == ITEM_FOLLOWER) {
            mintFollowers(num);
        }
        mintedToken += num;
    }

    function mintCreators(uint256 num) private {
        require(
            mintedToken + num <= MAX_SUPPLY_CREATOR,
            "Max token supply reached"
        );
        _mint(msg.sender, ITEM_CREATOR, num, "");
    }

    function mintFollowers(uint256 num) private {
        require(
            mintedToken + num <= MAX_SUPPLY_FOLLOWER,
            "Max token supply reached"
        );
        _mint(msg.sender, ITEM_FOLLOWER, num, "");
    }

    function withdraw() public payable onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }
}
