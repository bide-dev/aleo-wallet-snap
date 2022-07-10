import React, { useState, useEffect } from "react";
import { Button, Card, Col, Form, Row, Divider } from "antd";

import * as snap from "./snap";
import { AccountList } from "./components/AccountList";

export const NewAccount = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);

  const createAccount = async () => {
    setLoading(true);
    setTimeout(() => { }, 100);
    const account = await snap.getRandomAccount();
    if (!account) {
      alert("Failed to create a new account");
      setLoading(false);
      return;
    }
    setAccounts([...accounts, account]);
    setLoading(false);
  };

  useEffect(() => {
    const readAccounts = async () => {
      setAccounts([]);
      setLoading(true);
      setTimeout(() => { }, 100);
      const accounts = await snap.getAccounts();
      if (!accounts) {
        alert("Failed to read accounts");
        setLoading(false);
        return;
      }
      setAccounts(accounts);
      setLoading(false);
    };

    readAccounts().catch(console.error);
  }, []);

  const onDeleteAllAccounts = async () => {
    setLoading(true);
    await snap.deleteAllAccounts();
    setLoading(false);
    setAccounts([]);
  }

  const onDeleteAccount = async (address) => {
    setLoading(true);
    await snap.deleteAccount(address);
    setLoading(false);
    setAccounts(accounts.filter(acc => acc.address !== address));
  }

  const layout = { labelCol: { span: 3 }, wrapperCol: { span: 21 } };

  return (
    <>
      <Card
        title="Create a new account"
        style={{ width: "100%", borderRadius: "20px" }}
        bordered={false}
      >
        <Form {...layout} onChange={(event) => setSubstr(event.target.value)}>
          <Row justify="center">
            <Col>
              <Button
                type="primary"
                onClick={createAccount}
                shape="round"
                size="large"
                loading={!!loading}
              >
                Create
              </Button>
            </Col>
          </Row>
        </Form>
        <Divider />
        <AccountList
          accounts={accounts}
          onDeleteAccount={onDeleteAccount}
          onDeleteAllAccounts={onDeleteAllAccounts}
        />
      </Card>
    </>
  );
};
