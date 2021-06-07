﻿using Microsoft.Bot.Builder.Teams;
using Microsoft.Bot.Schema;
using Microsoft.Extensions.Configuration;
using Microsoft.Graph;
using Microsoft.Identity.Client;
using ProactiveBot.Models;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace ProactiveBot.Bots
{
    public class ProactiveHelper : TeamsActivityHandler
    {
        public readonly IConfiguration _configuration;

        private readonly ConcurrentDictionary<string, ConversationReference> _conversationReferences;

        private CheckAppStatus objcheckAppStatus = new CheckAppStatus();

        public ProactiveHelper()
        {
        }

        public ProactiveHelper(ConcurrentDictionary<string, ConversationReference> conversationReferences, IConfiguration configuration)
        {
            _conversationReferences = conversationReferences;
            _configuration = configuration;
        }

        public GraphServiceClient GetAuthenticatedClient(string token)
        {
            var graphClient = new GraphServiceClient(
                new DelegateAuthenticationProvider(
                    requestMessage =>
                    {
                        // Append the access token to the request.
                        requestMessage.Headers.Authorization = new AuthenticationHeaderValue("bearer", token);

                        // Get event times in the current time zone.
                        requestMessage.Headers.Add("Prefer", "outlook.timezone=\"" + TimeZoneInfo.Local.Id + "\"");

                        return Task.CompletedTask;
                    }));
            return graphClient;
        }

        public async Task<string> GetToken(string tenantId, string MicrosoftAppId, string MicrosoftAppPassword)
        {
            IConfidentialClientApplication app = ConfidentialClientApplicationBuilder.Create(MicrosoftAppId)
                                                  .WithClientSecret(MicrosoftAppPassword)
                                                  .WithAuthority($"https://login.microsoftonline.com/{tenantId}")
                                                  .WithRedirectUri("https://daemon")
                                                  .Build();
            string[] scopes = new string[] { "https://graph.microsoft.com/.default" };
            var result = await app.AcquireTokenForClient(scopes).ExecuteAsync();
            return result.AccessToken;
        }

        public async Task<bool> AppInstallationforChannel(string teamId, string MicrosoftTenantId, string MicrosoftAppId, string MicrosoftAppPassword, string MicrosoftTeamAppid)
        {
            try
            {
                string Access_Token = await GetToken(MicrosoftTenantId, MicrosoftAppId, MicrosoftAppPassword);
                GraphServiceClient graphClient = GetAuthenticatedClient(Access_Token);
                List<AppModel> list = new List<AppModel>();

                var installedApps = await graphClient.Teams[teamId].InstalledApps
                    .Request()
                    .Expand("teamsAppDefinition, teamsApp")
                    .GetAsync();

                foreach (var res in installedApps.ToList())
                {
                    var channelModel = new AppModel();
                    channelModel.Id = res.TeamsApp.ExternalId;
                    list.Add(channelModel);
                }

                var CheckAppid = list.FirstOrDefault(x => x.Id == MicrosoftAppId);

                if (CheckAppid == null)
                {
                    try
                    {
                        var teamsAppInstallation = new TeamsAppInstallation
                        {
                            AdditionalData = new Dictionary<string, object>()
                        {
                            {"teamsApp@odata.bind", "https://graph.microsoft.com/v1.0/appCatalogs/teamsApps/" +MicrosoftTeamAppid}
                        }
                        };
                        await graphClient.Teams[teamId].InstalledApps
                            .Request()
                            .AddAsync(teamsAppInstallation);
                        return true;
                    }
                    catch (Exception ex)
                    {
                        throw ex;
                    }
                }
                else
                {
                    return true;
                }
            }
            catch (Exception ex1)
            {
                throw ex1;
            }
        }

        public async Task<CheckAppStatus> AppinstallationforPersonal(string Userid, string MicrosoftTenantId, string MicrosoftAppId, string MicrosoftAppPassword, string MicrosoftTeamAppid)
        {
            List<AppModel> list = new List<AppModel>();
            try
            {
                string Access_Token = await GetToken(MicrosoftTenantId, MicrosoftAppId, MicrosoftAppPassword);
                GraphServiceClient graphClient = GetAuthenticatedClient(Access_Token);
                var installedApps = await graphClient.Users[Userid].Teamwork.InstalledApps
                    .Request()
                   .Expand("teamsAppDefinition, teamsApp")
                    .GetAsync();

                foreach (var res in installedApps)
                {
                    var channelModel = new AppModel();
                    channelModel.Id = res.TeamsApp.ExternalId;
                    list.Add(channelModel);
                }
                var CheckAppid = list.FirstOrDefault(x => x.Id == MicrosoftAppId);
                if (CheckAppid == null)
                {
                    try
                    {
                        var userScopeTeamsAppInstallation = new UserScopeTeamsAppInstallation
                        {
                            AdditionalData = new Dictionary<string, object>()
                        {
                            {"teamsApp@odata.bind", "https://graph.microsoft.com/v1.0/appCatalogs/teamsApps/"+MicrosoftTeamAppid}
                        }
                        };
                        await graphClient.Users[Userid].Teamwork.InstalledApps
                            .Request()
                            .AddAsync(userScopeTeamsAppInstallation);
                        // CheckStatus = new Tuple<bool, int>(true, 1);
                        objcheckAppStatus.AppCount = 1;
                        objcheckAppStatus.CheckStatus = true;
                    }
                    catch (Exception ex)
                    {
                        throw ex;
                    }
                }
                else
                {
                    //CheckStatus = new Tuple<bool, int>(true, 2);
                    objcheckAppStatus.AppCount = 2;
                    objcheckAppStatus.CheckStatus = true;
                }
            }
            catch (Exception ex1)
            {
                throw ex1;
            }
            return objcheckAppStatus;
        }

        public async Task<bool> AppInstallationforChat(string ChatId, string MicrosoftTenantId, string MicrosoftAppId, string MicrosoftAppPassword, string MicrosoftTeamAppid)
        {
            List<AppModel> list = new List<AppModel>();
            string Access_Token = await GetToken(MicrosoftTenantId, MicrosoftAppId, MicrosoftAppPassword);
            GraphServiceClient graphClient = GetAuthenticatedClient(Access_Token);
            try
            {
                var installedApps = await graphClient.Chats[ChatId].InstalledApps
                .Request()
                .Expand("teamsAppDefinition, teamsApp")
                .GetAsync();

                foreach (var res in installedApps)
                {
                    var channelModel = new AppModel();
                    channelModel.Id = res.TeamsApp.ExternalId;
                    list.Add(channelModel);
                }
                var CheckAppid = list.FirstOrDefault(x => x.Id == MicrosoftAppId);
                if (CheckAppid == null)
                {
                    try
                    {
                        var teamsAppInstallation = new TeamsAppInstallation
                        {
                            AdditionalData = new Dictionary<string, object>()
                            {
                                {"teamsApp@odata.bind", "https://graph.microsoft.com/v1.0/appCatalogs/teamsApps/"+MicrosoftTeamAppid}
                            }
                        };
                        await graphClient.Chats[ChatId].InstalledApps
                            .Request()
                            .AddAsync(teamsAppInstallation);
                        return true;
                    }
                    catch (Exception ex)
                    {
                        throw ex;
                    }
                }
                else
                {
                    return true;
                }
            }
            catch (Exception ex1)
            {
                throw ex1;
            }
        }
    }
}