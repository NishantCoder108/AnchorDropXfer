import wallet from "./dev-wallet.json";
import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";

const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

const connection = new Connection("https://api.devnet.solana.com");

// Airdrop Tokens:
(async () => {
    try {
        const airdropSignature = await connection.requestAirdrop(
            keypair.publicKey,
            2 * LAMPORTS_PER_SOL
        );

        console.log(
            `Success! Check out TX here: https://explorer.solana.com/tx/${airdropSignature}?cluster=devnet`
        );
    } catch (error) {
        console.log(`Oops! Something went wrong: ${error}`);
    }
})();

// Getting Balances:
(async () => {
    const balance = await connection.getBalance(keypair.publicKey);
    console.log("Balance: ", balance);
})();

/*
Tx Signature : https://explorer.solana.com/tx/3rDDsgcC5dUmw277W69dxfVSyeRDRHwKYj4C6C65ecCUTPEpqRiUgAhSjpj4yhRB3CSfbpf5fkgPTpJRQvrvYhuV?cluster=devnet
*/
