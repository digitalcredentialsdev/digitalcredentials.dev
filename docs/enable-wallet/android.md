---
sidebar_position: 1
---

# Android

## Android Credential Manager API

### Building the sample wallet app

You can build our samples as a starting point.

1. Setup a local maven repo. Download the local maven repo from [here](https://drive.google.com/file/d/1NFe5hLqijJlQ1FdDDcknFuPDm1pdoDiy/view?usp=drive_link&resourcekey=0-2IHDv4dq8t6EW5LiDYmqDw)

```bash
cd ~/.m2/repository
unzip idsdk.zip
```

2. Check out the sample code: https://github.com/google/identity-credential/tree/android-credential-manager
:::note
Make sure you use the `android-credential-manager` branch
:::

3. Load the project in Android Studio

4. Build the "App Holder" app and install it on your device

## Setting up the SDK in your app

:::note
Remember to only use the two app package names you shared with us. We allow-listed them to use this API while the API is still under development so that we can control backwards incompatible breaking changes.
:::

1. You need to add the local maven repo to your settings.gradle file.
2. You can do this by adding `mavenLocal()` to the repositories section.
3. Next add the SDK dependency to your build.gradle.

```kotlin
 implementation 'com.google.android.gms:play-services-identity-credentials:0.0.1-eap01'
```

> Example: https://github.com/google/identity-credential/blob/android-credential-manager/appholder/build.gradle#L80

### Where to look in the sample wallet

The credential registration happens here:
https://github.com/google/identity-credential/blob/android-credential-manager/appholder/src/main/java/com/android/mdl/app/document/DocumentManager.kt#L88

## The Provider API

:::note
This API will be provided as part of the [Credential Manager Jetpack Library](https://developer.android.com/jetpack/androidx/releases/credentials). Unfortunately we can’t share this with you directly quite yet. Instead you’ll use some slightly lower-level APIs. Jetpack just provides more developer friendly wrappers over the API you’ll be using today. It's still fairly straightforward but note that when this API is released the public API will be exposed via Cred Man.
:::

The incoming request parameters are provided to your wallet app as a JSON string. This JSON string is provided by the calling RP application. The specification of this JSON is currently being defined by the W3C, but this API doesn’t concern itself with its contents. It is the responsibility of your wallet app to parse this request and form the response.

Chrome and our test apps provide the JSON in the following form. This is just a simple request format to demonstrate the API, this will likely evolve in the W3C working group. This is the RedBox in David’s ISO presentation.

```json
{
  "providers": [
    {
      "protocol": "basic",
      "request": "{\"selector\":{\"format\":[\"mdoc\"] ... c9QZ7X/6w...\"}}"
    }
  ]
}
```

The provider API allows you to define the matching logic used by your wallet to decide which documents/credentials to show in Credential Selection UI for a given json request.

This matcher logic is defined as a wasm module that you register with the system as follows

```kotlin
val registrationRequest = RegistrationRequest(
      credentials = yourMetaData,  // A binary blob that we pass to your matcher
      matcher = yourMatcherBinary, // The wasm module
      type = "com.credman.IdentityCredential" // has to set to this
    )

val client = IdentityCredentialManager.Companion.getClient(context)
client.registerCredentials(registrationRequest)
```

Android will execute your wasm matcher in a sandbox upon receiving a request from an RP application or website. The matcher binary will be provided with the credential data blob you provide as part of registration, the incoming request json from the calling RP and the calling app information (calling packagename or origin). The matcher's job is to parse the incoming request and to populate the entries in the selector UX.

As per above, we will provide more developer friendly APIs in jetpack towards the end of the year. This includes default matchers and helper classes. So most wallets won’t need to deal with writing their own matcher unless they have some complex matching logic or want to support a new credential type.

For this proof of concept you can use the matcher from our demo app. You can place it in your assets folder in your app. You can find it here:
https://github.com/google/identity-credential/tree/android-credential-manager/appholder/src/main/assets

There are 3 helper classes that you can copy and paste into your wallet app, they can be found here:
https://github.com/google/identity-credential/tree/android-credential-manager/appholder/src/main/java/com/android/mdl/app/credman

These helpers use the provided matcher and build up the credential data in a structure the matcher understands.

You can use these helpers to register a simple credential as follows:

```kotlin
val fields = mutableListOf<IdentityCredentialField>()
// Add the doc type field
fields.add(IdentityCredentialField(
name = "doctype",
       value = "fakedoc",
       displayName = "Document Type",
       displayValue = "Fake doc type"
))

// Add a name field
fields.add(IdentityCredentialField(
name = "firstname",  // field name is required for matching the fields in the json
       value = "Erika",  // the vaule is optional.
       displayName = "First Name", // required to show the matched fields in the selector
       displayValue = "Erika"  // the vaule is optional.
))

// Create the entry
val entry = listOf(IdentityCredentialEntry(
id = 1, // will be passed to your app if the credential is picked by the user
       format = "mdoc",
                title = "Erika's's Driving License",
                subtitle = "California DMV",
                icon = BitmapFactory.decodeResource(context.resources, R.mylogo),
                fields = fields.toList(),
                disclaimer = null,
                warning = null,
 ))

// Create the registry with the list of entries
val registry = IdentityCredentialRegistry(listOf(entry))
// Register using the stock matcher
val client = IdentityCredentialManager.Companion.getClient(context)
client.registerCredentials(registry.toRegistrationRequest(context))
```

Once you implement the above registration flow, you can test the web app, your credentials should appear in the selector (assuming they have the required fields to be considered a match).

### Invocation

This API attempts to provide a huge amount of flexibility for the wallet application. The goal is to just handle credential selection and wallet invocation. All Android requires is that the wallet (via the matcher) provides enough information about the credential and the requested attributes that we can render a selector. This information allows the user to make an informed choice about which document to proceed with.

Once a credential is selected by the user Android will intent into the wallet app, where it can show its own UI to gather consent from the user, e.g by showing a biometric prompt. Our sample app doesn’t show any UI, but we suggest your app shows at least a biometric prompt.

You need to add a new Activity to your app with the following intent handler in the manifest
com.google.android.gms.identitycredentials.action.GET_CREDENTIALS

Here is an example:

```xml
<activity android:label="@string/app_name" android:name=".GetCredentialActivity" android:enabled="true" android:exported="true">
    <intent-filter>
        <action android:name="androidx.identitycredentials.action.GET_CREDENTIALS" />
        <category android:name="android.intent.category.DEFAULT" />
    </intent-filter>
</activity>
```

Android will invoke this Activity if your credential is selected by the user. You should use it to obtain user consent and form the response.

Again helper libs will do most of this heavy lifting in the future but for now you’ll be exposed to a bit of the plumbing.

Our sample Activity is here: https://github.com/google/identity-credential/blob/android-credential-manager/appholder/src/main/java/com/android/mdl/app/GetCredentialActivity.kt

In your onCreate method you should obtain the request:

```kotlin
// The JSON from the calling app
val request = extractGetCredentialRequest(intent)

// the credential ID of the selected credential (registered above)
val credentialId = intent.getLongExtra(EXTRA_CREDENTIAL_ID, -1)

// The calling app info
val callingAppInfo = extractCallingAppInfo(intent)
```

You should parse the request and generate the response for the selected credential.

The response is provided as a ByteArray. Our demo apps place a base64 encoded string of encrypted response in this byte array. (at some point we’ll change this to a string)

This string is passed directly back to the calling app. Again Android does not concern itself with the format of the request or the response. We leave it to the wallet to understand the format of the request and generate the response.

The response is provided as follows (again helpers in the future will hide some of these gory details):

```kotlin
val bundle = Bundle()
// you need to generate the encodedCredentialDocument
bundle.putByteArray("identityToken", Base64.encodeToString(encodedCredentialDocument, Base64.NO_WRAP or Base64.URL_SAFE).toByteArray())
val credentialResponse = com.google.android.gms.identitycredentials.Credential("type", bundle)
val response = GetCredentialResponse(credentialResponse)
val resultData = Intent()
setGetCredentialResponse(resultData, response)
setResult(RESULT_OK, resultData)
finish()
```

### Generating the response

The best way is probably to look at the sample code :)

The logic starts here: https://github.com/google/identity-credential/blob/android-credential-manager/appholder/src/main/java/com/android/mdl/app/GetCredentialActivity.kt#L151

Much of the heavy lifting is performed in this class:
https://github.com/google/identity-credential/blob/android-credential-manager/identity-android/src/main/java/com/android/identity/android/mdoc/util/CredmanUtil.kt

Its a standard mdoc device response CBOR, encrypted with HPKE. The main change is the session transcript, which is generated here:
https://github.com/google/identity-credential/blob/android-credential-manager/appholder/src/main/java/com/android/mdl/app/GetCredentialActivity.kt#L158

:::note
We always set the calling package name to `com.android.mdl.appreader` in our sample apps, so you’ll need to do this too until we fix this hack.
:::
