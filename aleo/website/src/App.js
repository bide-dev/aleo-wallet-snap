import './App.css';
import React, {useState} from 'react';

import {Layout, Menu} from 'antd';
import {NewAccount} from "./NewAccount";
import {AccountFromPrivateKey} from "./AccountFromPrivateKey";
import DecryptRecord from "./DecryptRecord";

const {Header, Content, Footer} = Layout;

function App() {
    const [menuIndex, setMenuIndex] = useState(0);

    return (
        <Layout className="layout" style={{minHeight: '100vh'}}>
            <Header className="header">
                <div className="logo"/>
                <Menu mode="horizontal" defaultSelectedKeys={['1']}>
                    <Menu.Item key="1" onClick={() => setMenuIndex(0)}>Account</Menu.Item>
                    <Menu.Item key="2" onClick={() => setMenuIndex(1)}>Record</Menu.Item>
                    {/*<Menu.Item key="3">*/}
                    {/*    <a href="./dev/bench" target="_blank" rel="noopener noreferrer">*/}
                    {/*        Benchmarks*/}
                    {/*    </a>*/}
                    {/*</Menu.Item>*/}
                </Menu>
            </Header>
            <Content style={{padding: '50px 50px'}}>
                {
                    menuIndex === 0 &&
                    <>
                        <NewAccount/>
                        <br/>
                        <AccountFromPrivateKey/>
                    </>
                }
                {
                    menuIndex === 1 && <DecryptRecord/>
                }
            </Content>
            <Footer style={{textAlign: 'center'}}>Visit the <a href="https://github.com/AleoHQ/aleo">Aleo Github
                repo</a>.</Footer>
        </Layout>
    );
}

export default App;
