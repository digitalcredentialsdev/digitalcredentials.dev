---
sidebar_position: 2
title: "OpenID4VP"
---

# OpenID for Verifiable Presentations

OpenID for Verifiable Presentations (OpenID4VP) is the protocol that ties together the verifiable digital credentials ecosystem.
It defines a standardized, secure way for a **Verifier** (your application) to request credentials from a **Holder** (the user and their wallet) and receive back cryptographically verifiable proofs.

In the context of requesting credentials via the Digital Credentials API, OpenID4VP is the protocol layer that structures _what_ you're asking for and _how_ the response is returned.
[DCQL](./dcql.md) (covered in the next section) is the query language used _within_ that protocol to describe the specific credentials you need.

## What is OpenID4VP?

At its core, OpenID4VP defines:

- **The Authorization Request** — a structured object sent from a Verifier to a Credential Manager (wallet), specifying which credentials are needed
- **The VP Token** — the response container carrying one or more Verifiable Presentations back to the Verifier
- **The protocol flow** — how requests and responses move between parties, including support for same-device and cross-device scenarios

OpenID4VP supports multiple credential formats in a single protocol, including SD-JWT VC, ISO mdoc, and W3C Verifiable Credentials.

## Key Roles

| Role         | Description                                           |
| ------------ | ----------------------------------------------------- |
| **Verifier** | Your application — requests and validates credentials |
| **Wallet**   | The user's credential manager                         |
| **Holder**   | The end user who consents to the presentation         |

## The Authorization Request

The Authorization Request is the object your backend constructs and delivers to the Wallet. It tells the Wallet what credentials are required and how to return the response.

When using the Digital Credentials API (covered in detail on the [DC API page](./dc-api)), this request object is passed directly as the `data` field of the API call — your backend fetches it, and your frontend passes it through.

### Core Request Parameters

```json
{
  "response_type": "vp_token",
  "response_mode": "direct_post",
  "client_id": "origin:https://verifier.example.com",
  "nonce": "n-0S6_WzA2Mj",
  "dcql_query": { ... }
}
```

| Parameter       | Description                                                                                                    |
| --------------- | -------------------------------------------------------------------------------------------------------------- |
| `response_type` | Must be `vp_token` to request a Verifiable Presentation                                                        |
| `response_mode` | How the wallet returns the response. `direct_post` is used for cross-device and DC API flows                   |
| `client_id`     | Identifies your verifier. When using the Digital Credentials API, this is prefixed with `origin:`              |
| `nonce`         | A fresh, cryptographically random value — **must be unique per request** and is used to prevent replay attacks |
| `dcql_query`    | The credential query (see the [DCQL page](./dcql))                                                             |

:::info
For requests via the Digital Credentials API, the `client_id` is automatically set to `origin:<your-origin>` — for example, `origin:https://verifier.example.com`. This ties the request to your web origin and is enforced by the browser, providing a strong verifier authentication mechanism without requiring X.509 certificates.
:::

### The Nonce

The `nonce` is one of the most important security parameters in the request. It must be:

- **Unique** — generated fresh for every presentation request
- **Unpredictable** — cryptographically random (use `crypto.getRandomValues` or a server-side equivalent)
- **Verified** — checked by your backend when validating the response

The wallet embeds the nonce into the Verifiable Presentation, binding the presentation to this specific request and preventing a previously captured response from being replayed.

```javascript
// Generate a nonce server-side (Node.js example)
import { randomBytes } from "crypto";
const nonce = randomBytes(16).toString("base64url");
```

## Request Types

OpenID4VP supports three levels of request authentication.
Each trades implementation complexity for stronger cryptographic assurances to the wallet — choose based on your deployment environment and the trust requirements of the credentials you're requesting.

### Unsigned requests

The simplest form.
The request object is plain JSON with no JWT wrapping or signature.
Verifier identity is established entirely through the Digital Credentials API's [`origin` client identifier scheme](#client-identifier-schemes):
the browser enforces that the request originates from the claimed web origin, and the wallet trusts that enforcement implicitly.

```json
{
  "response_type": "vp_token",
  "response_mode": "direct_post",
  "client_id": "origin:https://verifier.example.com",
  "nonce": "n-0S6_WzA2Mj",
  "dcql_query": { ... }
}
```

**When to use:** Development, prototyping, or consumer-facing deployments where
browser-enforced origin binding is a sufficient trust signal. This is the right
starting point for most integrations.

**Security and privacy considerations:**

- The wallet relies entirely on browser enforcement — it has no way to independently
  verify the request's integrity if the payload were tampered with upstream of the DC API.
- No verifier certificate is presented to the wallet or the user. The identity visible
  to the wallet is only the web origin.
- Because there is no request signing key, there is no PKI infrastructure to
  manage or rotate.

### Signed requests (JAR)

The request object is wrapped in a JWT — known as a **JWT Authorization Request** (JAR, defined in [RFC 9101](https://www.rfc-editor.org/rfc/rfc9101.html)) — and signed by the verifier using a private key tied to an X.509 certificate.
This JWT is passed directly as the `data` field of the DC API call.
The wallet verifies the signature before processing the request.

The JWT is signed by your verifier's private key, with the corresponding certificate embedded in the `x5c` header.
The wallet verifies the signature against the certificate, checks that the `client_id` matches the certificate's Subject Alternative Name, and only then processes the request.

**When to use:** Production deployments where you need the wallet to independently authenticate your verifier — particularly in regulated sectors (finance, healthcare, government) or any context where the browser's origin guarantee alone is insufficient.
This is the recommended path for most production integrations.

**Security and privacy considerations:**

- The wallet independently verifies the request hasn't been tampered with in transit, without relying on the browser.
- Your verifier's organizational identity (from the X.509 certificate's SAN) is presented to the wallet and may be surfaced to the user. Plan which organizational identity you want users to see.
- You are responsible for certificate lifecycle management: rotation, renewal, and ensuring revocation is handled. An expired or revoked certificate will cause wallets to reject your requests.

### Multi-signed requests

In some ecosystems, a single verifier signature is not enough — the wallet must also confirm that the verifier is registered with and endorsed by a recognized **trust anchor**: a scheme operator, government body, or federation authority that governs which verifiers are permitted to request which credential types.

Multi-signed requests extend JAR by adding an endorsement from the trust anchor.
Typically, the trust anchor issues a **Verifier Attestation** — a JWT signed by the trust anchor's key that asserts the verifier's legitimacy and permitted credential queries.
The verifier's signed request JWT includes or references this attestation, and the wallet validates both signatures.

```
┌─────────────────────────────────────┐
│ Trust anchor JWT (outer)            │
│   iss: trust-anchor.example.gov     │
│   sub: verifier.example.com         │
│   permitted_credentials: [...]      │
│                                     │
│  ┌──────────────────────────────┐   │
│  │ Verifier JWT (inner / JAR)   │   │
│  │   client_id: x509_san_dns:…  │   │
│  │   dcql_query: { ... }        │   │
│  └──────────────────────────────┘   │
└─────────────────────────────────────┘
```

**When to use:** Governed ecosystems that mandate trust framework enrollment before credentials can be presented — the most prominent example being the European Digital Identity (EUDI) framework.
If your deployment environment doesn't operate under a formal governance framework, multi-signed requests add complexity without benefit.

**Security and privacy considerations:**

- Provides the strongest request authentication: the wallet can verify both the verifier's identity and that a recognized authority has sanctioned the request.
- Enrolling in a trust framework means your verifier's identity, permitted credential types, and potentially your query patterns are known to and governed by that authority Understand the data retention and audit obligations this creates.
- Trust anchor key material is not under your control. Outages, key rotations, or revocations in the trust anchor's infrastructure can affect your ability to present credentials. 
Build for this operationally.
- The exact mechanics — attestation format, trust registry lookup, revocation checking
  — vary by ecosystem. Consult your trust framework's technical specification rather
  than generalizing from this overview.

## The VP Token Response

When the user consents in their wallet, the Wallet returns an **Authorization Response** containing a `vp_token`. This token holds one or more Verifiable Presentations — the credential data you requested, packaged and signed by the wallet on behalf of the user.

```json
{
  "vp_token": {
    "identity_credential": "<encoded-verifiable-presentation>"
  }
}
```

The keys in `vp_token` match the credential identifiers you defined in your DCQL query, making it straightforward to map each returned presentation back to the request that generated it.

:::note
Handling and verifying the `vp_token` response is covered in detail on the [Handling the Response](./handle-response) page.
:::



## Client Identifier Schemes

OpenID4VP uses a **Client Identifier Scheme** to indicate how the Credential Manager (wallet) should identify and authenticate the Verifier. The scheme is communicated as a prefix in the `client_id` parameter.

| Scheme         | `client_id` Format                    | When to Use                                        |
| -------------- | ------------------------------------- | -------------------------------------------------- |
| `origin`       | `origin:https://verifier.example.com` | Unsigned requests with the Digital Credentials API |
| `x509_san_dns` | `x509_san_dns:verifier.example.com`   | Signed requests with the Digital Credentials API   |
| `redirect_uri` | (the redirect URI itself)             | Simple same-device flows without signing           |
| pre-registered | `example-client`                      | Pre-registered client with wallet                  |

## Putting It Together: A Minimal Request Object

Here is a complete, minimal OpenID4VP Authorization Request suitable for use with the Digital Credentials API:

```json
{
  "response_type": "vp_token",
  "response_mode": "direct_post",
  "client_id": "origin:https://verifier.example.com",
  "nonce": "n-0S6_WzA2Mj",
  "dcql_query": {
    "credentials": {
      "identity_credential": {
        "format": "vc+sd-jwt",
        "vc+sd-jwt": {
          "vct": "https://credentials.example.com/identity_credential"
        },
        "claims": [{ "path": ["given_name"] }, { "path": ["family_name"] }]
      }
    }
  }
}
```

Your backend generates this object (including a fresh `nonce`), exposes it at an endpoint, and your frontend fetches it to pass into the Digital Credentials API call — as shown on the [DC API page](./dc-api).

## Security Considerations

**Always generate a fresh nonce per request.** Reusing nonces breaks replay protection and creates a serious vulnerability.

**Validate the nonce in the response.** Your backend must confirm the nonce embedded in the returned Verifiable Presentation matches the one it issued.

**Use signed requests in production.** Signed request objects give the Wallet a way to verify the request hasn't been tampered with in transit.

**Bind responses to your origin.** When using the DC API, the `origin` client identifier scheme ensures the wallet cryptographically binds the presentation to your site's origin, preventing credential theft via malicious redirects.

See additional considerations in the specification: [OpenID for Verifiable Presentations 1.0](https://openid.net/specs/openid-4-verifiable-presentations-1_0.html#name-security-considerations)

## Further Reading

- [OpenID for Verifiable Presentations 1.0 Specification](https://openid.net/specs/openid-4-verifiable-presentations-1_0.html)
- [DCQL — the query language used inside OpenID4VP requests](./dcql)
- [Digital Credentials API — how to invoke OpenID4VP from the browser](./dc-api)
- [Bring It All Together — a complete end-to-end walkthrough](./together)