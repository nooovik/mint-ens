const Web3 = require('web3');
const ensAbi = require('./ens-abi.json'); // Replace with the actual path to the ENS ABI file

const providerUrl = 'https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID'; // Replace with your Infura project ID or Ethereum node URL
const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));

const ensAddress = '0x314159265dD8dbb310642f98f50C066173C1259b'; // Replace with the actual ENS contract address
const ensContract = new web3.eth.Contract(ensAbi, ensAddress);

const privateKey = 'YOUR_PRIVATE_KEY'; // Replace with your private key for the account claiming the ENS domain
const account = web3.eth.accounts.privateKeyToAccount(privateKey);
const fromAddress = account.address;

const domainName = 'yourdomain.eth'; // Replace with the domain name you want to claim

async function claimENS() {
  try {
    const tx = ensContract.methods.register(domainName, fromAddress);
    const encodedABI = tx.encodeABI();

    const gasPrice = await web3.eth.getGasPrice();
    const gasEstimate = await tx.estimateGas({ from: fromAddress });

    const signedTx = await web3.eth.accounts.signTransaction(
      {
        from: fromAddress,
        to: ensAddress,
        gas: gasEstimate,
        gasPrice: gasPrice,
        data: encodedABI,
        nonce: await web3.eth.getTransactionCount(fromAddress),
      },
      privateKey
    );

    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log('ENS domain claimed:', receipt);
  } catch (error) {
    console.error('Error claiming ENS domain:', error);
  }
}

claimENS();
