import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { JSX } from 'react/jsx-runtime';

const popover = (
  <Popover id="popover-basic">
    <Popover.Body>
      Hello
    </Popover.Body>
  </Popover>
);

const Upload = () => (
  <OverlayTrigger trigger="click" placement="bottom" overlay={popover}>
    <Button variant="success">Upload</Button>
  </OverlayTrigger>
);

render(<Upload />);

function render(arg0: JSX.Element) {
    throw new Error('Function not implemented.');
}
