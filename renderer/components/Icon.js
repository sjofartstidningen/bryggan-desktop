import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

const IconWrapper = styled.span`
  position: relative;
  display: inline-flex;
  align-self: center;
  width: 1em;
  height: 1em;
`;

const IconSvg = styled.svg`
  width: 1em;
  height: 1em;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;

  ${p =>
    p.baseline &&
    css`
      position: absolute;
      bottom: -0.125em;
    `};

  ${p =>
    p.useFill &&
    css`
      fill: currentColor;
      stroke: none;
    `};
`;

const IconProps = {
  baseline: PropTypes.bool,
  className: PropTypes.string,
};

const BaseIconProps = {
  ...IconProps,
  useFill: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

const defaultProps = { baseline: true, className: '' };

function Icon({ baseline = true, useFill, className, children }) {
  return (
    <IconWrapper className={className}>
      <IconSvg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        baseline={baseline}
        useFill={useFill}
      >
        {children}
      </IconSvg>
    </IconWrapper>
  );
}

Icon.propTypes = BaseIconProps;

function createIcon(elem) {
  const Comp = props => <Icon {...props}>{elem()}</Icon>;

  Comp.propTypes = IconProps;
  Comp.defaultProps = defaultProps;

  return Comp;
}

const Home = createIcon(() => (
  <Fragment>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </Fragment>
));

const Folder = createIcon(() => (
  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
));

const File = createIcon(() => (
  <Fragment>
    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
    <polyline points="13 2 13 9 20 9" />
  </Fragment>
));

const IdFile = createIcon(() => (
  <Fragment>
    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
    <path
      fill="currentColor"
      strokeWidth="0"
      d="M9.57,16c0,.08,0,.1-.1.1H8.32c-.08,0-.1,0-.1-.1V7.91c0-.07,0-.1.1-.1H9.48a.08.08,0,0,1,.09.09Z"
    />
    <path
      fill="currentColor"
      strokeWidth="0"
      d="M15.75,14.9v-7s0-.06-.08-.06H14.45a.07.07,0,0,0-.07.08v2H14a3,3,0,0,0-3.08,3.2h0c0,2.09,1.19,3.12,2.85,3.12a4.59,4.59,0,0,0,2-.45s.06,0,.06-.08A7.15,7.15,0,0,1,15.75,14.9Zm-1.37-3.8v3.8a1.53,1.53,0,0,1-.54.09c-.86,0-1.55-.57-1.55-2,0-1.24.67-2,1.64-2a1.13,1.13,0,0,1,.45.08Z"
    />
  </Fragment>
));

const Circle = createIcon(() => <circle cx="12" cy="12" r="10" />);

const CheckCircle = createIcon(() => (
  <Fragment>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </Fragment>
));

const XCircle = createIcon(() => (
  <Fragment>
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </Fragment>
));

const FilledCircle = createIcon(() => (
  <circle fill="currentColor" cx="12" cy="12" r="10" />
));

const ContextMenuIcon = createIcon(() => (
  <Fragment>
    <circle fill="currentColor" cx="12" cy="12" r="1" />
    <circle fill="currentColor" cx="19" cy="12" r="1" />
    <circle fill="currentColor" cx="5" cy="12" r="1" />
  </Fragment>
));

const Zap = createIcon(() => (
  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
));

export {
  Icon,
  Home,
  Folder,
  File,
  IdFile,
  Circle,
  CheckCircle,
  XCircle,
  IconWrapper,
  IconSvg,
  FilledCircle,
  ContextMenuIcon,
  Zap,
};
