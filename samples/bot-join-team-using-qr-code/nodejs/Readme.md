---
page_type: sample
description: This sample demos a feature where user can join a team using QR code containing the team's id.
products:
- office-teams
- office
- office-365
languages:
- nodejs
extensions:
contentType: samples
createdDate: "24-12-2021 23:35:25"
---

# Join a team using QR code sample

This sample demos a feature where user can join a team using QR code having team id.

User can generate a new QR code (contains team id information) and then scan the QR code to join the team.

`Currently, Microsoft Teams support for QR or barcode scanner capability is only supported for mobile clients`

- Type a message to get a card to generate the QR code.

 ![Card](Images/CardWithButtons.png)

- Select the team from dropdown list for which you want to generate the QR code and then click on      'Generate QR' button.

 ![QR Code](Images/QRCode.png)

- Scan the generated QR code to join the team.

 ![Join Team](Images/TeamQR.png)

## Prerequisites

- Microsoft Teams is installed and you have an account (not a guest account)
-  [NodeJS](https://nodejs.org/en/)
-  [ngrok](https://ngrok.com/) or equivalent tunneling solution
-  [M365 developer account](https://docs.microsoft.com/en-us/microsoftteams/platform/concepts/build-and-test/prepare-your-o365-tenant) or access to a Teams account with the 
   appropriate permissions to install an app.

## To try this sample

> Note these instructions are for running the sample on your local machine, the tunnelling solution is required because
> the Teams service needs to call into the bot.

### 1. Setup for Bot SSO

a) In Azure portal, create a [Azure Bot resource.](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-authentication?view=azure-bot-service-4.0&tabs=userassigned%2Caadv2%2Ccsharp).

- Ensure that you've [enabled the Teams Channel](https://docs.microsoft.com/en-us/azure/bot-service/channel-connect-teams?view=azure-bot-service-4.0)

b) Navigate to **API Permissions**, and make sure to add the follow permissions:
   - Select Add a permission
   - Select Microsoft Graph -\> Delegated permissions.
       * User.Read (enabled by default)
       * Directory.AccessAsUser.All
       * TeamMember.ReadWrite.All

   - Click on Add permissions.

   ![Install App](Images/Permission.png)

### 2. Run your bot sample
1) Clone the repository

    ```bash
    git clone https://github.com/OfficeDev/Microsoft-Teams-Samples.git
    ```

2) In a terminal, navigate to `samples/bot-join-team-using-qr-code/nodejs`

3) Install node modules

   Inside node js folder, open your local terminal and run the below command to install node modules. You can do the same in Visual Studio code terminal by opening the project in Visual Studio code.

    ```bash
    npm install
    ```
4) Run ngrok - point to port 3978

    ```bash
    ngrok http -host-header=rewrite 3978
    ```
5) Open the `.env` configuration file in your project folder (or in Visual Studio Code) and update the following details:
  - `MicrosoftAppId` - It is the AppId created in step 1.a (Setup for Bot SSO)
  - `MicrosoftAppPassword` - It is referred to as the "client secret" in step 1.a (Setup for Bot SSO) and you can always create a new client secret anytime
  - `ConnectionName` - Generated from Step 1.a, is the name that we provide while adding OAuth connection setting in Azure Bot resource. Please follow [Add authentication to bot](https://docs.microsoft.com/en-us/microsoftteams/platform/bots/how-to/authentication/add-authentication?tabs=dotnet%2Cdotnet-sample#azure-ad-v2) to configure the connection.
  - `BaseUrl` with application base url. For e.g., your ngrok url. 

6) Run your app

    ```bash
    npm start
    ```
- **Manually update the manifest.json**
    - Edit the `manifest.json` contained in the  `appPackage/` folder to replace with your MicrosoftAppId (that was created in step1.a and is the same value of MicrosoftAppId in `.env` file) *everywhere* you see the place holder string `{MicrosoftAppId}` (depending on the scenario the Microsoft App Id may occur multiple times in the `manifest.json`)
    - Zip up the contents of the `appPackage/` folder to create a `manifest.zip`
    - Upload the `manifest.zip` to Teams (in the left-bottom *Apps* view, click "Upload a custom app")

         > IMPORTANT: The manifest file in this app adds "token.botframework.com" to the list of `validDomains`. This must be included in any bot that uses the Bot Framework   OAuth flow.

## Features of this sample

- Type a message to get a card to generate the QR code.

 ![Card](Images/CardWithButtons.png)

- Select the team from dropdown list for which you want to generate the QR code and then click on 'Generate QR' button.

 ![QR Code](Images/QRCode.png)

- Scan the generated QR code to join the team.

 ![Join Team](Images/TeamQR.png)

 ## Deploy the bot to Azure

To learn more about deploying a bot to Azure, see [Deploy your bot to Azure](https://aka.ms/azuredeployment) for a complete list of deployment instructions.
