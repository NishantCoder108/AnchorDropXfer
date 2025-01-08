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
import wallet from "./dev-wallet.json";

// const wallet = process.env.PRIVATE_KEY as string; //turbin3 wallet ,private key
// console.log("Wallet: ", wallet);
// const from = Keypair.fromSecretKey(Uint8Array.from(bs58.decode(wallet)));
const from = Keypair.fromSecretKey(new Uint8Array(wallet));
/*
Turbin3 class,Public Key: GLtaTaYiTQrgz411iPJD79rsoee59HhEy18rtRdrhEUJ
*/

const to = new PublicKey("HiMmuCbieNgDNFd9GbcbVSHYPGPuEgZWwQxJULaJVoVs");

const connection = new Connection("https://api.devnet.solana.com");

(async () => {
    try {
        // Balance of sender
        const balance = await connection.getBalance(from.publicKey);
        console.log("Balance: ", balance);

        // Get Tranasction Fee for all transactions of Solana
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: from.publicKey,
                toPubkey: to,
                lamports: balance, //10^9 lamports = 1 SOL
            })
        );

        transaction.recentBlockhash = (
            await connection.getLatestBlockhash("confirmed")
        ).blockhash;

        transaction.feePayer = from.publicKey;

        //Calculate the exact fee for the transaction

        const fee =
            (
                await connection.getFeeForMessage(
                    transaction.compileMessage(),
                    "confirmed"
                )
            ).value || 0;

        console.log("Fees :", fee);
        //Remove the latest instruction from the transaction
        transaction.instructions.pop();

        //Add the instruction again with the exact fee
        transaction.add(
            SystemProgram.transfer({
                fromPubkey: from.publicKey,
                toPubkey: to,
                lamports: balance - fee, //10^9 lamports = 1 SOL
            })
        );

        // transaction.recentBlockhash = (
        //     await connection.getLatestBlockhash("confirmed")
        // ).blockhash;

        // transaction.feePayer = from.publicKey;

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

/* https://explorer.solana.com/tx/3yYWJhyyqqLhfm3UTMugvdVwvT7DozX4ivu5EXnU12AkyyZ36hWQgWqvP3dbshUqDzu95ctMve8FHt5sk6tg3LmB?cluster=devnet
// simulate

Result after tx fess:
Balance:  2000000000
Success! Check out TX here: https://explorer.solana.com/tx/5QCeJcX8posyv2TFby2XihSoDmvVFaJhH7dDPJKT9o3y9vxgQDgx3pjk83nHf82Rir6vxA8vCHcqf35jbPcU3QQy?cluster=devnet
Done in 25.73s


*Result For Turbin Public `HiMmuCbieNgDNFd9GbcbVSHYPGPuEgZWwQxJULaJVoVs`:
Balance:  2000000000
Fees : 5000
Success! Check out TX here: https://explorer.solana.com/tx/9By2UqtMWSuYEwugm3u3d8KuzRxzaW5y8x2pm1ALWRAaYyN1H4yKtwBkrJ9AqGtjtaCzBWifHgjqyK77Z5qrsbk?cluster=devnet

PDA (Program Derived Address) = ProgramID +  Seed
IDL is same as ABI 

*/
