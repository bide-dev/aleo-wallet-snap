import React, { useState } from "react";
import { Button, Card, Col, Divider, Form, Input, Row } from "antd";

import { CopyButton } from "./CopyButton";
import * as snap from "./snap";

export const NewAccount = () => {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);

  const clear = () => setAccount(null);

  const createAccount = async () => {
    clear();
    setLoading(true);
    setTimeout(() => { }, 100);
    const result = await snap.getRandomAccount();
    if (!result) {
      alert("Failed to create a new account");
      setLoading(false);
      return;
    }
    setAccount(result);
    setLoading(false);
  };

  const privateKey = () =>
    account !== null ? "Stays safe inside MetaMask!" : "";
  const viewKey = () => (account !== null ? account.viewKey : "");
  const address = () => (account !== null ? account.address : "");

  const layout = { labelCol: { span: 3 }, wrapperCol: { span: 21 } };

  return (
    <>
      <Divider />
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
        {account && (
          <Form {...layout}>
            <Divider />
            <Form.Item label="Private Key" colon={false}>
              <Input
                size="large"
                placeholder="Private Key"
                value={privateKey()}
                addonAfter={<CopyButton data={privateKey()} />}
                disabled
              />
            </Form.Item>
            <Form.Item label="View Key" colon={false}>
              <Input
                size="large"
                placeholder="View Key"
                value={viewKey()}
                addonAfter={<CopyButton data={viewKey()} />}
                disabled
              />
            </Form.Item>
            <Form.Item label="Address" colon={false}>
              <Input
                size="large"
                placeholder="Address"
                value={address()}
                addonAfter={<CopyButton data={address()} />}
                disabled
              />
            </Form.Item>
          </Form>
        )}
      </Card>
    </>
  );
};
