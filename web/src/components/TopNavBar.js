import React from 'react';
import {Link} from 'react-router';
import {LinkContainer} from 'react-router-bootstrap';
import {Navbar, Nav, NavItem, NavDropdown, MenuItem} from 'react-bootstrap';

class TopNavBar extends React.Component {
  render() {
    return (
			<Navbar inverse collapseOnSelect>
				<Navbar.Header>
					<Navbar.Brand>
						<a href="#" className="sgabuzen-music-logo">&nbsp;&nbsp;&nbsp;</a>
					</Navbar.Brand>
					<Navbar.Brand>
						<a href="#">Guitar Router</a>
					</Navbar.Brand>
					<Navbar.Toggle />
				</Navbar.Header>
				<Navbar.Collapse>
					<Nav pullRight>
            <LinkContainer to="/">
						  <NavItem>Dashboard</NavItem>
            </LinkContainer>
            <LinkContainer to="/system">
						  <NavItem>System</NavItem>
            </LinkContainer>
					</Nav>
				</Navbar.Collapse>
			</Navbar>
    );
  }
}

export default TopNavBar;
