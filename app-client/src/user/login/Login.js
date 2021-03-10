import React, { Component } from 'react';
import { login } from '../../util/APIUtils';
import './Login.css';
import { Link } from 'react-router-dom';
import { ACCESS_TOKEN } from '../../constants';

import { Form, Input, Button, Checkbox, notification } from 'antd';

import { UserOutlined, LockOutlined } from '@ant-design/icons';

function Login(props) {    
    return (
        <div className="login-container">
            <h1 className="page-title">Login</h1>
            <div className="login-content">
                <LoginForm onLogin={props.onLogin}/>
            </div>
        </div>
    );
}

const LoginForm = (props) => {

    const handleSubmit = (values) => {
        const loginRequest = Object.assign({}, values);
        
        console.log(loginRequest);

        login(loginRequest)
        .then(response => {
            localStorage.setItem(ACCESS_TOKEN, response.accessToken);
            props.onLogin();
        }).catch(error => {
            if(error.status === 401) {
                notification.error({
                    message: 'ReadingOcean',
                    description: 'Your Username or Password is incorrect. Please try again!'
                });                    
            } else {
                notification.error({
                    message: 'ReadingOcean',
                    description: error.message || 'Sorry! Something went wrong. Please try again!'
                });                                            
            }
        });
    }
    
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const layout = {
        labelCol: {
          span: 8,
        },
        wrapperCol: {
          span: 16,
        },
      };
    const tailLayout = {
    wrapperCol: {
        offset: 8,
        span: 16,
    },
    };

    return (
        <Form {...layout}  name="basic" initialValues={{ remember: true, }} 
            onFinish={handleSubmit}
            onFinishFailed={onFinishFailed}
      >
            <Form.Item label="Username" name="username" rules={[{ required: true, message: 'Please input your username!' }]}>
            <Input />
            </Form.Item>
    
            <Form.Item  label="Password"  name="password" rules={[{required: true, message: 'Please input your password!' }]}>
            <Input.Password />
            </Form.Item>
    
            <Form.Item {...tailLayout} name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
            </Form.Item>
    
            <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
                Submit
            </Button>
            </Form.Item>
      </Form>
    );
    
}

export default Login;