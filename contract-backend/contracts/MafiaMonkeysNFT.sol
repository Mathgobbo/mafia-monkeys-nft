// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.1;

// We first import some OpenZeppelin Contracts.
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";
import { Base64 } from "./libraries/Base64.sol";

contract MafiaMonkeysNFT is ERC721URIStorage, Ownable {

  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;
  
  event NewMafiaMonkeysNFTMinted(address sender, uint256 tokenId);


  constructor() ERC721 ("Mafia Monkeys NFT","MAFIAMONKEYSNFT"){
    console.log("This is My NFT Contact LOL!");
  }

  string[] imagesUrls = [
    "https://gateway.pinata.cloud/ipfs/QmXouzwcjMG1XMRHGqBgibmgNe6jYXxFQc7t1ZqmWYoFWq/Mafia/01.png",
    "https://gateway.pinata.cloud/ipfs/QmXouzwcjMG1XMRHGqBgibmgNe6jYXxFQc7t1ZqmWYoFWq/Mafia/02.png",
    "https://gateway.pinata.cloud/ipfs/QmXouzwcjMG1XMRHGqBgibmgNe6jYXxFQc7t1ZqmWYoFWq/Mafia/03.png",
    "https://gateway.pinata.cloud/ipfs/QmXouzwcjMG1XMRHGqBgibmgNe6jYXxFQc7t1ZqmWYoFWq/Mafia/04.png",
    "https://gateway.pinata.cloud/ipfs/QmXouzwcjMG1XMRHGqBgibmgNe6jYXxFQc7t1ZqmWYoFWq/Mafia/05.png",
    "https://gateway.pinata.cloud/ipfs/QmXouzwcjMG1XMRHGqBgibmgNe6jYXxFQc7t1ZqmWYoFWq/Mafia/06.png",
    "https://gateway.pinata.cloud/ipfs/QmXouzwcjMG1XMRHGqBgibmgNe6jYXxFQc7t1ZqmWYoFWq/Mafia/07.png",
    "https://gateway.pinata.cloud/ipfs/QmXouzwcjMG1XMRHGqBgibmgNe6jYXxFQc7t1ZqmWYoFWq/Mafia/08.png",
    "https://gateway.pinata.cloud/ipfs/QmXouzwcjMG1XMRHGqBgibmgNe6jYXxFQc7t1ZqmWYoFWq/Mafia/09.png",
    "https://gateway.pinata.cloud/ipfs/QmXouzwcjMG1XMRHGqBgibmgNe6jYXxFQc7t1ZqmWYoFWq/Mafia/10.png",
    "https://gateway.pinata.cloud/ipfs/QmXouzwcjMG1XMRHGqBgibmgNe6jYXxFQc7t1ZqmWYoFWq/Mafia/11.png",
    "https://gateway.pinata.cloud/ipfs/QmXouzwcjMG1XMRHGqBgibmgNe6jYXxFQc7t1ZqmWYoFWq/Mafia/12.png",
    "https://gateway.pinata.cloud/ipfs/QmXouzwcjMG1XMRHGqBgibmgNe6jYXxFQc7t1ZqmWYoFWq/Mafia/13.png",
    "https://gateway.pinata.cloud/ipfs/QmXouzwcjMG1XMRHGqBgibmgNe6jYXxFQc7t1ZqmWYoFWq/Mafia/14.png",
    "https://gateway.pinata.cloud/ipfs/QmXouzwcjMG1XMRHGqBgibmgNe6jYXxFQc7t1ZqmWYoFWq/Mafia/15.png",
    "https://gateway.pinata.cloud/ipfs/QmXouzwcjMG1XMRHGqBgibmgNe6jYXxFQc7t1ZqmWYoFWq/Mafia/16.png",
    "https://gateway.pinata.cloud/ipfs/QmXouzwcjMG1XMRHGqBgibmgNe6jYXxFQc7t1ZqmWYoFWq/Mafia/17.png",
    "https://gateway.pinata.cloud/ipfs/QmXouzwcjMG1XMRHGqBgibmgNe6jYXxFQc7t1ZqmWYoFWq/Mafia/18.png",
    "https://gateway.pinata.cloud/ipfs/QmXouzwcjMG1XMRHGqBgibmgNe6jYXxFQc7t1ZqmWYoFWq/Mafia/19.png",
    "https://gateway.pinata.cloud/ipfs/QmXouzwcjMG1XMRHGqBgibmgNe6jYXxFQc7t1ZqmWYoFWq/Mafia/20.png",
    "https://gateway.pinata.cloud/ipfs/QmXouzwcjMG1XMRHGqBgibmgNe6jYXxFQc7t1ZqmWYoFWq/Mafia/21.png",
    "https://gateway.pinata.cloud/ipfs/QmXouzwcjMG1XMRHGqBgibmgNe6jYXxFQc7t1ZqmWYoFWq/Mafia/22.png"
  ];

  function getRandomMonkeyImage(uint256 tokenId) public view returns (string memory){
      uint256 rand = random(string(abi.encodePacked("MAFIA", Strings.toString(tokenId))));
      rand = rand % imagesUrls.length;
      return imagesUrls[rand];
  }


  function random(string memory input) internal pure returns (uint256) {
      return uint256(keccak256(abi.encodePacked(input)));
  }
  
  // A function our user will hit to get their NFT.
  function makeAnEpicNFT() public {
     // Get the current tokenId, this starts at 0.
    uint256 newItemId = _tokenIds.current();
    string memory nftName = string(abi.encodePacked("Mafia Monkey #", Strings.toString(newItemId)));
    string memory image = getRandomMonkeyImage(newItemId);
    //Create the Base64 from the Json passed as parameter
    string memory json = Base64.encode(
        bytes(
            string(
                abi.encodePacked(
                    '{"name": "',nftName,'", "description": "A highly acclaimed collection of Mafia Monkeys generated online by DALL-E Mini, an image generator Artifical Intelligence (https://huggingface.co/spaces/dalle-mini/dalle-mini)", "image": "',image, '"}'
                )
            )
        )
    );
     string memory finalTokenUri = string(
        abi.encodePacked("data:application/json;base64,", json)
    );

     // Actually mint the NFT to the sender using msg.sender.
    _safeMint(msg.sender, newItemId);
    // Set the NFTs data.
    _setTokenURI(newItemId, finalTokenUri);
    // Increment the counter for when the next NFT is minted.
    _tokenIds.increment();
    
    console.log("An NFT w/ ID %s has been minted to %s", newItemId, msg.sender);

    emit  NewMafiaMonkeysNFTMinted(msg.sender, newItemId);
  }
}