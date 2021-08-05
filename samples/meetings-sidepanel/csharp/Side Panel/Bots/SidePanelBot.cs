// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Bot.Builder;
using Microsoft.Bot.Builder.Teams;
using Microsoft.Bot.Schema;
using Newtonsoft.Json.Linq;
using SidePanel.Controllers;
using SidePanel.Models;
using AdaptiveCards;

namespace Microsoft.BotBuilderSamples.Bots
{
    public class SidePanelBot : TeamsActivityHandler
    {
        protected override async Task OnMessageActivityAsync(ITurnContext<IMessageActivity> turnContext, CancellationToken cancellationToken)
        {
            var replyText = "Hello and welcome **" + turnContext.Activity.From.Name + "** to the Meeting Extensibility SidePanel app.";
            await turnContext.SendActivityAsync(MessageFactory.Text(replyText, replyText), cancellationToken);
        }

        protected override async Task OnMembersAddedAsync(IList<ChannelAccount> membersAdded, ITurnContext<IConversationUpdateActivity> turnContext, CancellationToken cancellationToken)
        {
            var welcomeText = "Hello and welcome " + turnContext.Activity.From.Name + " to the Meeting Extensibility SidePanel app.";
            foreach (var member in membersAdded)
            {
                if (member.Id != turnContext.Activity.Recipient.Id)
                {
                    await turnContext.SendActivityAsync(MessageFactory.Text(welcomeText, welcomeText), cancellationToken);
                }
            }
        }

        protected override async Task OnConversationUpdateActivityAsync(ITurnContext<IConversationUpdateActivity> turnContext, CancellationToken cancellationToken)
        {
            HomeController.serviceUrl = turnContext.Activity.ServiceUrl;
            HomeController.conversationId = turnContext.Activity.Conversation.Id;
            await base.OnConversationUpdateActivityAsync(turnContext, cancellationToken);
        }

        protected override async Task OnEventActivityAsync(ITurnContext<IEventActivity> turnContext, CancellationToken cancellationToken)
        {
            // Event Name is either 'application/vnd.microsoft.meetingStart' or 'application/vnd.microsoft.meetingEnd'
            var meetingEventName = turnContext.Activity.Name;
            // Value contains meeting information (ex: meeting type, start time, etc).
            var meetingEventInfo = turnContext.Activity.Value as JObject;
            var meetingEventInfoObject = meetingEventInfo.ToObject<MeetingStartEndEventValue>();
            // Create a very simple adaptive card with meeting information
            var attachmentCard = CreateMeetingStartOrEndEventAttachment(meetingEventName, meetingEventInfoObject);
            await turnContext.SendActivityAsync(MessageFactory.Attachment(attachmentCard));
        }

        private Attachment CreateMeetingStartOrEndEventAttachment(string meetingEventName, MeetingStartEndEventValue meetingEventInfoObject)
        {
            AdaptiveCard adaptiveCard = new AdaptiveCard(new AdaptiveSchemaVersion(1, 0));
            adaptiveCard.Body = new List<AdaptiveElement>()
            {
                new AdaptiveTextBlock(){Text="Meeting Start/End Values", Weight=AdaptiveTextWeight.Bolder}
            };

            var meetingId = new AdaptiveTextBlock() { Text = "- " + meetingEventInfoObject.Id + " \r" };
            adaptiveCard.Body.Add(meetingId);
            if (meetingEventName == "application/vnd.microsoft.meetingStart")
            {
                var startTime = new AdaptiveTextBlock() { Text = "- " + meetingEventInfoObject.StartTime + " \r" };
                adaptiveCard.Body.Add(startTime);
            }
            else
            {
                var endTime = new AdaptiveTextBlock() { Text = "- " + meetingEventInfoObject.EndTime + " \r" };
                adaptiveCard.Body.Add(endTime);
            }

            return new Attachment()
            {
                ContentType = AdaptiveCard.ContentType,
                Content = adaptiveCard
            };
        }

    }
}
