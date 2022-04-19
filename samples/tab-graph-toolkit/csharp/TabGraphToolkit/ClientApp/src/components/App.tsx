import { Providers, ProviderState } from '@microsoft/mgt-element';
import { Agenda, Login, Todo, PersonCard, PeoplePicker, Tasks, Person, FileList, ViewType } from '@microsoft/mgt-react';
import React, { useState, useEffect } from 'react';
import { Accordion } from '@fluentui/react-northstar'
import '../App.css';
import { teams } from '@microsoft/teams-js';
import * as MicrosoftTeams from "@microsoft/teams-js";


function useIsSignedIn(): [boolean] {
    const [isSignedIn, setIsSignedIn] = useState(false);

    useEffect(() => {
        const updateState = () => {
            const provider = Providers.globalProvider;
            setIsSignedIn(provider && provider.state === ProviderState.SignedIn);
        };

        Providers.onProviderUpdated(updateState);
        updateState();

        return () => {
            Providers.removeProviderUpdatedListener(updateState);
        }
    }, []);

    return [isSignedIn];
}

function App() {
    const [isSignedIn] = useIsSignedIn();

    const [selFileInfo, setSelFileInfo] = useState<any>(undefined);

    const _onFileClick = (e: any) => {
        console.log(e);
        if (e.detail) {
            let fileInfo: any = {
                Editor: e.detail.lastModifiedBy.user.displayName,
                Modified: e.detail.lastModifiedDateTime,
                ItemId: e.detail.id,
                FileUrl: e.detail.webDavUrl,
                FilePrevUrl: e.detail.webUrl
            };
            setSelFileInfo(fileInfo);
        }

        /* try deep link to file */
        MicrosoftTeams.executeDeepLink("https://teams.microsoft.com/l/file/A8C28F2C-993D-4A07-862C-065EAE3CE76F?tenantId=a6218add-62d4-4c65-a992-da1ec5d85e38?fileType=xlsx&objectUrl=https%3A%2F%2Fm365x501367.sharepoint.com%2FShared%20Documents%2FDemo%20Files%2FWorkplace%20Innovation.xlsx");

        /* try the stage - really needs a web page */
        /* MicrosoftTeams.executeDeepLink("https://teams.microsoft.com/l/stage/c3fcbeb1-ae6b-4d2d-9fee-1b0af1a32228/0?context={\"contentUrl\":\"https%3A%2F%2Fm365x501367.sharepoint.com%2FShared%20Documents%2FDemo%20Files%2FWorkplace%20Innovation.xlsx\",\"websiteUrl\":\"https%3A%2F%2Fm365x501367.sharepoint.com%2FShared%20Documents%2FDemo%20Files%2FWorkplace%20Innovation.xlsx\",\"name\":\"Workplace%20Innovation\"}"); */
        /* MicrosoftTeams.executeDeepLink("https://teams.microsoft.com/l/stage/c3fcbeb1-ae6b-4d2d-9fee-1b0af1a32228/0?context={'contentUrl':'https%3A%2F%2Fm365x501367.sharepoint.com%2F_layouts/15/Doc.aspx?sourcedoc=%7BA8C28F2C-993D-4A07-862C-065EAE3CE76F%7D&file=Workplace%20Innovation.xlsx&action=default&mobileredirect=true','websiteUrl':'https%3A%2F%2F_layouts/15/Doc.aspx?sourcedoc=%7BA8C28F2C-993D-4A07-862C-065EAE3CE76F%7D&file=Workplace%20Innovation.xlsx&action=default&mobileredirect=true','name':'Workplace%20Innovation'}"); */
        /* MicrosoftTeams.executeDeepLink("https://teams.microsoft.com/l/stage/c3fcbeb1-ae6b-4d2d-9fee-1b0af1a32228/0?context={\"contentUrl\":\"https:~2F~2Fteams.microsoft.com~2F_#~2Fxlsx~2Fviewer~2Frecent~2Fhttps:~2F~2Fm365x501367.sharepoint.com~2FShared%2520Documents~2FDemo%2520Files~2FWorkplace%2520Innovation.xlsx?baseUrl=https:~2F~2Fm365x501367.sharepoint.com&fileId=a8c28f2c-993d-4a07-862c-065eae3ce76f&ctx=recent&viewerAction=view\",\"websiteUrl\":\"https:~2F~2Fteams.microsoft.com~2F_#~2Fxlsx~2Fviewer~2Frecent~2Fhttps:~2F~2Fm365x501367.sharepoint.com~2FShared%2520Documents~2FDemo%2520Files~2FWorkplace%2520Innovation.xlsx?baseUrl=https:~2F~2Fm365x501367.sharepoint.com&fileId=a8c28f2c-993d-4a07-862c-065eae3ce76f&ctx=recent&viewerAction=view\",\"name\":\"Workplace%20Innovation\"}"); */

        /* try the viewer */
        /* MicrosoftTeams.executeDeepLink("https://teams.microsoft.com/_#xlsx/viewer/teams/https%3A%2F%2Fm365x501367.sharepoint.com%2FShared%20Documents%2FDemo%20Files%2FWorkplace%20Innovation.xlsx?baseUrl=https%3A%2F%2Fm365x501367.sharepoint.com&fileId=A8C28F2C-993D-4A07-862C-065EAE3CE76F&ctx=files&viewerAction=edit"); */

    };

    const panels = [
         {
            key: 'FileList',
            title: <div className="title"> File list</div>,
            content: <div className="container-div"> <FileList siteId="m365x501367.sharepoint.com,0fd47159-a31f-4bbe-ba63-3edddd0a8a81,b0c67798-bd0c-4dd4-88a7-03b8fdc39b87" itemPath="/Demo Files" itemClick={_onFileClick} /></div>,
        },
    ]

    return (
        <div className="App">
            <header>
                <Login />
            </header>
            <div>
                {isSignedIn &&
                    <Accordion defaultActiveIndex={[0]} panels={panels}/>}
            </div>
            <div>
                <p>Selected file info</p>
                {selFileInfo &&
                    <div className="container-div">
                        <div><p>Last Modified By:</p> {selFileInfo.Editor}</div>
                        <div><p>Last Modified Time:</p> {selFileInfo.Modified}</div>
                        <div><p>List Item Id:</p> {selFileInfo.ItemId}</div>
                        <div><p>File Url:</p> {selFileInfo.FileUrl}</div>
                        <div><p>File Preview Url:</p> {selFileInfo.FilePrevUrl}</div>
                    </div>
                }
            </div>
        </div>
    );
}

export default App;