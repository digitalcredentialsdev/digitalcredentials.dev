---
sidebar_position: 3
title: "Credential Issuance"
---

Issuance is the process by which a trusted authority creates a verifiable digital credential and provides it to a holder.

In the [three-party model](/docs/concepts/three-party-model), the **issuer** is the entity that asserts claims about a subject and produces a cryptographically signed credential attesting to those claims.
An issuer might be a government agency issuing a mobile driving license, a university issuing a digital diploma, or an employer issuing a proof of employment.

## What happens during issuance

Issuance involves several steps that together produce a credential the holder can store and later present to verifiers.
The specific implementation varies across ecosystems, but the general shape is consistent.

### Claim verification

Before issuing a credential, the issuer establishes that the claims it will attest to are accurate.
How this happens depends on the type of credential.
A government agency might verify identity through an in-person visit or an existing identity proofing process.
A university confirms that a student has completed a degree program.
An employer checks employment records.
The rigor of this step directly affects the trustworthiness of the resulting credential, and some ecosystems may require certification of issuers.

### Credential construction

The issuer assembles the credential data, the claims about the subject, metadata such as expiration dates, credential type, visual display data like logos and colors, and any information needed for later status checks.
The structure and encoding of this data depend on the [credential format](/docs/concepts/credential-formats) in use.

### Cryptographic signing

The issuer signs the assembled credential using its private key.
This signature serves two purposes: it binds the credential to the issuer's identity, and it protects the integrity of the credential data.
Any modification to the credential after signing will invalidate the signature, allowing verifiers to detect tampering.

Different credential formats use different signature schemes.
Some use JSON Web Signatures, others use schemes designed for selective disclosure such as BBS signatures, and others use the CBOR Object Signing and Encryption (COSE) framework. The choice of signature scheme affects what privacy features the credential can support.

### Delivery to the holder

Once signed, the credential is delivered to the holder for storage in their credential manager.
The delivery mechanism varies: it might happen over a direct protocol exchange in the credential manager, through a web browser ("Save to my wallet"), or even via an emailed download link.
What matters is that the holder ends up with a copy of the credential that they control and can present independently of the issuer.

## The role of the issuer

An issuer is any entity that is authoritative for a set of claims and is willing to attest to them in the form of a signed credential.
In practice, issuers are typically organizations: government agencies, educational institutions, healthcare providers, employers, or financial institutions.

### Responsibilities

The issuer has several key responsibilities in the credential ecosystem.

**Ensure claim accuracy.**
The issuer is responsible for verifying that the claims in a credential are correct at the time of issuance.
A credential is only as trustworthy as the process the issuer uses to validate the underlying data.
An issuer that rubber-stamps claims without verification undermines the entire trust model.

**Protect signing keys.**
The issuer's private key is the root of trust for every credential it issues.
If the key is compromised, an attacker could forge credentials that appear legitimate.
Issuers must use appropriate key management practices, such as hardware security modules, key rotation policies, and access controls, commensurate with the sensitivity of the credentials they issue.

**Publish verification material.**
For verifiers to validate a credential's signature, they need access to the issuer's public key or verification method.
Issuers are responsible for making this material available, whether through a well-known endpoint, a DID document, a registry, or another discovery mechanism.
Without it, verifiers cannot confirm that a credential is genuine.

**Manage credential status.**
Credentials sometimes need to be revoked or suspended after issuance.
For example, a license may be suspended, an employee may leave an organization, or a credential may have been issued in error.
The issuer is responsible for maintaining a mechanism that allows verifiers to check whether a credential is still valid.
Common approaches include status lists and revocation registries.

**Define credential terms.**
The issuer determines the structure, claims, and validity period of the credentials it issues.
These decisions shape what verifiers can rely on and what holders can present.
Clear, well-documented credential schemas help verifiers understand what a credential contains and how to interpret it.

### What an issuer is not

Once the credential is delivered to the holder's credential manager, the holder decides which verifiers to present it to and under what circumstances.
The issuer also does not participate in the presentation or verification process: the credential is designed to be verifiable without contacting the issuer in real time.

This separation is a key design principle.
It protects holder privacy by preventing the issuer from tracking where and when credentials are used, and it allows the system to function even when the issuer is offline.

:::note

While issuers do not participate in real-time transactions, usage constraints may still be governed by trust frameworks or issuer policies.
These rules, such as restrictions on which verifiers are "trusted" or which attributes may be shared, are established via governance or metadata, independent of the presentation ceremony itself.

:::

## Trust and issuer authority

A credential's value depends on whether verifiers trust the entity that issued it.
A cryptographically valid credential from an unrecognized issuer is technically sound but practically useless.

**Authoritative issuers.**
In most ecosystems, certain entities are recognized as authoritative for specific types of claims.
A government is authoritative for identity documents. A university is authoritative for academic degrees.
Trust is rooted in the real-world authority of the issuing organization, not just in cryptographic validity.

**Trust registries.** Some ecosystems maintain registries that list recognized issuers and the credential types they are authorized to issue.
Verifiers consult these registries to determine whether to accept a credential.
This creates a structured trust framework that scales beyond bilateral relationships.

**Decentralized trust.**
In other models, trust is established through reputation, peer endorsement, or direct relationships between issuers and verifiers.
These models are more flexible but may be harder for verifiers to evaluate, especially when encountering an issuer for the first time.

## Privacy considerations

Issuance decisions have downstream privacy implications for holders.

**Minimal disclosure by design.**
Issuers should consider what claims are truly necessary in a credential.
Including more data than needed increases the holder's exposure when presenting the credential, especially in formats that do not support selective disclosure.

**Selective disclosure support.**
Credential formats that support selective disclosure allow holders to reveal only specific claims from a credential during presentation.
Issuers that choose formats and signature schemes supporting this capability give holders more control over their personal data.

**Issuer unlinkability.**
The issuance process should not create mechanisms that allow the issuer to track the holder's subsequent use of the credential.
This means avoiding callback URLs, phone-home mechanisms, or unique identifiers that the issuer could use to correlate presentations.
