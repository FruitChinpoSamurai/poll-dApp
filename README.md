# poll-dApp
A basic questionnaire/poll dApp made with Solidity on the Ethereum Network served with React via Ethers. Check out the demo video for a quick look.

## Goal and considerations
The goal of the project was to learn about the bare fundamentals of fullstack dApp development, especially with the lack of good quality free resources. I did eventually find a few resources to jump off from but they all had their own issues such as:
1. Outdated version of Ethers was used (v5 instead of v6).
2. The Truffle framework was used. At the time of writing, Truffle has officially declared itself dead.
3. Resources dealing Hardhat were often contradictory.
4. Resources prioritized using Metamask. The current latest version of Metamask has gone a major UI overhaul that has introduced many main function related bugs. I elected to use Nekomask instead.  

## Prerequisites
- Node must installed.
- Nekomask or an equivalent extension should be installed on your browser.
- You must be willing to go through Solidity, Ethers, and Hardhat documentation.
- You must know your basic React.

## Setting up a new project
If you'd like to start from scratch, go through the following steps:
1. Generate a React template with `npx create-react-app <your project name>`.
2. Switch to the project directory and install required packages with `npm install ethers hardhat` and `npm install --save-dev @nomicfoundation/hardhat-toolbox`.
3. In the same directory, initialize hardhat with `npx hardhat init`.
4. You'll likely now have a template contract in the **contracts** directory. This is where your contract **.sol** file will go.
5. When you're done creating your contract (Solidity documentation is a good place to look for examples), use `npx hardhat compile` to generate a **.json** file in the newly created **artifacts/contract/<contract_name>** directory. This file has to be copied to the **src** directory in order to make use of the contract with our React dApp.
6. Make whatever changes to **App.js** in order to interact with the Ethereum Network through the contract. Best to use my **App.js** to develop a basic understanding of the features and code and then branch off from there.
7. Once you're ready, rev up the ***server*** with `npx hardhat node`. You'll notice about 20 test wallets loaded with fake Ether. You will be using these with Nekomask to test your dApp.
8. In another terminal, deploy your contract to localhost with `npx hardhat run scripts/deploy.js --network localhost`. Make sure to connect to *localhost* and update the RPC ID to *31337* in the Nekomask settings. Also, enter at least one of the accounts from the output of the server running command into Nekomask.
9. In another terminal, spin up your frontend with `npm start`. Ensure that you're in the project directory.
10. ???
11. Unethical Profit.

## Using this project
If you just want to check this project out, you can do so with the following steps:
1. Clone the repo.
2. Run `npm install` in the project directory.
3. Run `npx hardhat compile`.
4. Transfer **Poll.json** from **artifacts/contract/Poll** to **src**.
5. Run `npx hardhat node`.
6. In another terminal, deploy your contract to localhost with `npx hardhat run scripts/deploy.js --network localhost`.
7. In another terminal, spin up your frontend with `npm start`.
8. Have fun breaking the dApp.

## Features
Generate a questionnaire and allow users to vote on the question with two options (in a checkbox): yes or no. Once the voting period is over, the results are tallied for all to see. Furthermore:
- You can set the duration of the voting period by changing the integer value of *300* (is in seconds) in **line 54 of** ***Poll.sol*** to anything else. For reference, here's the line `expiresAt = deployedAt + 300;`.
- Questions can be set by simply using the *addQuestion* method in **Poll.sol**. You can see this happening in the constructor.
- Users can cast their votes during the voting period.
- Users are prevented from voting after the voting period has ended.
- Results are tallied when the voting period is over.
- Once a user has voted, they cannot vote again.
- When a user switches their wallet, the dApp is reloaded.

## Known issues
1. Users may be able to briefly glimpse the tally before the voting period upon refresing the page. Probably need a delay or better hiding condition.
2. The contract isn't all that robust; there is very little server-side validation.
3. There is also little server-side error reporting.
4. If you reset this project or make changes with compile and serve again, if you've already made a transaction (voted) with a user then your transactions will fail. This is because the block count is now out of order thanks to the wallet's transaction history. The fix for this is to reset the wallet through Nekomask's settings. 
