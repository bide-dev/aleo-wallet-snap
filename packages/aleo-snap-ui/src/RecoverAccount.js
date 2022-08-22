import React, { useState } from "react";
import { Button, Card, Col, Divider, Form, Input, Row } from "antd";

import { CopyButton } from "./components/CopyButton";
import { getAccountFromSeed } from "aleo-snap-adapter";
import { Account } from "./components/Account";

const layout = { labelCol: { span: 3 }, wrapperCol: { span: 21 } };

export const RecoverAccount = () => {
  const [account, setAccount] = useState(null);
  const [seed, setSeed] = useState("");
  const [loadingRecovery, setLoadingRecovery] = useState(false);

  const recoverAccount = async () => {
    setAccount(null);
    setLoadingRecovery(true);
    setTimeout(() => { }, 100);
    const account = await getAccountFromSeed(seed);
    if (!account) {
      // TODO: use setError
      alert("Failed to recover an account");
      setLoadingRecovery(false);
      return;
    }
    setAccount(account);
    setLoadingRecovery(false);
  };

  return (
    <>
      <Divider />
      <Card
        title="Recover an Account"
        style={{ width: "100%", borderRadius: "20px" }}
        bordered={false}
      >
        <Form {...layout}>
          <p>Info: You need to generate account first either in "Create Account" or "Create Vanity Account" tab.</p>
          <p>Recovered accounts are persisted.</p>
          <Form.Item colon={false}>
            <Input
              name="Seed"
              size="large"
              placeholder="Enter seed"
              onChange={(event) => setSeed(event.target.value)}
              style={{ borderRadius: "20px" }}
            />
          </Form.Item>
          <Row justify="center">
            <Col>
              <Button
                type="primary"
                disabled={!seed}
                onClick={recoverAccount}
                shape="round"
                size="large"
                loading={!!loadingRecovery}
              >
                Recover
              </Button>
            </Col>
          </Row>
        </Form>
        {account && (
          <Account account={account} />
        )}
      </Card>
    </>
  );
};
