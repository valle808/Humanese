import 'dart:convert';
import 'dart:typed_data';
import 'package:encrypt/encrypt.dart' as encrypt;
import 'package:pointycastle/asymmetric/api.dart'; // RSA/ECC

/// Encryption Service
/// Handles symmetric encryption (AES-GCM) for data storage
/// and asymmetric encryption (ECC/RSA) for key exchange.
class EncryptionService {
  /// Generates a random AES key
  static String generateKey() {
    final key = encrypt.Key.fromSecureRandom(32);
    return base64Encode(key.bytes);
  }

  /// Encrypts data using AES-GCM
  static String encryptData(String data, String keyString) {
    final key = encrypt.Key.fromBase64(keyString);
    final iv = encrypt.IV.fromSecureRandom(12); // GCM standard IV size
    final encrypter = encrypt.Encrypter(encrypt.AES(key, mode: encrypt.AESMode.gcm));

    final encrypted = encrypter.encrypt(data, iv: iv);
    
    // Combine IV and Ciphertext for storage
    return '${base64Encode(iv.bytes)}:${encrypted.base64}';
  }

  /// Decrypts data using AES-GCM
  static String decryptData(String encryptedData, String keyString) {
    final parts = encryptedData.split(':');
    if (parts.length != 2) throw Exception('Invalid encrypted data format');

    final iv = encrypt.IV.fromBase64(parts[0]);
    final ciphertext = parts[1];
    final key = encrypt.Key.fromBase64(keyString);
    final encrypter = encrypt.Encrypter(encrypt.AES(key, mode: encrypt.AESMode.gcm));

    return encrypter.decrypt64(ciphertext, iv: iv);
  }

  // TODO: Add ECDH (SEA) Key Exchange logic for sharing AES keys
}

// Developed By Sergio Valle Bastidas | valle808@hawaii.edu | @Gi0metrics

