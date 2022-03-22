import { ReactNode } from 'react';
import { Flex, Header } from '@fluentui/react-northstar';
import classnames from 'classnames';
import { SignatureList } from 'components/Signatures';
import { Signature } from 'models';
import { useTheme } from 'hooks';
import styles from './Document.module.css';

export type DocumentProps = {
  id: string;
  title: string;
  content: ReactNode;
  clickable: boolean;
  loggedInAadId: string;
  signatures: Signature[];
  className?: string;
};

export function Document({
  id,
  title,
  content,
  clickable,
  loggedInAadId,
  signatures,
  className,
}: DocumentProps) {
  const theme = useTheme();

  const documentInlineStyles = {
    background: theme.siteVariables.primitiveColors.white,
    color: theme.siteVariables.primitiveColors.black,
  };
  const headerInlineStyles = {
    color: theme.siteVariables.primitiveColors.black,
  };

  const documentClasses = classnames(styles.document, className);

  return (
    <Flex column fill styles={documentInlineStyles} className={documentClasses}>
      <Header as="h1" content={title} styles={headerInlineStyles} />
      <div>{content}</div>
      <Flex.Item align="start">
        <SignatureList
          documentId={id}
          loggedInAadId={loggedInAadId}
          signatures={signatures}
          clickable={clickable}
        />
      </Flex.Item>
    </Flex>
  );
}
