---
sidebar_position: 2
title: "OpenID4VP"
---

# OpenID for Verifiable Presentations

OpenID4VP over the DC API utilizes the mechanisms of the DC API while also allowing to leverage advanced security features of OpenID4VP, if needed. It also defines the OpenID4VP request parameters that MAY be used with the DC API.
For more details, refer to the [OpenID for Verifiable Presentations](https://openid.net/specs/openid-4-verifiable-presentations-1_0.html#name-openid4vp-over-the-digital-) specification.

Presentation of the verifiable credentials consists of 2 parts:
1. Presentation Request
2. Presentation Response

## Presentation Request
The Verifier backend provides the presentation request to the browser's JavaScript environment, which then invokes the Digital Credentials API as documented in [dc-api](/docs/requesting-credential/dc-api).
The presentation request can be of 2 types:

### Signed Presentation Request
This is a base64url-encoded and signed Request Object (the example below is signed with ES256 algorithm). More details can be found in the [OpenID for Verifiable Presentations](https://openid.net/specs/openid-4-verifiable-presentations-1_0.html#name-signed-request) specification.
Below is an example:
```json
{
  "digital": {
    "requests": [
      {
        "data": {
          "request": "eyJ0eXAiOiJvYXV0aC1hdXRoei1yZXErand0IiwiYWxnIjoiRVMyNTYiLCJ4NWMiOlsiTUlJQjl6Q0NBWnlnQXdJQkFnSVVVR1d5TllsajZSbnpwNUxJUHRHUFdLelN6QTB3Q2dZSUtvWkl6ajBFQXdJd09URUxNQWtHQTFVRUJoTUNWVk14S2pBb0JnTlZCQU1NSVdScFoybDBZV3hqY21Wa2N5NWtaWFl1ZEhKMWMzUmxaSEJoZEdndWFXNW1iekFlRncweU5UQTBNak14T1RVMk1ETmFGdzB5TmpBME1qTXhPVFUyTUROYU1Ea3hDekFKQmdOVkJBWVRBbFZUTVNvd0tBWURWUVFERENGa2FXZHBkR0ZzWTNKbFpITXVaR1YyTG5SeWRYTjBaV1J3WVhSb0xtbHVabTh3V1RBVEJnY3Foa2pPUFFJQkJnZ3Foa2pPUFFNQkJ3TkNBQVRFUTM1UGd6TlUrMUFnUjZMeGJCUVphSk5pRzlSeEhXQmxkeFdLd25FZ3RWRDFhOGw1eGNnaGxGeGQ2b0lJd3Y2T0FrOE1TaHY4WXpkaTVaWlBWb2pWbzRHQk1IOHdMQVlEVlIwUkJDVXdJNEloWkdsbmFYUmhiR055WldSekxtUmxkaTUwY25WemRHVmtjR0YwYUM1cGJtWnZNQjBHQTFVZERnUVdCQlNDNGVRNXdkVjIrOFE5aU1MMkdEaXArL2l6aVRBZkJnTlZIU01FR0RBV2dCU0M0ZVE1d2RWMis4UTlpTUwyR0RpcCsvaXppVEFQQmdOVkhSTUJBZjhFQlRBREFRSC9NQW9HQ0NxR1NNNDlCQU1DQTBrQU1FWUNJUURYNkJRbW5YN3FOcWl4MWJBeWNaSmZiclJ5VVNPcU8ydUYySDh0MXBoWE5nSWhBUG9yMXNNOE9KaUhYMGUvalRsc01zQ3BpMGk1ekJBaGxUZDBWVndYN0lsOSJdfQ.eyJyZXNwb25zZV90eXBlIjoidnBfdG9rZW4iLCJyZXNwb25zZV9tb2RlIjoiZGNfYXBpLmp3dCIsIm5vbmNlIjoiWlFTQ2t2VktoR2xjUkcyZGRwR0d6c1lOMSIsImNsaWVudF9tZXRhZGF0YSI6eyJqd2tzIjp7ImtleXMiOlt7Imt0eSI6IkVDIiwidXNlIjoiZW5jIiwiY3J2IjoiUC0yNTYiLCJraWQiOiI4OWI3YWIyNDg4ODUyZjVmNDhjMWM0NGNjZTk5NTk1MGMyMWNhM2YxNjRkODFjMDlkNmE1Yzk3Nzk1YjYxOGIzIiwieCI6IkxaMm14c0MzWEQ0TVVNTUVVamRXUFV1MkR5dDc1X2YwVHF1a29FOVFDaVkiLCJ5IjoiV0FuTjNjQlkwVHRueHY1QlBNbksyXzZ1cS1yQTN0ME03MGpkZ25VbmhsRSJ9XX0sInZwX2Zvcm1hdHNfc3VwcG9ydGVkIjp7Im1zb19tZG9jIjp7Imlzc3VlcmF1dGhfYWxnX3ZhbHVlcyI6Wy03XSwiZGV2aWNlYXV0aF9hbGdfdmFsdWVzIjpbLTddfX19LCJkY3FsX3F1ZXJ5Ijp7ImNyZWRlbnRpYWxzIjpbeyJpZCI6Im1kbCIsImZvcm1hdCI6Im1zb19tZG9jIiwibWV0YSI6eyJkb2N0eXBlX3ZhbHVlIjoib3JnLmlzby4xODAxMy41LjEubURMIn0sImNsYWltcyI6W3sicGF0aCI6WyJvcmcuaXNvLjE4MDEzLjUuMSIsImZhbWlseV9uYW1lIl19LHsicGF0aCI6WyJvcmcuaXNvLjE4MDEzLjUuMSIsImdpdmVuX25hbWUiXX1dfV19LCJjbGllbnRfaWQiOiJ4NTA5X3Nhbl9kbnM6ZGlnaXRhbGNyZWRzLmRldi50cnVzdGVkcGF0aC5pbmZvIiwiZXhwZWN0ZWRfb3JpZ2lucyI6WyJodHRwczovL2RpZ2l0YWxjcmVkcy5kZXYudHJ1c3RlZHBhdGguaW5mbyJdfQ.uybMmjpTG9wCXNgnXGkBiFax8owB-cPy560PSxrufFGS4puw_E9tPgMueah_Wj87tSfKC0f3YIuD4MW1ca1M3g"
        },
        "protocol": "openid4vp-v1-signed"
      }
    ]
  }
}
```
### Unsigned Presentation Request
This is a JSON object. Below is an example:
```json
{
  "digital": {
    "requests": [
      {
        "data": {
          "client_metadata": {
            "vp_formats_supported": {
              "mso_mdoc": {
                "deviceauth_alg_values": [
                  -7
                ],
                "issuerauth_alg_values": [
                  -7
                ]
              }
            }
          },
          "dcql_query": {
            "credentials": [
              {
                "claims": [
                  {
                    "path": [
                      "org.iso.18013.5.1",
                      "family_name"
                    ]
                  },
                  {
                    "path": [
                      "org.iso.18013.5.1",
                      "given_name"
                    ]
                  }
                ],
                "format": "mso_mdoc",
                "id": "mdl",
                "meta": {
                  "doctype_value": "org.iso.18013.5.1.mDL"
                }
              }
            ]
          },
          "nonce": "WEHZdYwHcVzHyp8lw62LwV8Ay",
          "response_mode": "dc_api",
          "response_type": "vp_token"
        },
        "protocol": "openid4vp-v1-unsigned"
      }
    ]
  }
}
```

## Presentation Response
The Verifier backend receives the presentation response from the browser's JavaScript environment, which had invoked the Digital Credentials API as documented in [dc-api](/docs/requesting-credential/dc-api).
This response can then be relayed to the Verifier backend for verification.
More details can be found in the [OpenID for Verifiable Presentations](https://openid.net/specs/openid-4-verifiable-presentations-1_0.html#name-response-2) specification.
The response can be of 2 types:

### Encrypted Presentation Response
Details can be found in the [OpenID for Verifiable Presentations](https://openid.net/specs/openid-4-verifiable-presentations-1_0.html#name-encrypted-responses) specification.
Below is an example of mdl encrypted response:
```json
{
    "data":{
        "vp_token":{
            "mdl": ["o2d2ZXJzaW9uYzEuMGlkb2N1bWVudHOBo2dkb2NUeXBldW9yZy5pc28uMTgwMTMuNS4xLm1ETGxpc3N1ZXJTaWduZWSiam5hbWVTcGFjZXOhcW9yZy5pc28uMTgwMTMuNS4xgtgYWFSkaGRpZ2VzdElEAGZyYW5kb21QyA1rq3z_3nYPSLhoQwcl0HFlbGVtZW50SWRlbnRpZmllcmtmYW1pbHlfbmFtZWxlbGVtZW50VmFsdWVlU21pdGjYGFhRpGhkaWdlc3RJRAFmcmFuZG9tUKfN8mrTghU-esMmxdQJ9NFxZWxlbWVudElkZW50aWZpZXJqZ2l2ZW5fbmFtZWxlbGVtZW50VmFsdWVjSm9uamlzc3VlckF1dGiEQ6EBJqEYIVkCxDCCAsAwggJnoAMCAQICFB5_GzKtTzTv5LDMB7ew4zOnCxhNMAoGCCqGSM49BAMCMHkxCzAJBgNVBAYTAlVTMRMwEQYDVQQIDApDYWxpZm9ybmlhMRYwFAYDVQQHDA1Nb3VudGFpbiBWaWV3MRwwGgYDVQQKDBNEaWdpdGFsIENyZWRlbnRpYWxzMR8wHQYDVQQDDBZkaWdpdGFsY3JlZGVudGlhbHMuZGV2MB4XDTI1MDIxOTIzMzAxOFoXDTI2MDIxOTIzMzAxOFoweTELMAkGA1UEBhMCVVMxEzARBgNVBAgMCkNhbGlmb3JuaWExFjAUBgNVBAcMDU1vdW50YWluIFZpZXcxHDAaBgNVBAoME0RpZ2l0YWwgQ3JlZGVudGlhbHMxHzAdBgNVBAMMFmRpZ2l0YWxjcmVkZW50aWFscy5kZXYwWTATBgcqhkjOPQIBBggqhkjOPQMBBwNCAATreTYr4tfzl8NQBH2D4eNiLONVazYPamjHWLsN3Gr4bAmvml1dDZk5dhLDWieRlpjKAA_IpMABbM2ISHjYBeNpo4HMMIHJMB8GA1UdIwQYMBaAFKJP9InZfEbobqOG2UdIzsy-3M_1MB0GA1UdDgQWBBTf_mpaEunAYsS8mKcl0tlw93pgKDA0BgNVHR8ELTArMCmgJ6AlhiNodHRwczovL2RpZ2l0YWwtY3JlZGVudGlhbHMuZGV2L2NybDAqBgNVHRIEIzAhhh9odHRwczovL2RpZ2l0YWwtY3JlZGVudGlhbHMuZGV2MA4GA1UdDwEB_wQEAwIHgDAVBgNVHSUBAf8ECzAJBgcogYxdBQECMAoGCCqGSM49BAMCA0cAMEQCIGHFy_V8weN78uCxM9ofIDEEXXCbWiEUDnpoMJvLB0LnAiBwr6LhxJv7p4wVzAnlGe0Ef8pqYxshyE8NufwfR_ULAlkDpNgYWQOfpmd2ZXJzaW9uYzEuMG9kaWdlc3RBbGdvcml0aG1nU0hBLTI1Nmdkb2NUeXBldW9yZy5pc28uMTgwMTMuNS4xLm1ETGx2YWx1ZURpZ2VzdHOhcW9yZy5pc28uMTgwMTMuNS4xsQBYIFzyZQg7ZkA1grdjM108zXfkzvHbFzlHOScn1GzZuv9OAVggXqOWEQI2XOdh43n-MHE1x9rwiCgyja9nGa6S3G7g0gwCWCAmSGOpISfK-s-ZpQIbcHVvYPEzjwuylPH-p8gc-n-04ANYIEBqAowiUts3l8LarZKqC7xDRcZQZEJ_La-Me_KjEmmzBFggcXDzD63D47INHQsad5Pxki834H4FNqUnJqHIsX_Z0BgFWCB929W3tRFzoRjElZksBRAzxdbqa3f8PVkoWjh1yK__OAZYIFB3Vn7spJAC-Gn8KHug63EOVoGbpfpgAGaplclPDRqqB1gg13dSWEeFYHH8KAzvvanHfH32PDME_8gxNMaaL_ajXa0IWCDimYKHpAKbLvP4fmh1iurn9nwJsa-qsTvOjmfq1qwMLQlYIJ30LH7o2TcTAgZWirVxOyxxF51Jw54XXHNURAI1bvRMClggqOdnvNdQEU4ly--lhhxuUMI6lgxEodCKNGLQ32AYZlwLWCCdn58bs0LsocwbrqeP38S_ETsVhbqYsZO1ISfNngoqmwxYIBpSS-NQZxNeiDpd6ed0EDDkcZ3d-Blqm4Mtg8vghwA3DVgg72cx0M_GmKyJXFlIZ7VsOsdWNjBYU6Efpck8_o51wRMOWCAhVhijSGH2AxUW4NZGa8TZEPzGt8HB5VNTIvMsC8ViaQ9YILQ5HQfNgQVrJdDE3kgKCosXjWpb5cf9xZSN1VTaD5vZEFgg1_wsn7f8q_MZtj5jgd1xv9GHkG20vW-AjBtNUtWMaMptZGV2aWNlS2V5SW5mb6FpZGV2aWNlS2V5pAECIAEhWCCl92rQyXlTH9IGjptkf1-NAqp7TlWQpc6U8c3ymc41EyJYIMuP7pXU_susKXLY0UZYbZfWppwqWAN7biHi83EXe4vEbHZhbGlkaXR5SW5mb6Nmc2lnbmVkwHgbMjAyNS0wNi0xNlQxNTo1NjowNy40MzQ4NDJaaXZhbGlkRnJvbcB4GzIwMjUtMDYtMTZUMTU6NTY6MDcuNDM0ODU2Wmp2YWxpZFVudGlswHgbMjAzNS0wNi0wNFQxNTo1NjowNy40MzQ4NTdaWEDVVbsN81M2DVAUxo2OKwC5evVExkrzJsfAGAjdoz3hMAkq64Eip2-9-Ja8SmiNc6cwqKXIG_RcKH877YZM9XxybGRldmljZVNpZ25lZKJqbmFtZVNwYWNlc9gYQaBqZGV2aWNlQXV0aKFvZGV2aWNlU2lnbmF0dXJlhEOhASag9lhA5H_ywACJmomFe_KE-g7JV-GPCqBZ7codseoXzFDlLdyp9nn7mWTACb9ZblP3IjzA-7yQXJsPeDf2DRNfB0FWjmZzdGF0dXMA"]
        }
    },
    "id":"",
    "protocol": "openid4vp-v1-unsigned",
    "type":"digital"
}
```

### Unencrypted Presentation Response
More details can be found in the [OpenID for Verifiable Presentations](https://openid.net/specs/openid-4-verifiable-presentations-1_0.html#name-response-2) specification.
Below is an example of sd-jwt unencrypted response:
```json
{
    "data":{
        "vp_token":{
            "pid": ["eyJhbGciOiAiRVMyNTYiLCAidHlwIjogImRjK3NkLWp3dCIsICJ4NWMiOiBbIk1JSUM1akNDQW8yZ0F3SUJBZ0lVRVJjNEQzRVpQY25MdXg2N1ZWZDU4d2lrWGRjd0NnWUlLb1pJemowRUF3SXdlakVMTUFrR0ExVUVCaE1DVlZNeEV6QVJCZ05WQkFnTUNrTmhiR2xtYjNKdWFXRXhGakFVQmdOVkJBY01EVTF2ZFc1MFlXbHVJRlpwWlhjeEhEQWFCZ05WQkFvTUUwUnBaMmwwWVd3Z1EzSmxaR1Z1ZEdsaGJITXhJREFlQmdOVkJBTU1GMlJwWjJsMFlXd3RZM0psWkdWdWRHbGhiSE11WkdWMk1CNFhEVEkxTURReU5URTBNVEl5TmxvWERUSTJNRFF5TlRFME1USXlObG93ZWpFTE1Ba0dBMVVFQmhNQ1ZWTXhFekFSQmdOVkJBZ01Da05oYkdsbWIzSnVhV0V4RmpBVUJnTlZCQWNNRFUxdmRXNTBZV2x1SUZacFpYY3hIREFhQmdOVkJBb01FMFJwWjJsMFlXd2dRM0psWkdWdWRHbGhiSE14SURBZUJnTlZCQU1NRjJScFoybDBZV3d0WTNKbFpHVnVkR2xoYkhNdVpHVjJNRmt3RXdZSEtvWkl6ajBDQVFZSUtvWkl6ajBEQVFjRFFnQUV1TGQ1aUhPK05UNlJzNDZwQkFrQWM4RW1mb3gvOGtqSXJFclF2UGFBSjMxemRWWEV2a1pPZFFqV0wydy9xblJKZ2c4c2hETnp5RUZ0UENqMTg0WExGcU9COERDQjdUQWZCZ05WSFNNRUdEQVdnQlQ2aVpRaFo4NG83Mi9lWGZyZHpxMXBUSTdQQ2pBZEJnTlZIUTRFRmdRVWc3ZE1LSjViaElVTnBsS2RmWFlhUkdQQ2dOVXdJZ1lEVlIwUkJCc3dHWUlYWkdsbmFYUmhiQzFqY21Wa1pXNTBhV0ZzY3k1a1pYWXdOQVlEVlIwZkJDMHdLekFwb0NlZ0pZWWphSFIwY0hNNkx5OWthV2RwZEdGc0xXTnlaV1JsYm5ScFlXeHpMbVJsZGk5amNtd3dLZ1lEVlIwU0JDTXdJWVlmYUhSMGNITTZMeTlrYVdkcGRHRnNMV055WldSbGJuUnBZV3h6TG1SbGRqQU9CZ05WSFE4QkFmOEVCQU1DQjRBd0ZRWURWUjBsQVFIL0JBc3dDUVlIS0lHTVhRVUJBakFLQmdncWhrak9QUVFEQWdOSEFEQkVBaUFnR3VXekxpdnJGbTRWOU45SEN5Z1ErbHU2am9zN2FlZ0d1N2xaOEs1WFFRSWdLM1N0Rm5nL2YwTTdhcUZGWGs1S0VUUTN1UUZtY3JUcVE3eHJwWWF3dTFNPSIsICJNSUlDdVRDQ0FsK2dBd0lCQWdJVVE3aG5TbTNrSWRGdUFOYW5GcGs0ekVkeW4xc3dDZ1lJS29aSXpqMEVBd0l3ZWpFTE1Ba0dBMVVFQmhNQ1ZWTXhFekFSQmdOVkJBZ01Da05oYkdsbWIzSnVhV0V4RmpBVUJnTlZCQWNNRFUxdmRXNTBZV2x1SUZacFpYY3hIREFhQmdOVkJBb01FMFJwWjJsMFlXd2dRM0psWkdWdWRHbGhiSE14SURBZUJnTlZCQU1NRjJScFoybDBZV3d0WTNKbFpHVnVkR2xoYkhNdVpHVjJNQjRYRFRJMU1EUXlOVEUwTVRJeU5sb1hEVE0xTURReE16RTBNVEl5Tmxvd2VqRUxNQWtHQTFVRUJoTUNWVk14RXpBUkJnTlZCQWdNQ2tOaGJHbG1iM0p1YVdFeEZqQVVCZ05WQkFjTURVMXZkVzUwWVdsdUlGWnBaWGN4SERBYUJnTlZCQW9NRTBScFoybDBZV3dnUTNKbFpHVnVkR2xoYkhNeElEQWVCZ05WQkFNTUYyUnBaMmwwWVd3dFkzSmxaR1Z1ZEdsaGJITXVaR1YyTUZrd0V3WUhLb1pJemowQ0FRWUlLb1pJemowREFRY0RRZ0FFcUlEL0lLV21UMGVlYmQzaEd5OEIwQ2R6VDlxclliOG5IYVFSNGJFNG5YUVFCSEF3ZFd5bTJqakxmYjVXbzJzSCtSdkZrRkFwUG5tdjBhcFA3SXkwaTZPQndqQ0J2ekFpQmdOVkhSRUVHekFaZ2hka2FXZHBkR0ZzTFdOeVpXUmxiblJwWVd4ekxtUmxkakFkQmdOVkhRNEVGZ1FVK29tVUlXZk9LTzl2M2wzNjNjNnRhVXlPendvd0h3WURWUjBqQkJnd0ZvQVUrb21VSVdmT0tPOXYzbDM2M2M2dGFVeU96d293RWdZRFZSMFRBUUgvQkFnd0JnRUIvd0lCQURBT0JnTlZIUThCQWY4RUJBTUNBUVl3S2dZRFZSMFNCQ013SVlZZmFIUjBjSE02THk5a2FXZHBkR0ZzTFdOeVpXUmxiblJwWVd4ekxtUmxkakFKQmdOVkhSOEVBakFBTUFvR0NDcUdTTTQ5QkFNQ0EwZ0FNRVVDSUEwdFc0ayt1SEFsOXRmNFdOa3NxRVIwT1JLK2pHd1NoV2Z2RjJtVzZKenZBaUVBaGhjQUxxNm1sSmd2MThwZnpjZ1B6N3lPMTc1bmxFWTF0ZVlpYVBmWWlucz0iXX0.eyJfc2QiOiBbIlZILXh3UVR4SW0tYWc0dGhNc2NoLUQ0RDZKQ2t6WmdfWVhhSDY1TVJLR0kiLCAibDRSMkNEVzZMcjZGLVZBTkc4WFNQdk1RSEZvQnkxMnpDMGdVa0ZYY2duZyJdLCAiYWdlX2VxdWFsX29yX292ZXIiOiB7Il9zZCI6IFsiU1ZNTjl5eGJmbGs4OGJ5aWRJb1VDWFBrbzk5T1A0NmJZbVhoMVdPZDlVZyIsICJVNm5JWFRZa0VBamJGWllBdzNZNzZCbzJnTzlRaHVObWhNdTZTV3pTLUNrIiwgImQwWmV5YW9fWmVOQXk0NDI5cldMMXpTRmxYV08wbjdCZXBqS2lpdVZaNXMiXX0sICJhZGRyZXNzIjogeyJfc2QiOiBbIjZ6djBMTDVlMkZGWHczcjVjeXlUaEhJWVRoUVoweXRUbTlOYmpiSkRkTjQiLCAiXy1kbVhUc2ZPc05DX3J0Qm9NZjNPaDFySUk4dHhuTlRick9PX3RrcFRZYyIsICJtRXBBYjg3eHd1VktqbHlVOGg4Sm1mX3RzdDlXNnNPaEhBb1FhSFl4alVFIiwgInNsUjlOSnhlemlnbmh1TURNYllZU1JmWnFiYUxYUmZZX3hIQnVVeUg3RTAiXX0sICJpc3MiOiAiaHR0cHM6Ly9kaWdpdGFsLWNyZWRlbnRpYWxzLmRldiIsICJpYXQiOiAxNjgzMDAwMDAwLCAiZXhwIjogMTg4MzAwMDAwMCwgInZjdCI6ICJ1cm46ZXVkaTpwaWQ6MSIsICJfc2RfYWxnIjogInNoYS0yNTYiLCAiY25mIjogeyJqd2siOiB7Imt0eSI6ICJFQyIsICJjcnYiOiAiUC0yNTYiLCAieCI6ICJvVXhTOWJGZkloMjZQLUxNU1pXamRDVHlhaEZoRllmSHRSTXYtbUt5MnkwIiwgInkiOiAiU2JHdHdEUHJySU56TkpQTmJ6cUdqMUp0SGNCUFowQzJCaS1MR3RVVDdSUSJ9fX0.vxSjJ4qlF3GuwBNwp5B-vf6nz6MITIWKY1vzKLK8Z_E86BXSTU1r3YlzXEB6M9D4FU24Uw-6_sTYfxsPVH-XAQ~WyJ5Qm11OVh6TmZRV3EtYkJYMnhHMHlnIiwgImZhbWlseV9uYW1lIiwgIk11c3Rlcm1hbm4iXQ~WyJmN0tjMXFNdlhHU0cxMEZyZDFmM19RIiwgImdpdmVuX25hbWUiLCAiRXJpa2EiXQ~eyJ0eXAiOiJrYitqd3QiLCJhbGciOiJFUzI1NiJ9.eyJpYXQiOjE3NTM0OTU2NTUsImF1ZCI6Im9yaWdpbjpodHRwOi8vMTI3LjAuMC4xOjgwMDAiLCJub25jZSI6IjZ3M2dLcnZDREdzRmw5UDJzRk9iQzZGb3oiLCJzZF9oYXNoIjoiRzc4YjRTWWhXeVA1eVFuVUdXNGFXY1pSWXg1MEx6WFZ4V0RVUFB5SUE5ZyJ9.N_dm0GxjqK18zp6Cv0mDRu0GrLYO-HwOc59KYwayQ0wWgndf5ZQRXjoc7EgTfcBZupHYoC7dBcC1dk-ajG9SaQ"
    ]
        }
    },
    "id":"",
    "protocol": "openid4vp-v1-unsigned",
    "type":"digital"
}
```