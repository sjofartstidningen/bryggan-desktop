import React from 'react';
import styled from 'styled-components';
import { rgb } from 'polished';
import {
  Folder as FolderIcon,
  File as FileIcon,
  IdFile as IdIcon,
  FilledCircle,
} from './Icon';
import { DisplayName } from './DisplayName';
import { hasIdlkFile } from '../utils';

const Wrapper = styled.div`
  width: 100%;
`;

const Button = styled.button`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  border: none;
  padding: 0.35rem 0.25rem;
  font-size: 0.75rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,
    Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
    sans-serif;
  text-align: left;
  color: rgb(68, 68, 68);
  background-color: transparent;
  cursor: pointer;
  transition: background 0.3s ease-in-out;

  &:focus {
    outline: none;
  }

  &:hover {
    color: rgb(0, 0, 0);
    background-color: rgb(250, 251, 252);
  }

  &:disabled {
    cursor: default;
    color: rgb(68, 68, 68);
    background-color: transparent;
  }
`;

const IconWrapper = styled.span`
  margin-right: 0.25rem;
`;

const IndicatorWrapper = styled.span`
  margin-left: auto;
  color: ${({ canAccess }) =>
    canAccess ? rgb(52, 199, 73) : rgb(252, 96, 92)};
`;

const FileName = styled.p``;
const ModifiedBy = styled.p`
  color: rgb(153, 153, 153);
`;

function Folder({ file, onClick }) {
  return (
    <Wrapper>
      <Button type="button" onClick={onClick}>
        <IconWrapper aria-hidden="true">
          <FolderIcon />
        </IconWrapper>
        <div>
          <FileName>{file.name}</FileName>
        </div>
      </Button>
    </Wrapper>
  );
}

function File({ file, onClick }) {
  return (
    <Wrapper>
      <Button type="button" onClick={onClick}>
        <IconWrapper aria-hidden="true">
          <FileIcon />
        </IconWrapper>
        <div>
          <FileName>{file.name}</FileName>
        </div>
      </Button>
    </Wrapper>
  );
}

function IdFile({ file, folderContent, onClick }) {
  const canAccess = !hasIdlkFile(file, folderContent);

  return (
    <Wrapper>
      <Button type="button" onClick={onClick} disabled={!canAccess}>
        <IconWrapper aria-hidden="true">
          <IdIcon />
        </IconWrapper>
        <div>
          <FileName>{file.name}</FileName>
          <ModifiedBy>
            Last modified by: <DisplayName accountId={file.modifiedBy} />
          </ModifiedBy>
        </div>
        <IndicatorWrapper canAccess={canAccess}>
          <FilledCircle />
        </IndicatorWrapper>
      </Button>
    </Wrapper>
  );
}

export { Folder, File, IdFile };
