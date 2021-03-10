import React from 'react';
import { Link, withRouter }from 'react-router-dom';
import './AppHeader.css';
import pollIcon from '../poll.svg';
import { Layout, Menu, Dropdown, PageHeader } from 'antd';
import { HomeFilled, UserOutlined, DownOutlined } from '@ant-design/icons';

const { Header } = Layout;

function AppHeader(props) {
    const { currentUser, onLogout, location } = props;

    const handleMenuClick = ({ key }) => {
      if(key === "logout")
        onLogout();
    }

    const menuWithLoggedIn = [
      <Menu.Item key="/">
        <Link to="/">
          <HomeFilled className="nav-icon" />
        </Link>
      </Menu.Item>,
      <Menu.Item key="/poll/new">
        <Link to="/poll/new">
          <img src={pollIcon} alt="poll" className="poll-icon" />
        </Link>
      </Menu.Item>,
      <Menu.Item key="/profile" className="profile-menu">
          <ProfileDropdownMenu currentUser handleMenuClick/>
      </Menu.Item>
    ];
  
    const menuWithoutLogin = [
      <Menu.Item key="/login"> 
        <Link to="/login">Login</Link>
      </Menu.Item>,
      <Menu.Item key="/signup">
        <Link to="/signup">Signup</Link>
      </Menu.Item>                  
    ];

    return (
      <PageHeader className="app-header">
        <div className="container">
          <div className="app-title" >
            <Link to="/">ReadingOcean</Link>
          </div>
          <Menu className="app-menu"  mode="vertical" selectedKeys={[location.pathname]} style={{ lineHeight: '64px' }} >
              { currentUser ? menuWithLoggedIn : menuWithoutLogin }
          </Menu>
        </div>
      </PageHeader>
    );
    
}

function ProfileDropdownMenu(props) {

  const { handleMenuClick,currentUser } = props;

  const dropdownMenu = (
    <Menu onClick={handleMenuClick} className="profile-dropdown-menu">
      <Menu.Item key="user-info" className="dropdown-item" disabled>
        <div className="user-full-name-info">
          {currentUser.name}
        </div>
        <div className="username-info">
          @{currentUser.username}
        </div>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="profile" className="dropdown-item">
        <Link to={`/users/${currentUser.username}`}>Profile</Link>
      </Menu.Item>
      <Menu.Item key="logout" className="dropdown-item">
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown 
      overlay={dropdownMenu} 
      trigger={['click']}
      getPopupContainer = { () => document.getElementsByClassName('profile-menu')[0]}>
      <a className="ant-dropdown-link">
        <UserOutlined className="nav-icon" style={{marginRight: 0}} /> <DownOutlined />
      </a>
    </Dropdown>
  );
}


export default withRouter(AppHeader);