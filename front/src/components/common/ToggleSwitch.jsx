import { useState } from 'react';
import styled from 'styled-components';

import { PRIMARY_COLOR, SECONDARY_COLOR } from './commonColor';

// interface ToggleSwitchProps {
//   on: {
//     name: String;
//     handler: Function;
//   };
//   off: {
//     name: String;
//     handler: Function;
//   };
//   defaultValue?: Boolean;
// }

export default function ToggleSwitch({ on, off, defaultValue = true }) {
  const [toggle, setToggle] = useState(defaultValue);

  const changeHanlder = (e) => {
    setToggle(e.target.checked);
    e.target.checked ? on.handler() : off.handler();
  };

  return (
    <Switch>
      <input type='checkbox' defaultChecked={toggle} onChange={changeHanlder} />
      <Slider>{toggle ? on.name : off.name}</Slider>
    </Switch>
  );
}

const Switch = styled.label`
  position: relative;
  display: inline-block;
  width: 80px;
  height: 32px;

  input[type='checkbox'] {
    opacity: 0;
    width: 0;
    height: 0;

    &:checked + span {
      padding-left: 10px;
      background-color: ${PRIMARY_COLOR};

      &:before {
        -webkit-transform: translateX(calc(80px - 32px));
        -ms-transform: translateX(calc(80px - 32px));
        transform: translateX(calc(80px - 32px));
      }
    }

    &:focus + span {
      box-shadow: 0 0 1px ${PRIMARY_COLOR};
    }
  }
`;
const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${SECONDARY_COLOR};
  -webkit-transition: 0.4s;
  transition: 0.4s;
  border-radius: 32px;

  display: flex;
  align-items: center;
  color: white;
  font-weight: bold;
  padding-left: 32px;
  font-size: 14px;

  &:before {
    border-radius: 50%;
    position: absolute;
    content: '';
    height: 24px;
    width: 24px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }
`;
