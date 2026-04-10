---
sidebar_position: 3
title: "Credential Verification"
---

Verification is the process by which a party determines whether a verifiable digital credential is authentic, unaltered, and suitable for a given use.
It is one of the three core operations in the credential lifecycle, alongside [issuance](/docs/concepts/issuance), and presentation.

In the [three-party model](/docs/concepts/three-party-model), the **verifier** is the entity that receives a credential presentation and evaluates it.
A verifier might be a website checking a user's age, an employer confirming a professional license, or a store requesting a loyalty card.

## What happens during verification

When a holder presents a credential, the verifier performs a series of checks to determine whether the presentation is trustworthy.
At a high level, these checks fall into a few categories.

### Authenticity

The verifier confirms that the credential was issued by a known, trusted issuer and that the cryptographic signature over the credential is valid.
This ensures the credential has not been fabricated by an unauthorized party.

### Integrity

The verifier checks that the credential data has not been modified since the issuer signed it.
Verifiable digital credentials use cryptographic signatures that are invalidated by any change to the signed content, no matter how small.
If a single field has been altered, the signature check fails.

### Currency

The verifier evaluates whether the credential is still valid at the time of presentation.
This may involve checking expiration dates embedded in the credential, and depending on the ecosystem, querying an external service to determine if the credential has been revoked or suspended by the issuer.

### Holder binding

The verifier confirms that the entity presenting the credential is the same entity the credential was issued to.
This is typically accomplished through a cryptographic proof: the holder demonstrates control of a private key that is bound to the credential.
Without this step, a stolen or forwarded credential could be used by someone other than the intended subject.

## The role of the verifier

A verifier is any entity that needs to confirm a claim about a person or organization.
In practice, verifiers are typically applications or services: a website, a point-of-sale terminal, a mobile app, or a backend system.

### Responsibilities

The verifier has several key responsibilities in the verifiable digital credentials ecosystem.

**Define what credentials are acceptable.**
Before requesting a presentation, the verifier determines which types of credentials satisfy its requirements and which issuers it trusts.
For example, an age-restricted service might accept a mobile driving license from any government issuer but not a self-issued credential.

**Request only what is needed.**
A well-behaved verifier requests the minimum set of claims necessary for the transaction at hand.
If the verifier only needs to confirm that a user is over 18, it should not request the user's full name, address, or even date of birth.
[Credential formats](/docs/concepts/credential-formats) that support selective disclosure make this possible at a technical level, but it remains the verifier's responsibility to limit its requests.

**Validate the presentation.**
Once the verifier receives a presentation, it performs the authenticity, integrity, currency, and holder binding checks described above.
These checks are largely mechanical and are typically handled by a verification library or service rather than implemented from scratch.

**Make a trust decision.**
Verification tells the verifier whether a credential is technically valid: that the signatures check out, the credential hasn't expired, and so on.
But the verifier must still decide whether it *trusts* the result.
This is a policy decision.
A credential might be cryptographically valid but issued by an entity the verifier doesn't recognize or doesn't consider authoritative for the claims in question.

### What a verifier is not

A verifier does not issue credentials.
It does not store credentials on behalf of the holder.
And in most architectures, the verifier does not need to contact the issuer at the time of verification, the credential itself contains everything needed to validate the issuer's signature.
This is a key difference from federated identity models, where the relying party typically calls back to the identity provider in real time.

## Verification and the Digital Credentials API

When verification happens on the web, the [Digital Credentials API](https://www.w3.org/TR/digital-credentials/) provides a standardized way for a website (the verifier) to request a credential presentation from the user's credential manager through the OS and browser.

The API handles the interaction between the verifier's web application and the user's credential manager (via the operating system).
The verifier constructs a request describing what credential data it needs, the browser and OS mediates the interaction with the user and their credential manager, and the credential manager returns a presentation that the verifier can then validate.

This flow keeps the verifier from interacting directly with the credential manager application, preserving user privacy and giving the operating system and browser a role in ensuring informed consent.

## Trust models

Verification doesn't happen in a vacuum. For a verifier to accept a credential, it needs to trust the issuer that created it.
How that trust is established varies across ecosystems.

**Issuer registries.**
Some ecosystems maintain public lists of trusted issuers.
A verifier checks the credential's issuer identifier against a registry to determine whether the issuer is recognized and authorized to issue that type of credential.

**Certificate chains.**
In some architectures, issuer keys are certified by a higher-level authority, similar to how TLS certificates work.
The verifier traces the chain of trust from the credential's signing key up to a root authority it already trusts.

**Direct configuration.**
In simpler deployments, the verifier might be configured with a static list of trusted issuer keys or identifiers.
This is common in closed ecosystems where the set of issuers is small and stable.

Regardless of the trust model, the verifier is ultimately responsible for deciding which issuers it accepts.
This is a business and policy decision, not a purely technical one.

## Privacy considerations

Verification has direct privacy implications for the credential holder.
A few principles guide responsible verifier behavior.

**Data minimization.**
Verifiers should request only the claims they need.
Requesting a full credential when a single attribute would suffice exposes the holder to unnecessary data collection.

**Selective disclosure.**
Credential formats and protocols that support selective disclosure allow the holder (or their credential manager) to reveal only the requested claims from a credential, rather than the entire document.
Verifiers should prefer protocols that support this capability.

**Unlinkability.**
In some protocols, repeated presentations of the same credential to different verifiers (or to the same verifier over time) can be correlated.
Verifiers should be aware of whether the protocols they use allow or prevent such tracking.

**No phone-home.**
The verification process should not require the verifier to contact the issuer in real time, as this would reveal to the issuer when and where the holder is using the credential.
Status checks (such as revocation lookups) should use privacy-preserving mechanisms where possible, such as status lists that can be fetched without identifying the specific credential being checked.
