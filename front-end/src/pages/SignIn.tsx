import React from 'react';
import './SignIn.css';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input } from 'antd';
import { useState } from 'react';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Route,
  Link,
  useHistory,
} from 'react-router-dom';

enum LoginStatus {
  Login,
  Register,
}

const SignIn = () => {
  const [PageStatus, setPageStatus] = useState<LoginStatus>(LoginStatus.Login);
  axios.defaults.baseURL = 'http://127.0.0.1:8080';
  const history = useHistory();

  const Login = (values: any) => {
    console.log('Received values of form: ', values);
    axios
      .post('/user/login', {
        username: values.username,
        password: values.password,
      })
      .then(response => {
        let statusCode = response.data['status'];
        console.log(response);
        switch (statusCode) {
          case 'success':
            alert('success');
            history.push('/home/');
            break;
          case 'password error':
            alert('password error');
            break;
          case 'username error':
            alert('username error');
            break;
        }
      })
      .catch(error => {
        console.log('fail to login');
      });
  };

  const Register = (values: any) => {
    axios
      .post('/user/register', {
        username: values.username,
        password: values.password,
      })
      .then(response => {
        alert(response.data['status']);
        switch (response.data['status']) {
          case 'success':
            setPageStatus(LoginStatus.Login);
            break;
          case 'username has been used':
            alert('username error');
            break;
        }
      })
      .catch(error => {
        console.log('fail to login');
      });
  };

  if (PageStatus === LoginStatus.Login) {
    return (
      <div className="box-SignIn">
        <div className="login-box-SignIn">
          <fieldset className="login-contain">
            <legend className="legend">用户登录</legend>
            <Form
              name="normal_login"
              className="login-form"
              initialValues={{ remember: true }}
              onFinish={Login}
            >
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: 'Please input your Username!' },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="Username"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: 'Please input your Password!' },
                ]}
              >
                <Input
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="Password"
                />
              </Form.Item>
              <Form.Item>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>记住密码</Checkbox>
                </Form.Item>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a
                  className="login-form-forgot"
                  onClick={() => {
                    setPageStatus(LoginStatus.Register);
                  }}
                >
                  注册
                </a>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                >
                  Log in
                </Button>
              </Form.Item>
            </Form>
          </fieldset>
        </div>
      </div>
    );
  } else {
    return (
      <div className="box-Register">
        <div className="login-box-Register">
          <fieldset className="login-contain">
            <legend className="legend">用户注册</legend>
            <Form
              name="normal_login"
              className="login-form"
              initialValues={{ remember: true }}
              onFinish={Register}
            >
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: 'Please input your Username!' },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="Register Username"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: 'Please input your Password!' },
                ]}
              >
                <Input
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="Register Password"
                />
              </Form.Item>
              <Form.Item>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a
                  className="login-form-forgot"
                  onClick={() => {
                    setPageStatus(LoginStatus.Login);
                  }}
                >
                  返回登录
                </a>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                >
                  Register
                </Button>
              </Form.Item>
            </Form>
          </fieldset>
        </div>
      </div>
    );
  }
};

export default SignIn;
