import { Button, Card, Flex } from '@fluentui/react-northstar';
import { meeting, SdkError } from '@microsoft/teams-js';
import { useState } from 'react';
import { DocumentType, Signature } from 'models';
import { DocumentChooser } from 'components/Documents';
import { Badge } from 'components/Badge';
import { useTheme } from 'hooks';
import styles from './SidepanelDocumentCard.module.css';
import { DocumentState } from '../../models/Document';

export type SidepanelDocumentCardProps = {
  id: string;
  documentType: DocumentType;
  documentState: DocumentState;
  loggedInAadId: string;
  signatures: Signature[];
};

/**
 * Creates a Card that represents a Document and it's completion status
 *
 * @param documentType This is specific to our proof-of-concept, and is used to return the document e.g. PurchaseAgreement
 * @param documentState The state of the document signing process, can be `active`, `stage`, `complete`
 * @param loggedInAadId The AAD Id of the logged in user
 * @param signatures The Signatures details of this document
 * @returns A document styled as a card
 */
export function SidepanelDocumentCard({
  id,
  documentType,
  documentState,
  loggedInAadId,
  signatures,
}: SidepanelDocumentCardProps) {
  const theme = useTheme();
  const [shareButtonText, setShareButtonText] =
    useState<string>('Share to meeting');

  const stateColor: string =
    documentState === DocumentState.Active
      ? theme.siteVariables.naturalColors.green['200']
      : documentState === DocumentState.Complete
      ? theme.siteVariables.naturalColors.yellow['500']
      : theme.siteVariables.naturalColors.grey['600'];
  const cardInlineStyles = { borderTopColor: stateColor };

  const shareToStageCallback = (
    error: SdkError | null,
    result: boolean | null,
  ) => {
    if (error !== null) {
      console.log(
        `Error when sharing to stage. ${error.errorCode}: ${error.message}`,
      );
      setShareButtonText('Error while sharing');
    }

    if (result) {
      setShareButtonText('Shared');
    }
  };

  return (
    <>
      <Card
        className={styles.sidepanelDocumentCard}
        style={cardInlineStyles}
        fluid
      >
        <Card.Header>
          <Flex vAlign="center">
            <div>
              <Badge content="Active" backgroundColor={stateColor} />
            </div>
            <Flex.Item push>
              <div>
                <Badge
                  content="Unsigned Document"
                  size="small"
                  rectangular
                  backgroundColor="#616161"
                />
              </div>
            </Flex.Item>
          </Flex>
        </Card.Header>
        <Card.Body>
          <DocumentChooser
            documentId={id}
            documentType={documentType}
            loggedInAadId={loggedInAadId}
            signatures={signatures}
            clickable={false}
            className={styles.sidepanelDocumentCardDocument}
          />
        </Card.Body>
        <Card.Footer>
          <Flex>
            <Flex.Item push>
              <Button
                content={shareButtonText}
                iconPosition="before"
                onClick={() =>
                  meeting.shareAppContentToStage(
                    shareToStageCallback,
                    `${window.location.protocol}//${window.location.host}/stage/${id}`,
                  )
                }
              />
            </Flex.Item>
          </Flex>
        </Card.Footer>
      </Card>
    </>
  );
}
