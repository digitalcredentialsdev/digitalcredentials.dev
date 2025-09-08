---
title: iOS/iPadOS
---

## Ecosystem Support

### Protocols

Apple platforms only support [ISO 18013-7 Annex C](../related-specs#iso-18013-7-mappings) for presentation. OpenID for Verifiable Presentations (Annex D) is not supported.

Verification in native apps is done with a [proprietary platform API](https://developer.apple.com/wallet/get-started-with-verify-with-wallet/).

### Credential Formats

Apple platforms only support the ISO 18013-5 mdoc format via the Digital Credentials API and the credential manager API (used by wallets and referred to as the "[Identity Document Provider](https://developer.apple.com/documentation/IdentityDocumentServices/Implenting-as-an-identity-document-provider)" on Apple platforms).

To support additional credential formats, insecure methods like custom schemes must be used.

### Doc Types

Apple platforms only support the following document types via the Digital Credentials API:

- `org.iso.18013.5.1.mDL` (mobile driving license)
- `org.iso.23220.1.jp.mnc` (Japan MyNumber card)
- `org.iso.23220.photoid.1` (general photo ID)
- `eu.europa.ec.eudi.pid.1` (EU personal ID card)

To support additional doc types, insecure methods like custom schemes must be used.
