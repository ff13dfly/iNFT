const { Connection, PublicKey, Account, Transaction, SystemProgram, sendAndConfirmTransaction } = require("@solana/web3.js");

// Connect to the Solana network
const connection = new Connection("https://api.devnet.solana.com");

// Public key of the signer
const signerPublicKey = new PublicKey("DvArGHBtA9b9dSC3Kx29XPqvn486D9dPp9mpkkdQzqHY");

// Function to create a new account if it doesn"t exist
async function createAccountIfNeeded() {
    // Check if the account exists
    const accountInfo = await connection.getAccountInfo(signerPublicKey);
    if (accountInfo === null) {
        // Account doesn"t exist, create a new one
        const newAccount = new Account();
        const transaction = SystemProgram.createAccount({
            fromPubkey: signerPublicKey,
            newAccountPubkey: newAccount.publicKey,
            lamports: 1000000, // Adjust the lamports as needed
            space: 1024, // Adjust the space as needed
            programId: new PublicKey("11111111111111111111111111111111"), // Replace with the program ID
        });

        // Send and confirm the transaction
        await sendAndConfirmTransaction(connection, transaction, [newAccount]);
        console.log("New account created:", newAccount.publicKey.toBase58());
    }
}

// Function to write JSON data to the account
async function writeToAccount() {
    try {
        // Create the data to write
        const jsonData = "{"hello":"great world"}";
        const dataBuffer = Buffer.from(jsonData, "utf-8");

        // Create a transaction to write data to the account
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: signerPublicKey,
                toPubkey: signerPublicKey, // Writing to the same account
                lamports: 0, // No lamports transferred
            }),
            SystemProgram.transfer({
                fromPubkey: signerPublicKey,
                toPubkey: signerPublicKey, // Writing to the same account
                lamports: 0, // No lamports transferred
                data: dataBuffer,
            })
        );

        // Sign and send the transaction
        const signature = await connection.sendTransaction(transaction, [new Account()]);
        await connection.confirmTransaction(signature);

        console.log("Data written to account:", jsonData);
    } catch (error) {
        console.error("Error writing data to account:", error);
    }
}

// Call the functions
createAccountIfNeeded().then(writeToAccount);