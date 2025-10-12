import Container from 'react-bootstrap/Container';

import Navbar from 'react-bootstrap/Navbar';

import './navbar.css';

function NavbarComponent() {
  return (
    <Navbar expand="lg" className="navbar">
      <Container className='container'>
        <Navbar.Brand href="#home" className='home'>Home</Navbar.Brand>
        <Navbar.Brand href="#Util" className='Tools'>Tools</Navbar.Brand>
        
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;