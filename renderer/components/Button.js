import styled from 'styled-components';

const Button = styled.button`
  display: inline-block;
  width: 100%;
  border: 1px solid ${p => p.theme.color.darkGrey};
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  color: ${p => p.theme.color.darkGrey};
  background-color: white;
`;

export { Button };
