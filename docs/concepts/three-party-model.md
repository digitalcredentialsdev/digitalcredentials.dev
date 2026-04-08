---
sidebar_position: 2
title: "Three Party Model"
---

The **three-party model**, also known as the **Issuer-Holder-Verifier** (IHV) model or "triangle of trust", is the foundational architecture behind verifiable digital credentials.
It describes how credentials are issued, held, and verified across three distinct roles, without requiring direct communication between the issuer and verifier at the time of verification.

This model represents a deliberate departure from traditional, two party federated identity systems, which can improve privacy and reliability.

## The three roles

### Issuer

The **issuer** is the entity that makes claims about a subject and creates a verifiable digital credential containing those claims.
The issuer cryptographically signs the credential, which makes it possible to check that the credential really came from the issuer and not someone else.

Examples of issuers include:

- A university issuing a digital diploma
- A government agency issuing a digital driving license
- An employer issuing a proof of employment

Once the issuer delivers the credential to the holder, its active role in any future verification is finished.
The issuer does not need to be online or involved when the credential is later presented to a verifier.

### Holder

The **holder** is the entity that receives credentials from issuers and stores them in a credential manager, typically known as a wallet.
The holder controls when, where, and to whom credentials are presented.

In most cases, the holder is also the **subject** of the credential (the person the claims are about), but this isn't always true.
A parent might hold credentials on behalf of a child, or an organization might hold credentials about its subsidiaries.

When a verifier requests proof of a claim, the holder authorizes the release of specific credentials or claims.
The holder's **credential manager** then constructs a verifiable presentation, which is a package containing one or more credentials (or selected claims from them) that is cryptographically signed using keys managed by the credential manager.
This proves both the authenticity of the original credential and the holder's consent to share it.

In practice, the "holder" in the three-party model is an abstract role.
When the holder is a person, the credential manager is the software agent that acts on their behalf, storing credentials, prompting for consent, assembling presentations, and managing cryptographic keys.
The person decides what to share.
The credential manager handles how.

### Verifier

The **verifier** is the entity that receives a verifiable presentation from a holder and checks its authenticity.
Verification involves confirming that:

1. The credential was issued by a trusted issuer (via cryptographic signature)
1. The credential has not been tampered with
1. The credential has not been revoked or expired

Importantly, the verifier performs all of this **without contacting the issuer directly**.
The cryptographic proofs embedded in the credential are sufficient.

## How it works in practice

Consider a job application scenario:

1. **Issuance**: A university (issuer) creates a verifiable digital credential representing a degree and delivers it to the graduate (holder).
1. **Storage**: The graduate stores the credential in their credential manager.
1. **Presentation**: When applying for a job, the employer (verifier) requests a verifiable presentation containing the degree credential, the holder approves the request in their credential manager, which returns it to the employer (verifier).
1. **Verification**: The employer cryptographically verifies the credential's signature, checks its validity, and confirms the necessary claims, all without calling the university.

This mirrors how physical credentials work in the real world. When you show your driving license to a bartender, they inspect the card itself, they don't call the driving license issuer (DMV, RMV, vehicle registrar, etc).

## Comparison with the centralized IdP/Relying Party model

The three-party model is a deliberate architectural shift from traditional federated identity systems like SAML and OpenID Connect (OIDC).
Understanding the differences helps clarify why verifiable digital credentials exist.

### Centralized IdP/Relying Party model

In traditional federation, an **Identity Provider (IdP)** sits in the middle of every transaction.
When you click "Sign in with XYZ," the service you're logging into (the Relying Party) redirects you to XYZ (the IdP), which authenticates you and sends an assertion back to the service.
This is easy and it works, but it has structural consequences:

- **The IdP is always online and involved.** Every time a relying party needs to verify your identity, it contacts the IdP in real time.
If the IdP goes down, authentication breaks.
- **The IdP sees every transaction.** Because the IdP brokers every interaction, it knows which services you use and when you use them.
This means the IdP can create a centralized record of your activity (in some jurisdictions and use cases, this is disallowed by laws and regulations)
- **The holder has limited control.** The IdP decides what claims to release and to whom.
The user may consent, but they don't independently control the flow of their own attributes.
- **Issuance and verification are coupled.** In federation, the entity that asserts your identity (the IdP) is the same entity that authenticates you to relying parties.
The "issuer" and the intermediary are one and the same.

### Verifiable digital credentials (three-party model)

The three-party model decouples the IdP into two independent roles: the **issuer** and the **holder**  and removes the need for a live intermediary:

- **No phone-home requirement.** The verifier checks the credential's cryptographic proof locally.
The issuer doesn't need to be online, and doesn't learn when or where the credential is used.
- **Holder-mediated flow.** The holder decides what to share, with whom, and when.
The issuer is not in the loop at presentation time.
- **Selective disclosure.** Through mechanisms like zero-knowledge proofs or selective disclosure, the holder can reveal only specific claims from a credential, for example, proving they are over 18 without revealing their exact date of birth.
- **Offline verification.** Because verification relies on cryptographic proofs rather than real-time API calls, credentials can be verified without network access.

### Summary of differences

|                                        | IdP/Relying Party model        | Verifiable digital credentials                                |
| -------------------------------------- | ------------------------------ | ------------------------------------------------------------- |
| **Architecture**                       | Two-party: IdP ↔ Relying Party | Three-party: Issuer → Holder → Verifier (RP)                  |
| **Issuer involvement at verification** | Always (real-time)             | Never (after issuance)                                        |
| **Holder control**                     | Limited: IdP mediates          | Full: holder decides what to share                            |
| **Issuer visibility**                  | Sees every transaction         | Sees nothing after issuance                                   |
| **Selective disclosure**               | Limited                        | Native support                                                |
| **Offline verification**               | Not possible                   | Supported                                                     |
| **Standards**                          | SAML, OpenID Connect           | OpenID4VC, Digital Credentials API, SD-JWT VC, W3C VC DM, etc |

## Trust in the three-party model

A common question is: how does the verifier know to trust the issuer if there's no live connection between them?

Trust is established **out of band**, before any credential exchange takes place.
A verifier maintains its own policies about which issuers it trusts for which types of claims.
This might involve:

- Checking the issuer's cryptographic identifier against a trusted registry
- Consulting a governance framework or accreditation list
- Applying internal business rules about which credentials to accept

This is analogous to how a bar trusts a driving license: not because it contacts the the driving license issuer (DMV, RMV, vehicle registrar, etc), but because it recognizes the format, security features, and issuing authority.
