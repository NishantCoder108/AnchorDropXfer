import bs58 from "bs58";
import prompt from "prompt-sync";

const promptSync = prompt();

function base58ToWallet() {
    const base58 = promptSync("Enter base58 String: ");

    try {
        const wallet = bs58.decode(base58);
        console.log("Wallet: ", wallet);
    } catch (error) {
        console.log("Invalid base58 string");
    }
}
base58ToWallet();

function walletToBase58() {
    const wallet = promptSync("Enter wallet : ");
    // const wallet = "[ 72, 105,  32, 78, 105, 115, 104, 97, 110, 116 ]";

    try {
        const parsedWallet = JSON.parse(wallet);
        console.log("Parsed Wallet:", parsedWallet);

        let fromWallet;
        if (Array.isArray(parsedWallet)) {
            fromWallet = parsedWallet.map((x) => parseInt(x));
        } else {
            fromWallet = parsedWallet
                .split(",")
                .map((x: string) => parseInt(x.trim()));
        }

        // const base58Encode = bs58.encode(new Uint8Array( [
        //     72, 105,  32, 78,
        //    105, 115, 104, 97,
        //    110, 116
        //  ]));
        const base58Encode = bs58.encode(Uint8Array.from(fromWallet));
        console.log("Wallet: ", base58Encode.toString());
    } catch (error) {
        console.log("Invalid wallet");
    }
}
walletToBase58();
