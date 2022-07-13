import { Form, FormInput } from '@fluentui/react-northstar';
import * as microsoftTeams from '@microsoft/teams-js';
import { TaskModuleDimension } from '@microsoft/teams-js';
import * as ACData from 'adaptivecards-templating';
import { SignatureConfirmationCard } from 'adaptive-cards';
import { postSignDocument, SignDocumentModel } from 'api/signatureApi';
import { Signature } from 'models';
import './Signature.css';
import { useMutation } from 'react-query';

type SignatureInputProps = {
  documentId: string;
  loggedInAadId: string;
  clickable: boolean;
  signature: Signature;
};

/**
 * Single Signature input, includes the label and the input field.
 * The input field will be clickable, if the logged in user is the Signer.
 * Clicking on the input box will open a Task Dialog confirming the signature.
 *
 * @param documentId used in the call to the Sign API
 * @param loggedInAadId ID of the logged in user, used in logic to allow signing or not
 * @param clickable Boolean field to disable signing in specific scenarios. e.g. in the Sidepanel
 * @param signature Signature details
 */
function SignatureInput({
  documentId,
  loggedInAadId,
  clickable,
  signature,
}: SignatureInputProps) {
  // We are using https://react-query.tanstack.com/ for handling the calls to our APIs.
  // To post a call we set-up a mutation, which we then call further down when we want
  // to make the call to the API.
  const signDocumentMutation = useMutation<Signature, Error, SignDocumentModel>(
    (model: SignDocumentModel) => postSignDocument(model),
  );

  const isSignatureForLoggedInPerson: boolean =
    signature.signer.userId === loggedInAadId;

  const signatureConfirmationTaskModule = () => {
    const template = new ACData.Template(SignatureConfirmationCard);
    const card = template.expand({
      $root: {
        name: signature.signer.name,
      },
    });

    const signatureConfirmationSubmitHandler = async (
      error: string,
      result: any,
    ) => {
      if (error !== null) {
        console.log(`Signature Confirmation handler - error: '${error}'`);
      } else if (result !== undefined) {
        const signatureSigned = { ...signature };
        const resultParsed = typeof result === 'object' ? result : JSON.parse(result);
        signatureSigned.text = resultParsed.confirmation;

        signDocumentMutation.mutate({
          documentId: documentId,
          signature: signatureSigned,
        });
      }
    };

    microsoftTeams.tasks.startTask(
      {
        width: TaskModuleDimension.Medium,
        card: JSON.stringify(card),
      },
      signatureConfirmationSubmitHandler,
    );
  };

  return (
    <>
      <FormInput
        label={
          (signDocumentMutation.data && signDocumentMutation.data.signer.name) ||
          signature.signer.name
        }
        value={
          (signDocumentMutation.data && signDocumentMutation.data.text) ||
          signature.text
        }
        placeholder={
          isSignatureForLoggedInPerson ? 'Click to sign!' : undefined
        }
        inline
        required={isSignatureForLoggedInPerson}
        disabled={
          !isSignatureForLoggedInPerson ||
          !clickable ||
          (signDocumentMutation.data && signDocumentMutation.data.isSigned) ||
          signature.isSigned
        }
        error={signDocumentMutation.isError}
        errorMessage={signDocumentMutation.error}
        showSuccessIndicator={false}
        onClick={() => signatureConfirmationTaskModule()}
        input={{
          readOnly: true,
        }}
        className="signature-input"
      />
    </>
  );
}

export type SignatureListProps = {
  documentId: string;
  loggedInAadId: string;
  clickable: boolean;
  signatures: Signature[];
};

/**
 * List of Signature fields
 *
 * @param documentId used in the call to the Sign API
 * @param loggedInAadId ID of the logged in user, used in logic to allow signing or not
 * @param clickable Boolean field to disable signing in specific scenarios. e.g. in the Sidepanel
 * @param signatures Details for all the relevant Signature
 */
export function SignatureList({
  documentId,
  loggedInAadId,
  clickable,
  signatures,
}: SignatureListProps) {
  return (
    <Form className="signature-list">
      {signatures &&
        signatures.length > 0 &&
        signatures.map((s, index) => (
          <SignatureInput
            documentId={documentId}
            loggedInAadId={loggedInAadId}
            clickable={clickable}
            signature={s}
            key={index}
          />
        ))}
    </Form>
  );
}
