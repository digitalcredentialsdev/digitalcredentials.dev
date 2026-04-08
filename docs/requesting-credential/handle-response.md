---
sidebar_position: 6
title: "Handling the Response"
---

# Handling the Response

When a user approves a credential request in their wallet, the Digital Credentials API resolves its promise and returns a response object to your frontend JavaScript. From that point, your job is to get the response securely to your backend, and then perform a precise sequence of cryptographic and semantic checks before trusting a single claim.

This page walks through every step: what the raw response looks like, how to pass it to your backend safely, and the full verification procedure for both SD-JWT VC and mdoc credential formats.

:::tip
**Never validate credentials in the browser.** All cryptographic verification must happen on your backend. The frontend's only job is to receive the response object and POST it to your server.
:::

## Step 1: Receiving the DC API Response

The `navigator.credentials.get()` call returns a `DigitalCredential` object. The credential data lives in its `data` property, already parsed as a JavaScript object.

```javascript
let dcResponse;
try {
  dcResponse = await navigator.credentials.get({
    signal: controller.signal,
    mediation: "required",
    digital: {
      requests: [{
        protocol: "openid4vp",
        data: presReqData
      }]
    }
  });
} catch (err) {
  if (err.name === 'NotAllowedError') {
    // User dismissed or denied the wallet picker
  } else {
    // Unexpected error
  }
}
```

`dcResponse.data` contains the OpenID4VP Authorization Response. When using DCQL, it looks like this:

```json
{
  "vp_token": {
    "my_credential": "<presentation-encoded-as-string>"
  }
}
```

The key inside `vp_token` — `"my_credential"` in this example — matches the credential identifier you defined in your DCQL query. Each key maps to one presented credential.

## Step 2: Forwarding the Response to Your Backend

POST the response object directly to your backend over HTTPS. Do not inspect, modify, or validate it in the browser first.

```javascript
const postResponse = await fetch('/api/verify-credential', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(dcResponse.data)
});

if (!postResponse.ok) {
  throw new Error('Verification failed');
}

const result = await postResponse.json();
// Use result — e.g. display the verified claims or redirect
```

Your backend endpoint receives the raw `vp_token` object and must look up the original request (including the nonce you issued) by session or request ID. This is essential — the nonce must come from your own server-side store, never from the client.

```javascript
// Express.js example (Node.js)
app.post('/api/verify-credential', async (req, res) => {
  const { vp_token } = req.body;

  // Retrieve the nonce you issued for this session
  const expectedNonce = await sessionStore.get(req.session.requestId);
  if (!expectedNonce) {
    return res.status(400).json({ error: 'Unknown request' });
  }

  try {
    const claims = await verifyPresentation(vp_token, expectedNonce);
    // Invalidate the nonce — it must not be reusable
    await sessionStore.delete(req.session.requestId);
    res.json({ verified: true, claims });
  } catch (err) {
    res.status(400).json({ verified: false, error: err.message });
  }
});
```

:::warning
**Invalidate the nonce immediately after use.** Once you have successfully verified a response, delete the nonce from your store. A nonce that can be reused defeats replay protection entirely.
:::

## Step 3: Universal Checks (All Formats)

Before doing any format-specific validation, perform these checks on every response.

### 3.1 Validate the `vp_token` structure

Confirm that `vp_token` is present, is an object, and contains exactly the credential keys you requested. If your DCQL query requested `my_credential`, then `vp_token.my_credential` must be present.

```javascript
function assertVpTokenShape(vpToken, expectedKeys) {
  if (!vpToken || typeof vpToken !== 'object') {
    throw new Error('vp_token must be an object');
  }
  for (const key of expectedKeys) {
    if (!(key in vpToken)) {
      throw new Error(`Missing expected credential: ${key}`);
    }
  }
}
```

### 3.2 Determine the credential format

Inspect the shape of each value in `vp_token`:

- If it is a **string containing `~`-separated segments**, it is an **SD-JWT VC** presentation.
- If it is a **base64url string that decodes to CBOR bytes**, it is an **mdoc** (`DeviceResponse`).

Use the credential format identifier from your original DCQL query to know which validation path to follow — do not rely on runtime type sniffing alone.

---

## Format 1: SD-JWT VC

An SD-JWT VC presentation is a compact string structured as:

```
<Issuer-signed JWT>~<Disclosure 1>~<Disclosure 2>~...~<optional KB-JWT>
```

Each `~`-delimited segment is base64url-encoded. The final segment is the Key Binding JWT (KB-JWT) if holder binding was requested.

### SD-JWT VC Example

```
eyJ0eXAiOiJ2YytzZC1qd3QiLCJhbGciOiJFUzI1NiJ9.eyJpc3MiOiJodHRwczovL2lzc3Vlci5leGFtcGxlLmNvbSIsInZjdCI6Imh0dHBzOi8vY3JlZGVudGlhbHMuZXhhbXBsZS5jb20vaWRlbnRpdHkiLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MTg2MDAwMDAwMCwiX3NkIjpbIlNLd2F4dThXU3Z5cXg0WThJZmdLY2lLT2NxQ2I5T29fS0lGUXBvbUFpMWsiLCJJeEFxejduRHBOb3pwb0F4bzZHcFJ6UnZBSmxGZ0VPTVg3QTFxSEtmeVBRIl0sIl9zZF9hbGciOiJzaGEtMjU2IiwiY25mIjp7Imp3ayI6eyJrdHkiOiJFQyIsImNydiI6IlAtMjU2IiwieCI6IlRDQUVSMTladnUzT0hGNGo0VzR2ZlNWb0hJUDFJTGlsRGxzN3ZDZUdlbWMiLCJ5IjoiWnhqaVdXYlpNUUdIVldLVlE0aGJTSWlyc1ZmdWVjQ0U2dDRqVDlGMkhaUSJ9fX0.signature
~WyIyR0xDNDJzS1F2ZUNmR2ZyeWxBQT09IiwiZ2l2ZW5fbmFtZSIsIkFsaWNlIl0
~WyJlbHVWNU9nM2dTTklJOEVZbnN4QV9BIiwiZmFtaWx5X25hbWUiLCJTbWl0aCJd
~eyJ0eXAiOiJrYitqd3QiLCJhbGciOiJFUzI1NiJ9.eyJub25jZSI6Im4tMFM2X1d6QTJNaiIsImF1ZCI6Im9yaWdpbjpodHRwczovL3ZlcmlmaWVyLmV4YW1wbGUuY29tIiwiaWF0IjoxNzAwMDAxMDAwLCJzZF9oYXNoIjoiVkV6M3RsS2o5VjRTNTdNNmhFaG9WNEhzX1J2aldlaDNUc3U5MUNubGxuZUkifQ.kb_signature
```

Breaking this down:

- **Segment 1** — the Issuer-signed JWT (a standard JWT with `_sd` claim array containing hashed disclosures)
- **Segments 2–3** — the Disclosures (each is a base64url-encoded JSON array: `[salt, claim_name, claim_value]`)
- **Last segment** — the Key Binding JWT (`typ: kb+jwt`)

### SD-JWT VC Verification Steps

#### Step 1: Split and parse the presentation

```javascript
const parts = presentation.split('~');
// Last non-empty part is the KB-JWT (if present)
const kbJwt = parts[parts.length - 1] !== '' ? parts[parts.length - 1] : null;
const issuerJwt = parts[0];
const disclosures = parts.slice(1, kbJwt ? parts.length - 1 : parts.length)
                         .filter(d => d !== '');
```

#### Step 2: Verify the Issuer's signature on the SD-JWT

Decode the JWT header to get the algorithm and key reference. Retrieve the issuer's public key — either via the `iss` claim (fetch `<iss>/.well-known/jwt-vc-issuer`) or from the `x5c` header parameter if an X.509 certificate chain is provided.

```javascript
import { decodeProtectedHeader, decodeJwt, jwtVerify, importJWK } from 'jose';

const header = decodeProtectedHeader(issuerJwt);
const payload = decodeJwt(issuerJwt);

// Option A: Resolve via iss claim (JWT VC Issuer Metadata)
const issuerMetadata = await fetch(`${payload.iss}/.well-known/jwt-vc-issuer`)
  .then(r => r.json());
const jwks = issuerMetadata.jwks;
const issuerKey = await importJWK(jwks.keys.find(k => k.kid === header.kid));

// Option B: Extract from x5c header parameter
// const cert = parseCertificate(header.x5c[0]);
// const issuerKey = cert.publicKey;
// validateCertificateChain(header.x5c, trustedRoots);

await jwtVerify(issuerJwt, issuerKey, {
  // Do NOT pass 'audience' here — SD-JWTs are not audience-bound at the JWT level
});
```

:::note
Reject any JWT using the `none` algorithm. Require algorithms your policy permits — typically `ES256` or `ES384`.
:::

#### Step 3: Verify the `vct` claim

The `vct` (Verifiable Credential Type) claim must match the type you requested in your DCQL query.

```javascript
const expectedVct = 'https://credentials.example.com/identity_credential';
if (payload.vct !== expectedVct) {
  throw new Error(`Unexpected vct: ${payload.vct}`);
}
```

#### Step 4: Check standard JWT claims

```javascript
const now = Math.floor(Date.now() / 1000);

if (payload.exp && payload.exp < now) {
  throw new Error('Credential has expired');
}
if (payload.nbf && payload.nbf > now) {
  throw new Error('Credential not yet valid');
}
if (!payload.iss) {
  throw new Error('Missing iss claim');
}
```

#### Step 5: Verify each Disclosure

For each disclosure, decode it from base64url, parse the JSON array `[salt, claim_name, claim_value]`, then recompute the hash and confirm it appears in the `_sd` array of the JWT payload.

```javascript
import { createHash } from 'crypto'; // Node.js

const sdAlg = payload._sd_alg ?? 'sha-256'; // default per spec
const disclosedClaims = {};

for (const disclosure of disclosures) {
  // Recompute the hash
  const hash = createHash(sdAlg.replace('-', ''))
    .update(disclosure)
    .digest('base64url'); // base64url without padding

  // Confirm the hash appears in _sd
  if (!payload._sd || !payload._sd.includes(hash)) {
    throw new Error(`Disclosure hash not found in SD-JWT: ${hash}`);
  }

  // Decode the disclosure
  const [salt, claimName, claimValue] = JSON.parse(
    Buffer.from(disclosure, 'base64url').toString('utf8')
  );

  disclosedClaims[claimName] = claimValue;
}
```

#### Step 6: Verify the Key Binding JWT (KB-JWT)

The KB-JWT proves that the holder — not a third party who intercepted the credential — performed this presentation. It must be present when your policy requires holder binding.

```javascript
// Extract the holder's public key from the SD-JWT cnf claim
const holderJwk = payload.cnf?.jwk;
if (!holderJwk) throw new Error('No cnf.jwk in SD-JWT — holder binding not possible');
const holderKey = await importJWK(holderJwk);

// Verify KB-JWT signature
const { payload: kbPayload, protectedHeader: kbHeader } =
  await jwtVerify(kbJwt, holderKey);

// 1. Check typ
if (kbHeader.typ !== 'kb+jwt') {
  throw new Error('KB-JWT must have typ: kb+jwt');
}

// 2. Check iat is recent (within acceptable window, e.g. 5 minutes)
const kbAge = now - kbPayload.iat;
if (kbAge > 300) {
  throw new Error('KB-JWT is too old');
}

// 3. Check nonce matches the one you issued
if (kbPayload.nonce !== expectedNonce) {
  throw new Error('KB-JWT nonce mismatch — possible replay attack');
}

// 4. Check aud matches your origin
const expectedAud = `origin:https://verifier.example.com`;
if (kbPayload.aud !== expectedAud) {
  throw new Error('KB-JWT audience mismatch');
}

// 5. Verify sd_hash — the KB-JWT must commit to this exact presentation
// sd_hash = base64url(hash(issuerJwt + '~' + disclosures.join('~') + '~'))
const presentationToHash = issuerJwt + '~' + disclosures.join('~') + '~';
const expectedSdHash = createHash('sha256')
  .update(presentationToHash)
  .digest('base64url');
if (kbPayload.sd_hash !== expectedSdHash) {
  throw new Error('KB-JWT sd_hash does not match presentation');
}
```

#### Step 7: Check credential status (revocation)

If the SD-JWT payload contains a `status` claim, check it according to your policy. Common mechanisms include Status List (RFC 9596) and StatusList2021.

```javascript
if (payload.status) {
  const isRevoked = await checkCredentialStatus(payload.status);
  if (isRevoked) throw new Error('Credential has been revoked');
}
```

#### Step 8: Confirm the disclosed claims satisfy your request

Verify that all the claims you required in your DCQL query are present in `disclosedClaims`.

```javascript
const requiredClaims = ['given_name', 'family_name'];
for (const claim of requiredClaims) {
  if (!(claim in disclosedClaims)) {
    throw new Error(`Required claim not disclosed: ${claim}`);
  }
}

// All checks passed — return the verified claims
return disclosedClaims;
```

---

## Format 2: mdoc (ISO 18013-5)

An mdoc presentation is a CBOR-encoded `DeviceResponse` structure, carried in `vp_token` as a base64url-encoded string. It is binary, not JSON — you must decode it and parse the CBOR before you can inspect any values.

The `DeviceResponse` contains one or more `documents`, each with:

- **`issuerSigned`** — the issuer's credential data, including the Mobile Security Object (MSO) and namespace-grouped claim data
- **`deviceSigned`** — the holder's device authentication signature, proving the presentation was generated on the bound device

### mdoc Verification Steps

#### Step 1: Base64url-decode and CBOR-parse the DeviceResponse

```javascript
import * as cbor from 'cbor'; // e.g. the `cbor` npm package

const deviceResponseBytes = Buffer.from(
  vpToken.my_mdoc_credential,
  'base64url'
);
const deviceResponse = cbor.decode(deviceResponseBytes);

// Basic sanity check
if (deviceResponse.status !== 0) {
  throw new Error(`DeviceResponse error status: ${deviceResponse.status}`);
}
if (!deviceResponse.documents || deviceResponse.documents.length === 0) {
  throw new Error('DeviceResponse contains no documents');
}
```

#### Step 2: Check the `docType`

For each document, verify the `docType` matches what you requested.

```javascript
for (const doc of deviceResponse.documents) {
  if (doc.docType !== 'org.iso.18013.5.1.mDL') {
    throw new Error(`Unexpected docType: ${doc.docType}`);
  }
}
```

#### Step 3: Verify the Issuer Authentication (IssuerAuth / MSO)

The `issuerSigned.issuerAuth` field is a COSE_Sign1 structure. Its payload is the Mobile Security Object (MSO) — a CBOR map containing:

- The hash algorithm used to digest the claims
- Per-namespace digests of each `IssuerSignedItem`
- A `deviceKeyInfo` containing the holder's device public key
- `validityInfo` with `signed`, `validFrom`, and `validUntil` timestamps

```javascript
const { issuerAuth } = doc.issuerSigned;

// issuerAuth is a COSE_Sign1: [protected, unprotected, payload, signature]
const [protectedHeaderBytes, unprotectedHeader, msoBytes, signature] = issuerAuth;

// The Document Signer Certificate (DSC) is in the unprotected header (label 33)
const dscDer = unprotectedHeader.get(33);

// Verify the DSC certificate chain up to a trusted IACA root
const dsc = parseCertificate(dscDer);
validateCertificateChain([dsc], trustedIacaRoots);

// Verify the COSE_Sign1 signature using the DSC's public key
await verifyCoseSign1(issuerAuth, dsc.publicKey);

// Decode and parse the MSO
const mso = cbor.decode(msoBytes);
```

The certificate chain for an mDL has exactly two levels: the Issuing Authority Certificate Authority (IACA) root, and the Document Signer Certificate (DSC) that directly signed the MSO. You must pre-configure your verifier with the IACA certificate(s) of the issuers you trust.

#### Step 4: Check MSO validity

```javascript
const { validityInfo, docType: msoDocType } = mso;
const now = new Date();

if (msoDocType !== doc.docType) {
  throw new Error('MSO docType does not match document docType');
}
if (new Date(validityInfo.validFrom) > now) {
  throw new Error('MSO not yet valid');
}
if (new Date(validityInfo.validUntil) < now) {
  throw new Error('MSO has expired');
}
```

#### Step 5: Verify disclosed elements against MSO digests

Each disclosed `IssuerSignedItem` is a CBOR-tagged byte string. To verify integrity, you recompute the digest of the raw tagged bytes and check it matches the corresponding entry in the MSO's `valueDigests` map.

```javascript
const digestAlgorithm = mso.digestAlgorithm; // e.g. 'SHA-256'
const msoValueDigests = mso.valueDigests;     // Map of namespace -> Map of digestID -> digest

const verifiedClaims = {};

for (const [namespace, items] of Object.entries(doc.issuerSigned.nameSpaces)) {
  verifiedClaims[namespace] = {};
  const namespaceDigests = msoValueDigests.get(namespace);

  for (const itemBytes of items) {
    // itemBytes is a CBOR tag 24 (embedded CBOR)
    const rawTaggedBytes = itemBytes; // The raw bytes before CBOR decoding

    // Recompute the digest over the raw bytes
    const digest = createHash(digestAlgorithm.replace('-', ''))
      .update(rawTaggedBytes)
      .digest();

    // Decode the item to get digestID and claim values
    const item = cbor.decode(cbor.decode(itemBytes)); // unwrap tag 24
    const { digestID, elementIdentifier, elementValue } = item;

    // Compare to the MSO digest for this digestID
    const expectedDigest = namespaceDigests.get(digestID);
    if (!expectedDigest || !digest.equals(Buffer.from(expectedDigest))) {
      throw new Error(
        `Digest mismatch for element ${elementIdentifier} (digestID ${digestID})`
      );
    }

    verifiedClaims[namespace][elementIdentifier] = elementValue;
  }
}
```

#### Step 6: Verify the Device Authentication (DeviceAuth)

The `deviceSigned.deviceAuth` field contains the device's signature over `DeviceAuthenticationBytes`, which commits to the `SessionTranscript`. The `SessionTranscript` for an OID4VP-over-DC-API flow binds the presentation to your specific request via `client_id`, `response_uri`, and the `nonce` you issued.

This is the holder-binding check for mdocs: it proves the presentation was freshly generated for your specific request and could only have been made by the device whose key is in the MSO.

```javascript
// Reconstruct the OID4VPHandover structure
// This is CBOR-encoded and must exactly match what the wallet constructed
const oid4vpHandover = cbor.encode([
  clientId,           // your origin: e.g. "origin:https://verifier.example.com"
  responseUri,        // your response endpoint URI
  expectedNonce,      // the nonce you issued
  mdocGeneratedNonce  // returned in the response's apu/apv if using JARM, or null
]);

const sessionTranscript = cbor.encode([
  null,           // DeviceEngagementBytes (null for OID4VP)
  null,           // EReaderKeyBytes (null for OID4VP)
  oid4vpHandover
]);

// DeviceAuthenticationBytes = bstr .cbor DeviceAuthentication
// DeviceAuthentication = ["DeviceAuthentication", SessionTranscript, docType, DeviceNameSpacesBytes]
const deviceAuthentication = cbor.encode([
  "DeviceAuthentication",
  cbor.decode(sessionTranscript), // unwrapped SessionTranscript
  doc.docType,
  doc.deviceSigned.nameSpaces    // typically empty bstr for OID4VP
]);
const deviceAuthenticationBytes = cbor.encode(
  new cbor.Tagged(24, deviceAuthentication)
);

// Extract the device public key from the MSO
const devicePublicKey = mso.deviceKeyInfo.deviceKey;
const importedDeviceKey = await importCoseKey(devicePublicKey);

// Verify the COSE_Sign1 or COSE_Mac0 device signature
await verifyDeviceAuth(
  doc.deviceSigned.deviceAuth,
  deviceAuthenticationBytes,
  importedDeviceKey
);
```

:::note
The `mdocGeneratedNonce` is a wallet-generated random value embedded in the response when JARM response encryption is used. For unencrypted DC API responses, this may be absent or null — consult the profile you are implementing.
:::

#### Step 7: Confirm the disclosed elements satisfy your request

```javascript
const requiredElements = {
  'org.iso.18013.5.1': ['given_name', 'family_name', 'birth_date']
};

for (const [ns, elements] of Object.entries(requiredElements)) {
  for (const element of elements) {
    if (!verifiedClaims[ns]?.[element]) {
      throw new Error(`Required element not present: ${ns}/${element}`);
    }
  }
}

return verifiedClaims;
```

---

## Validation Checklist

Use this as a quick reference before shipping your verifier implementation.

### Universal

- [ ] `vp_token` is present and well-formed
- [ ] All expected credential keys from the DCQL query are present
- [ ] Nonce retrieved from server-side store (not from client)
- [ ] Nonce invalidated after successful verification

### SD-JWT VC

- [ ] Issuer JWT signature verified against issuer's public key
- [ ] `vct` claim matches the expected credential type
- [ ] `exp` and `nbf` checked
- [ ] All disclosed Disclosure hashes verified against `_sd` array
- [ ] KB-JWT signature verified using `cnf.jwk` from SD-JWT
- [ ] KB-JWT `typ` is `kb+jwt`
- [ ] KB-JWT `iat` is within acceptable time window
- [ ] KB-JWT `nonce` matches expected nonce
- [ ] KB-JWT `aud` matches your verifier origin
- [ ] KB-JWT `sd_hash` correctly commits to this presentation
- [ ] Credential status (revocation) checked if `status` claim present
- [ ] All DCQL-required claims are present in disclosed set

### mdoc

- [ ] `DeviceResponse` decoded from base64url and CBOR-parsed
- [ ] `status` is `0` (success)
- [ ] `docType` matches expected document type
- [ ] DSC certificate chain verified up to trusted IACA root
- [ ] COSE_Sign1 IssuerAuth signature verified using DSC public key
- [ ] MSO `docType` matches document `docType`
- [ ] MSO `validFrom` and `validUntil` checked
- [ ] Each disclosed `IssuerSignedItem` digest verified against MSO
- [ ] `DeviceAuthenticationBytes` constructed with correct `SessionTranscript`
- [ ] DeviceAuth signature verified using device public key from MSO
- [ ] All DCQL-required namespace elements are present in verified set

---

## Recommended Libraries

Implementing the full cryptographic stack yourself is error-prone. These libraries handle COSE, CBOR, SD-JWT, and mdoc parsing:

| Language | SD-JWT VC | mdoc |
|----------|-----------|------|
| **JavaScript / Node.js** | [`@sd-jwt/sd-jwt-vc`](https://github.com/openwallet-foundation-labs/sd-jwt-js), [`jose`](https://github.com/panva/jose) | [`@auth0/mdl`](https://github.com/auth0-lab/mdl), [`cbor`](https://github.com/hildjj/node-cbor) |
| **Python** | [`sd-jwt`](https://github.com/openwallet-foundation-labs/sd-jwt-python) | [`pyMDOC-CBOR`](https://github.com/IdentityPython/pyMDOC-CBOR), [`cbor2`](https://github.com/agronholm/cbor2) |
| **Java / Kotlin** | [`nimbus-jose-jwt`](https://connect2id.com/products/nimbus-jose-jwt) | [`multipaz`](https://github.com/openwallet-foundation/multipaz), [`waltid-mdoc`](https://github.com/walt-id/waltid-mdoc) |
| **Rust** | [`openid4vp`](https://github.com/spruceid/openid4vp) | [`isomdl`](https://github.com/spruceid/isomdl) |

:::info
The ISO 18013-5 specification for mdoc is available from ISO and required for a fully compliant implementation. If you need access to the spec, check with the site maintainers — it can be provided as a reference document.
:::

## Further Reading

- [OpenID4VP — the protocol layer](./openid4vp)
- [DCQL — the credential query format](./dcql)
- [Digital Credentials API — the browser invocation layer](./dc-api)
- [RFC 9901 — Selective Disclosure for JWTs (SD-JWT)](https://datatracker.ietf.org/doc/rfc9901/)
- [SD-JWT VC specification (IETF draft)](https://datatracker.ietf.org/doc/draft-ietf-oauth-sd-jwt-vc/)
- [ISO 18013-5 — Mobile Driving Licence (mDL) specification](https://www.iso.org/standard/69084.html)
- [OpenID4VP 1.0 Specification](https://openid.net/specs/openid-4-verifiable-presentations-1_0.html)