Developer Keyrings - For Development Workflows

While the previous pages focused on keyrings used to store user or organization credentials, DevRev also offers a special type called developer keyrings. These keyrings cater specifically to developers during the creation process.

* Unlike other keyrings that store user credentials, developer keyrings are designed to hold sensitive information needed by the developer during development and execution of any particular task.
* These secrets are provided by you, the developer, during the creation of a snap_in version. They are not exposed to users and are stored separately from the snap_in itself.

**Types of Developer Keyrings:**

* **snap_in_secret:** This is a simple way to store any plain text secret your snap_in requires. It's ideal for sensitive information that doesn't require complex formatting.
* **oauth_secret:** This type of keyring is specifically designed to store OAuth client credentials securely. It allows you to define two separate fields:
  * client_id: The client ID provided by the OAuth provider.
  * client_secret: The client secret provided by the OAuth provider.

Creating a Developer Keyring

To create a developer keyring, follow these steps:

1. creating a keyring type of snap_in_secret:
   * Using the UI:
     Navigate to the Snap-in page, click on the connection tab, and then find the snap_in_secret keyring type.
   * Using the CLI:
     Run the following command:
     ```bash
     echo \"[SECRET]\" | devrev developer_keyring create snap-in-secret <name of the keyring>
     ```
2. creating a keyring type of oauth_secret:
    * Using the CLI:
      Run the following command:
      ```bash
      echo '{"client_id":"[CLIENT_ID]","client_secret":"[CLIENT_SECRET]"}' | devrev developer_keyring create oauth-secret <NAME>
      ```
Once you've created the keyring, you can use it in your snap_in by referencing the keyring name in the snap_in manifest file.

**Declaring Developer Keyrings in the Snap-in Manifest:**

This section explains how to declare a developer keyring in your snap-in manifest. Developer keyrings provide a secure way to store sensitive information needed by your snap-in, such as OAuth client credentials.

Syntax:
```yaml
  developer_keyrings:
    - name: <name of the keyring>
      description: <description of the keyring>
      display_name: <display name of the keyring>
```

When creating a new `snap_in_version` using the developer tools, you will be prompted to provide the values for the declared developer keyrings. This ensures that the sensitive information is securely stored and accessible to your snap-in at runtime.
