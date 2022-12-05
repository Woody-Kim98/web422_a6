import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Link from 'next/link';
//import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useAtom } from 'jotai';
import { searchHistoryAtom } from '../store';
import { addToHistory } from "../lib/UserData";
import { readToken, removeToken } from '../lib/authenticate';

function NavScrollExample() {
  const router = useRouter();
  const [ searchField, setSearchField ] = useState('');
  const [ isExpanded, setIsExpanded ] = useState(false);

  const [ searchHistory, setSearchHistory ] = useAtom(searchHistoryAtom);

  async function submitForm(e) {
    e.preventDefault(); 
    setIsExpanded(false);
    let queryString = `title=true&q=${searchField}`
    router.push(`/artwork?` + queryString);
    setSearchHistory(await addToHistory(`title=true&q=${searchField}`))
  }

  let token = readToken();

  function logout()
  {
    setIsExpanded(false);
    removeToken();
    router.push(`/login`);
  }

 

const toggle = () => {
setIsExpanded(isExpanded => !isExpanded);
}
  return (
    <>
    
    <Navbar bg="primary" variant="dark" expand="lg" className="fixed-top" expanded={isExpanded}>
      <Container>
        <Navbar.Brand>Woojin Kim</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={toggle} /> 
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
           <Link href="/"  passHref legacyBehavior><Nav.Link onClick={toggle}>Home</Nav.Link></Link>
          
           {token && <Link href="/search" passHref legacyBehavior><Nav.Link onClick={toggle}>Advanced Search</Nav.Link></Link>}
           </Nav>
           {token && <>
           <Form className="d-flex" onSubmit={submitForm}>
             <Form.Control
               type="search"
               placeholder="Search"
               className="me-2"
               aria-label="Search"
               value={searchField}
               onChange={(e) => setSearchField(e.target.value)}
             />
            <Button variant="success" type="submit">Search</Button>
           </Form></>}
          
           {token && <Nav>
           
          <NavDropdown title={token.userName} id="basic-nav-dropdown">
              <Link href="/favourites" passHref legacyBehavior><NavDropdown.Item onClick={toggle}>Favourites</NavDropdown.Item></Link>
              <Link href="/history" passHref legacyBehavior><NavDropdown.Item onClick={toggle}>Search History</NavDropdown.Item></Link>
              <NavDropdown.Item onClick={() => {
                    logout()
                    setIsExpanded(false)
                  }}>
                    Logout
                  </NavDropdown.Item>
            </NavDropdown>
           </Nav>
           }
          
          <Nav>
            {!token && <>
              <Link href="/register" passHref legacyBehavior><Nav.Link onClick={toggle}>Register</Nav.Link></Link> 
           <Link href="/login" passHref legacyBehavior><Nav.Link onClick={toggle}>Log In</Nav.Link></Link>
            </>}

          
          
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    <br /><br />
    </>
   
  );
}


export default NavScrollExample;
