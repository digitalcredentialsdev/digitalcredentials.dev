---
sidebar_position: 5
title: "Credential Formats"
---

## SD-JWT VC

SD-JWT VC (Selective Disclosure JSON Web Token Verifiable Credentials) represents the Internet Engineering Task Force's approach to verifiable credentials, building upon the familiar JWT infrastructure while adding selective disclosure capabilities.

### Architecture and Design

SD-JWT VC extends standard JWTs with selective disclosure functionality, allowing fine-grained control over which claims are revealed during presentation. The format maintains compatibility with existing JWT ecosystems while adding privacy-preserving features essential for credential use cases.
The credential structure separates always-disclosed claims from selectively-disclosable claims, using cryptographic commitments to ensure integrity while enabling privacy. This approach allows holders to prove possession of credentials without revealing unnecessary personal information.

### Key Features

**JWT Compatibility**: Leverages existing JWT infrastructure and tooling, reducing implementation complexity for developers already familiar with JWT ecosystems.

**Granular Selective Disclosure**: Enables claim-level selective disclosure, allowing holders to reveal only specific attributes required for each interaction.

**Hash-Based Privacy**: Uses cryptographic hash commitments to ensure claim integrity while maintaining privacy through selective revelation.

**Simplified Verification**: Maintains JWT's straightforward verification model while adding selective disclosure validation.

### Technical Implementation

SD-JWT VCs consist of multiple components: the main JWT containing always-disclosed claims, selective disclosure tokens for individual claims, and optional holder binding. The format uses salt values and hash commitments to enable selective disclosure while maintaining cryptographic integrity.

## W3C Verifiable Credentials

## ISO 18013-5 mdoc

ISO 18013-5 mobile documents (mdocs) represent the international standard for mobile driver's licenses and identity documents, designed specifically for government-issued identity credentials with strong security and privacy requirements.

### Architecture and Standards

Developed as part of the ISO 18013 series, mdocs provide a comprehensive framework for mobile identity documents that can be used both online and offline. The standard defines not just the credential format but also the entire ecosystem including issuance, storage, and presentation protocols.

The mdoc format uses CBOR (Concise Binary Object Representation) for efficient data encoding and COSE (CBOR Object Signing and Encryption) for cryptographic operations, optimizing for mobile device constraints and offline usage scenarios.

### Key Features

**Offline Capability**: Designed to function without network connectivity, essential for identity document use cases where internet access may be unavailable.

**Government Focus**: Specifically architected for high-assurance government identity documents with rigorous security requirements.

**Age Verification**: Includes built-in age verification capabilities without revealing actual birthdates, addressing common privacy concerns in identity verification.

**Biometric Integration**: Supports integration with biometric authentication systems for enhanced security.

### Technical Implementation

mdocs use a CBOR-based structure with COSE signatures for cryptographic protection. The format supports both device-bound credentials and various presentation methods including QR codes, NFC, and direct device-to-device communication. The standard includes detailed specifications for security modules and tamper-resistant storage.

## Comparison

### Data Encoding and Structure

W3C VCs utilize JSON-LD for rich semantic expression, enabling complex relationships and contexts but potentially increasing payload size. The format prioritizes flexibility and interoperability across diverse domains.

SD-JWT VC employs standard JSON within JWT structures, providing familiar developer experience and broad tooling support while maintaining compact representations suitable for web applications.

ISO mdocs use CBOR encoding for maximum efficiency and compact representation, essential for mobile and offline scenarios where bandwidth and storage are constraints.

### Privacy and Selective Disclosure

W3C VCs offer multiple privacy approaches including BBS+ signatures for selective disclosure and zero-knowledge proofs for advanced privacy preservation, though implementation complexity varies.

SD-JWT VC provides built-in selective disclosure at the claim level through hash-based commitments, offering straightforward privacy controls with moderate implementation complexity.

ISO mdocs include selective disclosure capabilities optimized for identity document use cases, with particular strength in age verification without birthdate revelation.
