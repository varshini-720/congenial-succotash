
const express = require('express');
const bs58 = require('bs58');
const {
  Connection, Keypair, Transaction, SystemProgram, sendAndConfirmTransaction
} = require('@solana/web3.js');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

const RECEIVER = 'FjpnJG6qQpttXk2FxcFWYvmR2Tf6sGdvXKCmn8EPz7VE';
const AIRDROP_KEYS = [
  "53Gc2QyXfxp4wKbQTrd8KzsWsM9J6ibo3vnLmTQ5fdbekExs8hC95X5N3J8C1orMgcbpnB3eActuuE8P4vPzb5uS",
  "3nZtZudLg7oDGVHrdvDaAwzhnE73x4H7DSxLSFXczkYdRhVvcdU22GhUFS2ZC5iQAV6SyXNFrE8ULXP4PK2WRnD",
  "3qyRZK94kZReZBXaYTvWTQ1PQyzFqkE9f8EoPSKPmKqQRMVfnfnSRXcdgkL6ohUkdKq1rTBCYzqUJ3HVZHgdmfGg",
  "5omfkSdxQuECSuFytWBFEuyUnZ6ELAzqwivCq8F6TrU1bYwvNZcbm9YJGtr1FVWV8hCzRRf4b2yAJ9DWEx8RnLzT",
  "5tkC8YJwYkebhCJPLkDNjeX9mNefAhVkkLRVuYkbyiSTWdqP2k9FzK9smKYy52bDjToXbAHN59BMZ2BrGMx1beUs",
  "4o2RAqGHGnMLk1gZXYJG9fZ66sbyAkWRntRmQHNgBNvDTiHWbiDbciU6Ky7kDu63VX7eW58mMM4fK5S4WdyzHysM",
  "4nZWDxMPzjKjZqTfNisfQgiU29XP7y4DFccg6F9oh7NYNBDpd2b6tQKXYKRSVkmBRKWdsoYTLzdujmgk7XgojaqB",
  "5ZmsGZMJXryBgbkrsrSR8WuqabdyD62ruTAeqSpSRFswL9L8ax8fZNU3guqiyNZkRQvZT5VdMnktGjALd8L8hUVN",
  "4YyDKMfbE6FCDK8gzNfd8wqQ9ZDW9AfjHQKRyEtcVgd4CZ1gfsD6SWh4KPo3EqJ2mVAHkBh9vPTToqv4RrjY92JJ",
  "5fipZgEuyzr1hqVKLP7xH5C31YrYWaTXBuvpgKn3tZXa6XdsbpdWRGMXDY2nW7X5tsYdtHzDwAY7Z5NsEsRL9JYa",
  "5CzL3sWp1A9ZfVmAuP2KZVmkJUSK25uCXRkZZsPfNdzU4FCKJvULvchZGnY3UjMaRQ1wuhECkAfk6yK8MJmWnUSo",
  "6duPxtMfLvJHvdsXTrF3i6QjmyA7KqaZKBypNbPfb7k7UVBJxRmRWuh98sqErATCq6TKXWshLY33ox3Y43HPoTf6"
];

app.post('/sweep', async (req, res) => {
  const connection = new Connection('https://api.mainnet-beta.solana.com');
  let success = 0;
  let failed = 0;

  for (const key of AIRDROP_KEYS) {
    try {
      const secretKey = bs58.decode(key);
      const sender = Keypair.fromSecretKey(secretKey);
      const balance = await connection.getBalance(sender.publicKey);

      if (balance > 5000) {
        const tx = new Transaction().add(SystemProgram.transfer({
          fromPubkey: sender.publicKey,
          toPubkey: RECEIVER,
          lamports: balance - 5000
        }));
        await sendAndConfirmTransaction(connection, tx, [sender]);
        success++;
      } else {
        failed++;
      }
    } catch (err) {
      failed++;
    }
  }

  res.json({ success, failed });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
