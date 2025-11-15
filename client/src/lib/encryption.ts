/**
 * End-to-End Encryption Service
 * Uses Web Crypto API for secure encryption/decryption
 */

export interface EncryptedData {
  encryptedData: string;
  iv: string;
}

export interface KeyPair {
  publicKey: string;
  privateKey: string;
}

/**
 * Generate a random encryption key
 */
export async function generateEncryptionKey(): Promise<CryptoKey> {
  return await crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );
}

/**
 * Generate RSA key pair for device authentication
 */
export async function generateKeyPair(): Promise<KeyPair> {
  const keyPair = await crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
  );

  const publicKey = await crypto.subtle.exportKey("spki", keyPair.publicKey);
  const privateKey = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey);

  return {
    publicKey: arrayBufferToBase64(publicKey),
    privateKey: arrayBufferToBase64(privateKey),
  };
}

/**
 * Derive encryption key from password
 */
export async function deriveKeyFromPassword(
  password: string,
  salt: string
): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const passwordKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits", "deriveKey"]
  );

  return await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: base64ToArrayBuffer(salt),
      iterations: 100000,
      hash: "SHA-256",
    },
    passwordKey,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}

/**
 * Generate random salt for key derivation
 */
export function generateSalt(): string {
  const salt = new Uint8Array(16);
  crypto.getRandomValues(salt);
  return arrayBufferToBase64(salt.buffer);
}

/**
 * Encrypt data with AES-GCM
 */
export async function encryptData(
  data: string,
  key: CryptoKey
): Promise<EncryptedData> {
  const encoder = new TextEncoder();
  const iv = new Uint8Array(12);
  crypto.getRandomValues(iv);

  const encryptedBuffer = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    encoder.encode(data)
  );

  return {
    encryptedData: arrayBufferToBase64(encryptedBuffer),
    iv: arrayBufferToBase64(iv.buffer),
  };
}

/**
 * Decrypt data with AES-GCM
 */
export async function decryptData(
  encryptedData: string,
  iv: string,
  key: CryptoKey
): Promise<string> {
  const decoder = new TextDecoder();
  const ivBuffer = base64ToArrayBuffer(iv);
  const dataBuffer = base64ToArrayBuffer(encryptedData);

  const decryptedBuffer = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: ivBuffer,
    },
    key,
    dataBuffer
  );

  return decoder.decode(decryptedBuffer);
}

/**
 * Export key to base64 string
 */
export async function exportKey(key: CryptoKey): Promise<string> {
  const exported = await crypto.subtle.exportKey("raw", key);
  return arrayBufferToBase64(exported);
}

/**
 * Import key from base64 string
 */
export async function importKey(keyString: string): Promise<CryptoKey> {
  return await crypto.subtle.importKey(
    "raw",
    base64ToArrayBuffer(keyString),
    "AES-GCM",
    true,
    ["encrypt", "decrypt"]
  );
}

/**
 * Generate unique device ID
 */
export function generateDeviceId(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

/**
 * Get or create device ID from localStorage
 */
export function getDeviceId(): string {
  let deviceId = localStorage.getItem("copacl_device_id");
  if (!deviceId) {
    deviceId = generateDeviceId();
    localStorage.setItem("copacl_device_id", deviceId);
  }
  return deviceId;
}

/**
 * Store encryption key securely in localStorage
 */
export function storeEncryptionKey(key: string): void {
  localStorage.setItem("copacl_encryption_key", key);
}

/**
 * Retrieve encryption key from localStorage
 */
export function getStoredEncryptionKey(): string | null {
  return localStorage.getItem("copacl_encryption_key");
}

/**
 * Clear all encryption keys
 */
export function clearEncryptionKeys(): void {
  localStorage.removeItem("copacl_encryption_key");
  localStorage.removeItem("copacl_device_id");
}

// Helper functions
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}
