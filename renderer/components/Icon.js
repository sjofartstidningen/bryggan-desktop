import React from 'react';
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

function Home(props) {
  return (
    <Icon {...props}>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </Icon>
  );
}

Home.propTypes = IconProps;
Home.defaultProps = defaultProps;

export { Icon, Home };
