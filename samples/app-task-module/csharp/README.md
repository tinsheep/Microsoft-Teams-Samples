---
page_type: sample
description: "A task module allows you to create modal popup experiences in your Teams application."
urlFragment: ms-teams-task-sample
products:
- dotnet
- office-teams
- office-365
languages:
- csharp
extensions:
  contentType: samples
  createdDate: "9/26/2018 5:27:57 PM"
---

# Microsoft Teams task module

A task module allows you to create modal popup experiences in your Teams application. Inside the popup, you can run your own custom HTML/JavaScript code, show an `<iframe>`-based widget such as a YouTube or Microsoft Stream video, or display an [Adaptive card](https://docs.microsoft.com/en-us/adaptive-cards/).

Task modules build on the foundation of Microsoft Teams tabs: a task module is essentially a tab in a popup window. It uses the same SDK, so if you've built a tab you are already 90% of the way to being able to create a task module.


![adaptivecard](Microsoft.Teams.Samples.TaskModule.Web/Images/adaptivecard.png)

![Customform](Microsoft.Teams.Samples.TaskModule.Web/Images/Customform.png)

![customformregister](Microsoft.Teams.Samples.TaskModule.Web/Images/customformregister.png)

![adaptivecard2](Microsoft.Teams.Samples.TaskModule.Web/Images/adaptivecard2.png)

![powerapps](Microsoft.Teams.Samples.TaskModule.Web/Images/powerapps.png)

![TaskModule](Microsoft.Teams.Samples.TaskModule.Web/Images/TaskModule.png)

![tasks](Microsoft.Teams.Samples.TaskModule.Web/Images/tasks.png)

![youtube](Microsoft.Teams.Samples.TaskModule.Web/Images/youtube.png)

## Run this sample locally
> Note these instructions are for running the sample on your local machine, the tunnelling solution is required because
> the Teams service needs to call into the bot.

### 1. Setup for Bot
In Azure portal, create a [Azure Bot resource](https://docs.microsoft.com/en-us/azure/bot-service/abs-quickstart?view=azure-bot-service-4.0&tabs=userassigned).

- Ensure that you've [enabled the Teams Channel](https://docs.microsoft.com/en-us/azure/bot-service/channel-connect-teams?view=azure-bot-service-4.0)

### 2. Run your bot sample
1) Clone the repository

    ```bash
    git clone https://github.com/OfficeDev/Microsoft-Teams-Samples.git
    ```
2) In a terminal, navigate to `samples/app-task-module/nodejs`

3) Run ngrok - point to port 3978

    ```bash
    ngrok http -host-header=rewrite 3978
    ```

5) Modify the /web.config and fill in the {{ MicrosoftAppId }},{{ MicrosoftAppPassword }} with the id from step 1 and {{BaseUrl}} we get from previous step. ngrok BaseUrl will look something like `https://abc21-hun-12ef.ngrok.io`.

4) In a terminal, navigate to `BotWithSharePointFileViewer`

    ```bash
    # change into project folder
    cd # BotWithSharePointFileViewer
    ```

5) Run the bot from a terminal or from Visual Studio, choose option A or B.

  A) From a terminal

  ```bash
  # run the bot
  dotnet run
  ```

  B) Or from Visual Studio

  - Launch Visual Studio
  - File -> Open -> Project/Solution
  - Navigate to `samples/bot-sharepoint-file-viewer/csharp` folder
  - Select `BotWithSharePointFileViewer.csproj` file
  - Press `F5` to run the project

## Deploy the bot to Azure

To learn more about deploying a bot to Azure, see [Deploy your bot to Azure](https://aka.ms/azuredeployment) for a complete list of deployment instructions.
## Overview of this sample

* **A personal app.** When you upload the [Task Module CSharp.zip](Microsoft.Teams.Samples.TaskModule.Web/Manifest/TaskModuleCSharp.zip) file, choose "Add for you" and "Task Module CSharp" will appear in the "..." menu in the Teams app bar. The personal app has both a tab and a bot.
* **A channel tab.** Add the app to a team, then add a Task Module CSharp tab and choose "Task Module Demo" from the radio button list.
* **A channel bot.** Add the app to a team, then chat with it (@Task Module CSharp).

The tab shows how to invoke the task module using the Teams SDK. Source code for the tab is found in [Tasks.cshtml](Microsoft.Teams.Samples.TaskModule.Web/Views/Home/Tasks.cshtml). 

The following task modules are supported:

* YouTube, which is comprised of a [generic template for embedded `<iframe>` experiences](Microsoft.Teams.Samples.TaskModule.Web/Views/Shared/_EmbedPage.cshtml) (also used for the PowerApp task module below) plus a [one-line stub containing the YouTube embed URL](Microsoft.Teams.Samples.TaskModule.Web/Views/Home/YouTube.cshtml)
* [PowerApp](Microsoft.Teams.Samples.TaskModule.Web/Views/Home/PowerApp.cshtml) &mdash; unfortunately it doesn't work out of the box; click the button or see the [source code](Microsoft.Teams.Samples.TaskModule.Web/Views/Home/PowerApp.cshtml) for details on how you can customize it for your tenant
* There are two custom form examples:
  * Showing the results of a custom form returned to the tab
  * Showing the results of a custom form returned to the bot
* There are two Adaptive card examples:
  * Showing the results of an `Action.Submit` button returned to the tab
  * Showing the results returned to the bot as a message

The sample app also contains a bot with cards allowing you to invoke these task modules. You can invoke them from an Adaptive card or from a Bot Framework thumbnail card. [RootDialog.cs](Microsoft.Teams.Samples.TaskModule.Web/Dialogs/RootDialog.cs) contains the code for the cards, and [MessagesController.cs](Microsoft.Teams.Samples.TaskModule.Web/Controllers/MessagesController.cs) contains the code for responding to `task/fetch` and `task/submit` messages.

## Implementation notes

  * Metadata used to generate [TaskInfo objects](https://docs.microsoft.com/en-us/microsoftteams/platform/concepts/task-modules/task-modules-overview#the-taskinfo-object) is in [TaskModel.cs](Microsoft.Teams.Samples.TaskModule.Web/Models/TaskModel.cs).
  * Model classes for handling [Bot Framework card actions vs. Adaptive card Action.Submit actions](https://docs.microsoft.com/en-us/microsoftteams/platform/concepts/task-modules/task-modules-bots#bot-framework-card-actions-vs-adaptive-card-actionsubmit-actions) are defined in [CardActionValue.cs](Microsoft.Teams.Samples.TaskModule.Web/Models/CardActionValue.cs)
  * Deeplink is generated in [DeeplinkHelper.cs](Microsoft.Teams.Samples.TaskModule.Web/Helper/DeeplinkHelper.cs)

## Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit <https://cla.microsoft.com.>

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
