import React, { useState } from "react";
import { Button, Card, Col, Divider, Form, Input, Row } from "antd";

import { findVanityAddress } from "./vanity";
import { Account } from "./components/Account";

export const NewVanityAccount = () => {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [substr, setSubstr] = useState("");

  const clear = () => setAccount(null);

  const generateAccount = async () => {
    clear();
    setLoading(true);
    setTimeout(() => { }, 100);
    const { account } = await findVanityAddress(substr, 25);
    if (!account) {
      // TODO: Add max epoch to use input?
      // TODO: use setError
      alert("Failed to generate a vanity account");
      setLoading(false);
      return;
    }
    setAccount(account);
    setLoading(false);
  };

  const layout = { labelCol: { span: 3 }, wrapperCol: { span: 21 } };

  return (
    <>
      <Divider />
      <Card
        title="Generate a Vanity Account"
        style={{ width: "100%", borderRadius: "20px" }}
        bordered={false}
      >
        <Form {...layout} onChange={(event) => setSubstr(event.target.value)}>
          <p>
            Info: Generating a vanity account could take a while. For starters,
            try: "e".
            Note that this account will not be persisted. In order to persist it, copy the account seed and go to "Recover Account" tab.
          </p>
          <Form.Item label="Prefix" colon={false}>
            <Input
              name="Prefix"
              size="large"
              placeholder="e"
              allowClear
              style={{ borderRadius: "20px" }}
            />
          </Form.Item>
          <Row justify="center">
            <Col>
              <Button
                type="primary"
                disabled={!substr}
                onClick={generateAccount}
                shape="round"
                size="large"
                loading={!!loading}
              >
                Generate
              </Button>
            </Col>
          </Row>
        </Form>
        {account && (
          <div>
            <Divider />
            <Account
              account={account}
            />
          </div>
        )}
      </Card>
    </>
  );
};
