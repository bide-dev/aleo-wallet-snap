import React, { useState } from "react";
import { Button, Card, Col, Divider, Form, Input, Row } from "antd";

import { CopyButton } from "./CopyButton";
import * as snap from "./snap";
import { bufferToHex } from "./utils";

const layout = { labelCol: { span: 3 }, wrapperCol: { span: 21 } };

export const SignMessage = () => {
  const [signedMessage, setSignedMessage] = useState("");
  const [message, setMessage] = useState("");
  const [loadingSignMessage, setLoadingSignMessage] = useState(false);

  const signMessage = async () => {
    setSignedMessage(null);
    setLoadingSignMessage(true);
    setTimeout(() => { }, 100);
    // TODO: Why aren't we getting ArrayBuffer here?
    const signed = await snap.signPayload(message);
    if (!signed) {
      // TODO: use setError
      alert("Failed to sign a message");
      setLoadingSignMessage(false);
      return;
    }

    setSignedMessage(signed);
    setLoadingSignMessage(false);
  };

  const signedMessageHex = () => bufferToHex(Object.values(signedMessage));

  return (
    <>
      <Divider />
      <Card
        title="Sign a Message"
        style={{ width: "100%", borderRadius: "20px" }}
        bordered={false}
      >
        <Form {...layout}>
          <p>Currently, this message is signed using a random account</p>
          <Form.Item colon={false}>
            <Input
              name="Message"
              size="large"
              placeholder="Enter a message"
              onChange={(event) => setMessage(event.target.value)}
              style={{ borderRadius: "20px" }}
            />
          </Form.Item>
          <Row justify="center">
            <Col>
              <Button
                type="primary"
                disabled={!message}
                onClick={signMessage}
                shape="round"
                size="large"
                loading={!!loadingSignMessage}
              >
                Sign
              </Button>
            </Col>
          </Row>
        </Form>
        {signedMessage && (
          <Form {...layout}>
            <Divider />
            <Form.Item label="Signed message (hex)" colon={false}>
              <Input
                size="large"
                placeholder="Signed Message"
                value={signedMessageHex()}
                addonAfter={<CopyButton data={signedMessageHex()} />}
                disabled
              />
            </Form.Item>
          </Form>
        )}
      </Card>
    </>
  );
};
