---
sidebar_position: 6
title: "Entities and Layering"
hide_table_of_contents: true
---

This page focuses on the relationship and layers between entities and components which directly relate to the Digital Credentials API: presentation and issuance protocols, credential managers, browsers and apps, operating systems, and transport protocols.

## Layers

Verification and issuance requests from a website begin with a JavaScript call to the Digital Credentials API. The browser then sends this request to the device's operating system where the credential selector is invoked. Once a user selects a credential, its credential manager is activated to complete the request.

> Website >> Browser >> OS >> Credential Manager >> OS >> Browser >> Website

Here's a summary of the APIs and communication channels:

- Verifier and issuer websites use the Digital Credentials API to send requests for presenting or issuing a credential to the device
- Browsers use platform-specific credential manager APIs to communicate with the operating system to reach the appropriate credential managers
- Native apps with verification or issuance features use platform native versions of the Digital Credentials API
- Credential managers use platform-specific credential manager APIs to interact with the underlying operating system for receiving requests and sending back responses.

The diagram below visualizes these entities, layers, and APIs for a verification flow on a mobile device (same device presentation).

![A diagram illustrates how digital credentials interact with a device's operating system. It shows three main components: "Browser" (top left, purple), "Verifier/Issuer Native App" (top center, green), and "Credential Manager" (top right, yellow). The "Browser" contains a "Verifier/Issuer Site" (dashed box) and interacts with a "Digital Credentials API" (pink box). A red arrow points from the "Browser" to "OS Platform APIs," labeled "OS credential management API for browsers." The "Verifier/Issuer Native App" interacts directly with an "OS version of Digital Credentials API for native apps" (green box), which then points to "OS Platform APIs" with a green arrow. The "Credential Manager" contains two "VDC" (Verifiable Digital Credential) diamonds and interacts with an "OS credential management API for credential managers" (orange box), which then points to "OS Platform APIs" with a yellow arrow. All these APIs ultimately connect to "Operating System Platform Services" (black box) via "OS Platform APIs" (gray box). The entire system is contained within a larger box labeled "Device" at the bottom. Dotted arrows indicate bidirectional communication or potential flows.](./layers-localdevice.svg)

When a request needs to go to a credential manager on nearby device (e.g. from a laptop/desktop to a phone), another communication channel is required. The FIDO Client to Authenticator Protocol (version 2.2) is used to support [cross-device presentation](../references/terms#cross-device-presentation) and [cross-device issuance](../references/terms#cross-device-presentation). This transport protocol is implemented by operating systems or browsers and does not require any additional work from verifiers, issuers, or credential managers.

The diagram below expands the previous diagram to include a second device where the credential manager lives, and a secure channel to pass the presentation or issuance request and response.

![A diagram showing a high-level architecture for digital credential management. The "Local Device" on the left uses a browser or native app, which interacts with OS APIs and platform services. The "Nearby Device" on the right has a credential manager, also interacting with its OS APIs and platform services. The two devices communicate via "FIDO CTAP 2.2".](./layers-crossdevice.svg)

:::note
Some browsers may implement the cross-device transport protocol (FIDO CTAP 2.2) directly on operating systems which do not support it natively.
:::

## Support across entities and layers

The Digital Credentials API is protocol agnostic, meaning it does not normatively define nor restrict which protcols can be used, giving developers the flexibility to work with a wide range of protocols, from existing standards to new ones that emerge.

However, it's important to understand that the behavior of the API can vary depending on the specific implementation (for example, within a browser or an operating system). A particular implementation may only support a limited set of protocols.

Each entity/layer ultimately needs to pass the request down to the next entity/layer, ending at the credential manager. The table below documents whether each entity must support a given component.

| **ENTITY**         | **CRED FORMAT** | **PROTOCOL** |
|--------------------|-----------------|--------------|
| Verifier / Issuer  |       Yes       | Yes          |
| Browser            |        No       | Optional     |
| Operating System   |        No       | Optional     |
| Credential Manager |       Yes       | Yes          |

For example, one browser may decide to validate a request (thus it must understand the protocol), while other browsers will directly pass the request to the operating system's credential matcher.

The [ecosystem support](/ecosystem-support?support-matrix=end2end) page documents real world combinations of entities and components in the ecosystem.
