---
page_type: sample
description: This sample demos linking user's AAD id with Facebook and google account of user from bot, ME and tab.
products:
- office-teams
- office
- office-365
languages:
- csharp
extensions:
contentType: samples
createdDate: "7-03-2022 00:15:13"
---

# App identity linking with sso sample

This sample demos linking user's AAD id with Facebook and google account of user from bot, ME and tab.

## Key features

Bot Mapping

![Bot](IdentityLinkingWithSSO/Images/BotLinkingOptionCard.png)

Tab mapping

![Tab](IdentityLinkingWithSSO/Images/Tab.png)

Messaging Extention mapping

- ME Action

  ![ME action](IdentityLinkingWithSSO/Images/MEActionsCard.png)

  ![ME action](IdentityLinkingWithSSO/Images/MEActionsLinkCard.png)

- ME Search

  ![ME search](IdentityLinkingWithSSO/Images/MESearch.png)

  ![ME search](IdentityLinkingWithSSO/Images/MESearchLinkCard.png)
   
- ME Link unfurling

  ![ME Link unfurling](IdentityLinkingWithSSO/Images/MELinkUnfurlingCard.png)
  
## Prerequisites

- [.NET Core SDK](https://dotnet.microsoft.com/download) version 3.1

  determine dotnet version
  ```bash
  dotnet --version
  ```
- [Ngrok](https://ngrok.com/download) (For local environment testing) Latest (any other tunneling software can also be used)
  
  run ngrok locally
  ```bash
  ngrok http -host-header=localhost 3978
  ```
- [Teams](https://teams.microsoft.com) Microsoft Teams is installed and you have an account

### Register your Teams Auth SSO with Azure AD

1. Register a new application in the [Azure Active Directory – App Registrations](https://go.microsoft.com/fwlink/?linkid=2083908) portal.
2. Select **New Registration** and on the *register an application page*, set following values:
    * Set **name** to your app name.
    * Choose the **supported account types** (any account type will work)
    * Leave **Redirect URI** empty.
    * Choose **Register**.
3. On the overview page, copy and save the **Application (client) ID, Directory (tenant) ID**. You’ll need those later when updating your Teams application manifest and in the appsettings.json.
4. Under **Manage**, select **Expose an API**. 
5. Select the **Set** link to generate the Application ID URI in the form of `api://{AppID}`. Insert your fully qualified domain name (with a forward slash "/" appended to the end) between the double forward slashes and the GUID. The entire ID should have the form of: `api://fully-qualified-domain-name/{AppID}`
    * ex: `api://%ngrokDomain%.ngrok.io/00000000-0000-0000-0000-000000000000`.
6. Select the **Add a scope** button. In the panel that opens, enter `access_as_user` as the **Scope name**.
7. Set **Who can consent?** to `Admins and users`
8. Fill in the fields for configuring the admin and user consent prompts with values that are appropriate for the `access_as_user` scope:
    * **Admin consent title:** Teams can access the user’s profile.
    * **Admin consent description**: Allows Teams to call the app’s web APIs as the current user.
    * **User consent title**: Teams can access the user profile and make requests on the user's behalf.
    * **User consent description:** Enable Teams to call this app’s APIs with the same rights as the user.
9. Ensure that **State** is set to **Enabled**
10. Select **Add scope**
    * The domain part of the **Scope name** displayed just below the text field should automatically match the **Application ID** URI set in the previous step, with `/access_as_user` appended to the end:
        * `api://[ngrokDomain].ngrok.io/00000000-0000-0000-0000-000000000000/access_as_user.
11. In the **Authorized client applications** section, identify the applications that you want to authorize for your app’s web application. Each of the following IDs needs to be entered:
    * `1fec8e78-bce4-4aaf-ab1b-5451cc387264` (Teams mobile/desktop application)
    * `5e3ce6c0-2b1f-4285-8d4b-75ee78787346` (Teams web application)
12. Navigate to **API Permissions**, and make sure to add the follow permissions:
-   Select Add a permission
-   Select Microsoft Graph -\> Delegated permissions.
    - `User.Read` (enabled by default)
-   Click on Add permissions. Please make sure to grant the admin consent for the required permissions.
13. Navigate to **Authentication**
    If an app hasn't been granted IT admin consent, users will have to provide consent the first time they use an app.
    Set a redirect URI:
    * Select **Add a platform**.
    * Select **web**.
    * Enter the **redirect URI** for the app in the following format: `https://{Base_Url}/auth-end`. This will be the page where a successful implicit grant flow will redirect the user.
    Enable implicit grant by checking the following boxes:  
    ✔ ID Token  
    ✔ Access Token  
14.  Navigate to the **Certificates & secrets**. In the Client secrets section, click on "+ New client secret". Add a description(Name of the secret) for the secret and select “Never” for Expires. Click "Add". Once the client secret is created, copy its value, it need to be placed in the appsettings.json.

15. Create a Azure bot service
   In Azure portal, create a [Azure bot service](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-authentication?view=azure-bot-service-4.0&tabs=csharp%2Caadv2).

   - Ensure that you've [enabled the Teams Channel](https://docs.microsoft.com/en-us/azure/bot-service/channel-connect-teams?view=azure-bot-service-4.0)
  

16. To test facebook auth flow [create a facebookapp](https://docs.microsoft.com/en-us/azure/bot-service/bot-service-channel-connect-facebook?view=azure-bot-service-4.0) and get client id and secret for facebook app.
- Bot auth setup
    Now go to your bot channel registartion -> configuration -> Add OAuth connection string
   - Provide connection Name : for eg `facebookconnection`
   - Select service provider add `facebook`
   - Add clientid and secret of your facebook app that was created using Step 16 and save.

   - Tab auth setup
     - After creating the app and getting client id and secret, make sure you add facebook login service under products section of your facebook app.
     ![FacebookProduct](IdentityLinkingWithSSO/Images/FacebookProduct.png)
      - Go to facebook settings and under valid domains, make sure to add the following url's
      - `https://token.botframework.com/.auth/web/redirect`
      - `https://<<base url>>/facebook-auth-end`
       ![validDomains](IdentityLinkingWithSSO/Images/ValidDomainsFacebook.png)

17.  Google app setup.
 - Obtain OAuth2 client credentials from the [Google API Console](https://console.developers.google.com/). Enable access to the [Google People API](https://developers.google.com/people/). 

    - In "Authorized redirect URLs", add `https://token.botframework.com/.auth/web/redirect` and `<<base-url>>/google-auth-end`.

    ![validDomains](IdentityLinkingWithSSO/Images/ValidDomainsGoogle.png)

    - Note your app's "Client ID" and "Client Secret".
    - Now go to your bot channel registartion -> configuration -> Add OAuth connection string
    - Provide connection Name : for eg `googleconnection`
    - Select service provider as `google`
  
18. Clone the repository
   ```bash
   git clone https://github.com/OfficeDev/Microsoft-Teams-Samples.git
   ```

19. Open the code in Visual Studio
   - File -> Open -> Project/Solution
   - Navigate to folder where repository is cloned then `samples/identity-linking=with-sso/IdentityLinkingWithSSO.sln`
    
20. Run ngrok - point to port 3978

    ```bash
    # ngrok http -host-header=rewrite 3978
    ```
 
21. Setup and run the bot from Visual Studio: 
    Modify the `appsettings.json` and fill in the following details:
   - `{{Microsoft-App-id}}` - Generated from Step 3 (Application (client) ID)is the application app id
   - `{{TenantId}}` - Generated from Step 3(Directory (tenant) ID) is the tenant id
   - `{{MicrosoftAppPassword}}` - Generated from Step 14, also referred to as Client secret
   - `{{base-url}}` - Your application's base url. E.g. https://12345.ngrok.io if you are using ngrok.
   - `{{ Connection Name }}` - Generated from step 15.
   - `{{FacebookAppId}} and {{FacebookAppPassword}} and {{ Facebook Connection Name}}`- Generated from step 16.
   - `{{GoogleAppId}} and {{GoogleAppPassword}} and {{GoogleConnectionName}}` - Generated from step 17.
   - Press `F5` to run the project
	 
22. Modify the `manifest.json` in the `/AppPackage` folder and replace the following details:
   - `{{Microsoft-App-Id}}` with Application id generated from Step 3
   - `{Base_URL}` - Your application's base url. E.g. https://12345.ngrok.io if you are using ngrok.
   - `{{domain-name}}` with base Url domain. E.g. if you are using ngrok it would be `https://1234.ngrok.io` then your domain-name will be `1234.ngrok.io`.

23. Zip the contents of `AppPackage` folder into a `manifest.zip`, and use the `manifest.zip` to deploy in app store or add to Teams using step

24. Upload the manifest.zip to Teams (in the Apps view click "Upload a custom app")
   - Go to Microsoft Teams and then go to side panel, select Apps
   - Choose Upload a custom App
   - Go to your project directory, the ./AppPackage folder, select the zip folder, and choose Open.
   - Select Add in the pop-up dialog box. Your app is uploaded to Teams.


## Deploy the bot to Azure

To learn more about deploying a bot to Azure, see [Deploy your bot to Azure](https://aka.ms/azuredeployment) for a complete list of deployment instructions.

## Further reading

- [Bot Framework Documentation](https://docs.botframework.com)
- [Bot Basics](https://docs.microsoft.com/azure/bot-service/bot-builder-basics?view=azure-bot-service-4.0)
- [Authentication basics](https://docs.microsoft.com/en-us/microsoftteams/platform/concepts/authentication/authentication)
