// import CryptoJs from 'crypto-js';

async function generateKey() {
    return await window.crypto.subtle.generateKey(
        {
            name: "AES-GCM",
            length: 256
        },
        true,
        ["encrypt", "decrypt"]
    );
}

async function encryptToken(token, key) {
    const encodedToken = new TextEncoder().encode(token);
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encryptedToken = await window.crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv
        },
        key,
        encodedToken
    );

    const encryptedTokenArray = new Uint8Array(encryptedToken);
    const resultArray = new Uint8Array(iv.length + encryptedTokenArray.length);
    resultArray.set(iv, 0);
    resultArray.set(encryptedTokenArray, iv.length);

    return btoa(String.fromCharCode.apply(null, resultArray));
}

async function decryptToken(encryptedToken, key) {
    const encryptedTokenArray = new Uint8Array(atob(encryptedToken).split('').map(char => char.charCodeAt(0)));
    const iv = encryptedTokenArray.slice(0, 12);
    const data = encryptedTokenArray.slice(12);

    const decryptedToken = await window.crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: iv
        },
        key,
        data
    );

    return new TextDecoder().decode(decryptedToken);
}

module.exports = {
    decryptToken,
    generateKey,
    encryptToken
};
