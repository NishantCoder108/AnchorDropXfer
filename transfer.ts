import "dotenv/config";
import {
    Transaction,
    SystemProgram,
    Connection,
    Keypair,
    LAMPORTS_PER_SOL,
    sendAndConfirmTransaction,
    PublicKey,
} from "@solana/web3.js";
import bs58 from "bs58";
// import wallet from "./dev-wallet.json";

const wallet = process.env.PRIVATE_KEY as string; //turbin3 wallet ,private key
console.log("Wallet: ", wallet);
const from = Keypair.fromSecretKey(Uint8Array.from(bs58.decode(wallet)));

/*
Turbin3 class,Public Key: GLtaTaYiTQrgz411iPJD79rsoee59HhEy18rtRdrhEUJ
*/

const to = new PublicKey("GLtaTaYiTQrgz411iPJD79rsoee59HhEy18rtRdrhEUJ");

const connection = new Connection("https://api.devnet.solana.com");

(async () => {
    try {
        // Balance of sender
        const balance = await connection.getBalance(from.publicKey);

        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: from.publicKey,
                toPubkey: to,
                lamports: 0.1 * LAMPORTS_PER_SOL, //10^9 lamports = 1 SOL
            })
        );

        transaction.recentBlockhash = (
            await connection.getLatestBlockhash("confirmed")
        ).blockhash;

        transaction.feePayer = from.publicKey;

        // Sign transaction, broadcast, and confirm

        const signature = await sendAndConfirmTransaction(
            connection,
            transaction,
            [from]
        );

        console.log(
            `Success! Check out TX here: https://explorer.solana.com/tx/${signature}?cluster=devnet`
        );
    } catch (error) {
        console.log(`Oops! Something went wrong: ${error}`);
    }
})();

// https://explorer.solana.com/tx/3yYWJhyyqqLhfm3UTMugvdVwvT7DozX4ivu5EXnU12AkyyZ36hWQgWqvP3dbshUqDzu95ctMve8FHt5sk6tg3LmB?cluster=devnet
// simulate
