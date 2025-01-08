import "dotenv/config";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import bs58 from "bs58";
import { Program, Wallet, AnchorProvider } from "@coral-xyz/anchor";
import { IDL, Turbin3Prereq } from "./programs/Turbin3_prereq";

const wallet = process.env.PRIVATE_KEY as string;

const keypair = Keypair.fromSecretKey(Uint8Array.from(bs58.decode(wallet)));

const connection = new Connection("https://api.devnet.solana.com");
const github = Buffer.from("NishantCoder108", "utf8");
console.log("Github buffer:", github);

// Create Anchor Provider
const provider = new AnchorProvider(connection, new Wallet(keypair), {
    commitment: "confirmed",
});

console.log("Anchor Provider :", provider);

//Create Program
const program: Program<Turbin3Prereq> = new Program(IDL, provider);

console.log("Program :", program);

(async () => {
    try {
        const txhash = await program.methods
            .complete(github)
            .accounts({
                signer: keypair.publicKey,
            })
            .signers([keypair])
            .rpc();
        console.log(`Success! Check out your TX here:
    https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
    } catch (e) {
        console.error(`Oops, something went wrong: ${e}`);
    }
})();

// https://explorer.solana.com/tx/5PWXRvDuAJcuEr8jnJ1iZztGmuZ92qbJBWgJmgtCwdLdGtLR6xTxAEwc7fNBmRPkaQnMM6gMVFh6W95bf3tjPZPa?cluster=devnet
