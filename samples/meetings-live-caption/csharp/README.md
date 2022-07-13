---
page_type: sample
description: This is a sample application which demonstrates how to use CART link to send live captions in the meeting.
products:
- office-teams
- office
- office-365
languages:
- csharp
extensions:
contentType: samples
createdDate: "24-06-2022 00:02:15"
---

# Meeting side panel application uses CART link to send caption in live meeting.

This is a sample meeting side panel application which demonstrates how to enable live caption in the meeting and using the CART link how to send caption in live meeting. Meeting side panel application uses CART link to send caption in live meeting.

## Enable CART Captions
Once the meeting is scheduled. Follow this doc to enable [Provide Cart Catptions]("https://support.microsoft.com/office/use-cart-captions-in-a-microsoft-teams-meeting-human-generated-captions-2dd889e8-32a8-4582-98b8-6c96cf14eb47").
Copy the CART link it will used while configuring tab for meeting.

## Key features

![Key Features](MeetingLiveCaption/Images/MeetingCaption.gif)

## Prerequisites

- Microsoft Teams is installed and you have an account (not a guest account)
-  .[NET 6.0](https://dotnet.microsoft.com/en-us/download) SDK.
    ```bash
        # determine dotnet version
        dotnet --version
    ```
-  [ngrok](https://ngrok.com/) or equivalent tunneling solution
-  [M365 developer account](https://docs.microsoft.com/en-us/microsoftteams/platform/concepts/build-and-test/prepare-your-o365-tenant) or access to a Teams account with the appropriate permissions to install an app.

## To try this sample

> Note these instructions are for running the sample on your local machine, the tunnelling solution is required because
> the Teams service needs to call into the bot.

### 1. Clone the repository
   ```bash
   git clone https://github.com/OfficeDev/Microsoft-Teams-Samples.git
   ```

### 2. Launch Visual Studio
   - File -> Open -> Project/Solution
   - Navigate to folder where repository is cloned then `samples/meeting-live-caption/csharp/MeetingLiveCaption.sln`
    
### 3. Start ngrok on localhost:3978
- Open ngrok and run command `ngrok http -host-header=rewrite 3978` 
- Once started you should see link  `https://41ed-abcd-e125.ngrok.io`. Copy it, this is your baseUrl that will used as endpoint for Azure bot.


![Ngrok](MeetingLiveCaption/Images/NgrokScreenshot.png)

4. Modify the `manifest.json` in the `/AppPackage` folder and replace the following details:
   - `{{AppId}}` with any guid id value.
   - `{{domain-name}}` with base Url domain. E.g. if you are using ngrok it would be `https://1234.ngrok.io` then your domain-name will be `1234.ngrok.io`.

5. Zip the contents of `AppPackage` folder into a `manifest.zip`, and use the `manifest.zip` to deploy in app store or add to Teams using step 6.

6. Upload the manifest.zip to Teams (in the Apps view click "Upload a custom app")
   - Go to Microsoft Teams and then go to side panel, select Apps
   - Choose Manage your apps -> Upload an app -> Upload a custom App
   - Go to your project directory, the ./AppPackage folder, select the zip folder, and choose Open.
   - Select Add in the pop-up dialog box. Your app is uploaded to Teams.

**NOTE: If you are not able to send caption, try configuring tab again.**

## Features of this sample

1. Schedule the meeting and add Meeting Caption Tab in that particular scheduled meeting.
![Add Tab](MeetingLiveCaption/Images/AddMeetingCaption.png)
2. Once meeting started, turn on live caption.
![Start live caption](MeetingLiveCaption/Images/TurnOnLiveCaption.png)
3. Once the live caption has started, you can use the app to send live caption.
![Send live caption](MeetingLiveCaption/Images/MeetingCaptionSidePanel.png)
4. After clicking on `Submit` button, you will see the caption in the meeting.
![Caption in meeting](MeetingLiveCaption/Images/LiveCaption.png)
