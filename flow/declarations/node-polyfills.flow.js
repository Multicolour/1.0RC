// @flow

import type {
  SecureContext
} from "https"

declare type https$PFXObject = {
  buf: string | Buffer,
  passphrase ? : string,
}

declare type https$PEMObject = {
  pem: string | Buffer,
  passphrase ? : string,
}

declare type https$HTTPSOptions = {
  /**
   * Optional name of an OpenSSL engine which can provide the client certificate.
   */
  clientCertEngine ? : string,

  /**
   * Abort the connection if the SSL/TLS handshake does not finish in the
   * specified number of milliseconds. Defaults to 120 seconds.
   * A 'tlsClientError' is emitted on the tls.Server object whenever a handshake times out.
   */
  handshakeTimeout ? : number,

  /**
   * If true the server will request a certificate from clients that
   * connect and attempt to verify that certificate. Defaults to false.
   */
  requestCert ? : boolean,

  /**
   * If not false the server will reject any connection which is not authorized
   * with the list of supplied CAs. This option only has an effect if
   * requestCert is true. Defaults to true.
   */
  rejectUnauthorized ? : boolean,

  /**
   * <string[]> | <Buffer[]> | <Uint8Array[]> | <Buffer> | <Uint8Array>
   * An array of strings, Buffers or Uint8Arrays, or a single Buffer or
   * Uint8Array containing supported NPN protocols. Buffers should have 
   * the format [len][name][len][name]... e.g. 0x05hello0x05world, where 
   * the first byte is the length of the next protocol name. Passing an 
   * array is usually much simpler, e.g. ['hello', 'world']. 
   * (Protocols should be ordered by their priority.)
   */
  NPNProtocols ? : Array < string > | Array < Buffer > | Array < Uint8Array > | Buffer | Uint8Array,

  /**
   * An array of strings, Buffers or Uint8Arrays, or a single Buffer or 
   * Uint8Array containing the supported ALPN protocols. Buffers should 
   * have the format [len][name][len][name]... e.g. 0x05hello0x05world, 
   * where the first byte is the length of the next protocol name. 
   * Passing an array is usually much simpler, e.g. ['hello', 'world']. 
   * (Protocols should be ordered by their priority.) When the server 
   * receives both NPN and ALPN extensions from the client, ALPN takes 
   * precedence over NPN and the server does not send an NPN extension to the client.
   */
  ALPNProtocols ? : Array < string > | Array < Buffer > | Array < Uint8Array > | Buffer | Uint8Array,

  /**
   * A function that will be called if the client supports SNI TLS extension.
   * Two arguments will be passed when called: servername and cb. SNICallback
   * should invoke cb(null, ctx), where ctx is a SecureContext instance. 
   * (tls.createSecureContext(...) can be used to get a proper SecureContext.)
   * If SNICallback wasn't provided the default callback with high-level API will be used (see below).
   */
  SNICallback ? : (servername: string, cb: SecureContext) => void,

  /**
   * An integer specifying the number of seconds after which the TLS session identifiers
   * and TLS session tickets created by the server will time out. See SSL_CTX_set_timeout for more details.
   */
  sessionTimeout ? : number,

  /**
   * A 48-byte Buffer instance consisting of a 16-byte prefix, a 16-byte HMAC key, and a 16-byte AES key.
   * This can be used to accept TLS session tickets on multiple instances of the TLS server.
   */
  ticketKeys ? : Buffer < 48 > ,

  /**
   * Optional PFX or PKCS12 encoded private key and certificate chain. 
   * pfx is an alternative to providing key and cert individually. 
   * PFX is usually encrypted, if it is, passphrase will be used to decrypt it. 
   * Multiple PFX can be provided either as an array of unencrypted PFX buffers, 
   * or an array of objects in the form {buf: <string|buffer>[, passphrase: <string>]}. 
   * The object form can only occur in an array. object.passphrase is optional. 
   * Encrypted PFX will be decrypted with object.passphrase if provided, or options.passphrase if it is not.
   */
  pfx ? : Array < string > | Array < Buffer > | Array < https$PFXObject > | string | Buffer,

  /**
   * Optional private keys in PEM format. PEM allows the option of private keys being encrypted.
   * Encrypted keys will be decrypted with options.passphrase. Multiple keys using different 
   * algorithms can be provided either as an array of unencrypted key strings or buffers, 
   * or an array of objects in the form {pem: <string|buffer>[, passphrase: <string>]}. 
   * The object form can only occur in an array. object.passphrase is optional. Encrypted 
   * keys will be decrypted with object.passphrase if provided, or options.passphrase if it is not.
   */
  key ? : Array < string > | Array < Buffer > | Array < https$PEMObject > | string | Buffer,

  /**
   * Optional shared passphrase used for a single private key and/or a PFX.
   */
  passphrase ? : string,

  /**
   * Optional cert chains in PEM format. One cert chain should be provided per private key. 
   * Each cert chain should consist of the PEM formatted certificate for a provided private key, 
   * followed by the PEM formatted intermediate certificates (if any), in order, and not including 
   * the root CA (the root CA must be pre-known to the peer, see ca). When providing multiple 
   * cert chains, they do not have to be in the same order as their private keys in key. 
   * If the intermediate certificates are not provided, the peer will not be able to 
   * validate the certificate, and the handshake will fail.
   */
  cert ? : Array < string > | Array < Buffer > | string | Buffer,

  /**
   * Optionally override the trusted CA certificates. Default is to trust the well-known 
   * CAs curated by Mozilla. Mozilla's CAs are completely replaced when CAs are explicitly 
   * specified using this option. The value can be a string or Buffer, or an Array of 
   * strings and/or Buffers. Any string or Buffer can contain multiple PEM CAs concatenated 
   * together. The peer's certificate must be chainable to a CA trusted by the server for 
   * the connection to be authenticated. When using certificates that are not chainable 
   * to a well-known CA, the certificate's CA must be explicitly specified as a trusted or 
   * the connection will fail to authenticate. If the peer uses a certificate that doesn't 
   * match or chain to one of the default CAs, use the ca option to provide a CA certificate 
   * that the peer's certificate can match or chain to. For self-signed certificates, 
   * the certificate is its own CA, and must be provided.
   */
  ca ? : Array < string > | Array < Buffer > | string | Buffer,

  /**
   * Optional cipher suite specification, replacing the default. For more information, see 
   * modifying the default cipher suite.
   */
  ciphers ? : string,

  /**
   * Attempt to use the server's cipher suite preferences instead of the client's. When true, 
   * causes SSL_OP_CIPHER_SERVER_PREFERENCE to be set in secureOptions, see OpenSSL Options for more information.
   */
  honorCipherOrder ? : boolean,

  /**
   * A string describing a named curve or a colon separated list of curve NIDs or names,
   * for example P-521:P-384:P-256, to use for ECDH key agreement, or false to disable ECDH.
   * Set to auto to select the curve automatically. Defaults to tls.DEFAULT_ECDH_CURVE.
   * Use crypto.getCurves() to obtain a list of available curve names. On recent releases, 
   * openssl ecparam -list_curves will also display the name and description of each available elliptic curve.
   */
  ecdhCurve ? : string,

  /**
   * Optional name of an OpenSSL engine which can provide the client certificate.
   */
  clientCertEngine ? : string,

  /**
   * Optional PEM formatted CRLs (Certificate Revocation Lists).
   */
  crl ? : Array < string > | Array < Buffer > | string | Buffer,

  /**
   * Diffie Hellman parameters, required for Perfect Forward Secrecy. 
   * Use openssl dhparam to create the parameters. The key length must be greater than 
   * or equal to 1024 bits, otherwise an error will be thrown. It is strongly recommended 
   * to use 2048 bits or larger for stronger security. If omitted or invalid, the 
   * parameters are silently discarded and DHE ciphers will not be available.
   */
  dhparam ? : string | Buffer,

  /**
   * Optionally affect the OpenSSL protocol behavior, which is not usually necessary. 
   * This should be used carefully if at all! Value is a numeric bitmask of the SSL_OP_* options from OpenSSL Options.
   */
  secureOptions ? : number,

  /**
   * Optional SSL method to use, default is "SSLv23_method". The possible values are listed as 
   * SSL_METHODS, use the function names as strings. For example, "SSLv3_method" to force SSL version 3.
   */
  secureProtocol ? : string,

  /**
   * Optional opaque identifier used by servers to ensure session state is not shared between applications. 
   * Unused by clients.
   */
  sessionIdContext ? : string,
}
