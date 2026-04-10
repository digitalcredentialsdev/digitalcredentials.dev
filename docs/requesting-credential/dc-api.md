---
sidebar_position: 4
title: "Digital Credentials API"
---

# Digital Credentials API

## Web

```javascript
async function requestCredential() {

  // Check for Digital Credentials API support
  if (typeof window.DigitalCredential !== 'undefined') {
    
    try {
      
      // Fetch OID4VP presentation request from the backend
      let fetchResponse = await fetch('https://example.com/verifier/oid4vp/request/');
      if (!fetchResponse.ok) {
        throw new Error('Network response was not ok');
      }
      let presReqData = await fetchResponse.json();

      // create an Abort Controller
      const controller = new AbortController();

      // Call the Digital Credentials API using the presentation request from the backend
      let dcResponse = await navigator.credentials.get({
        signal: controller.signal,
        digital: {
          requests: [{
            protocol: "openid4vp",
            data: presReqData
          }]
        }
      });

      // POST the response to the backend for verification
      let postResponse = await fetch('https://example.com/verifier/oid4vp/response/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dcResponse)
      });

      if (!postResponse.ok) {
        throw new Error('Failed to send response to backend');
      }

      // do something with server response here!

    } catch (error) {
      console.error('Error:', error);
    }
  } else {
    
    // fallback scenario
    alert("The Digital Credentials API is not supported in this browser.")
    // Illustrative only (don't actually do this :))

  }
};
```

## Android Native

## Fallback
