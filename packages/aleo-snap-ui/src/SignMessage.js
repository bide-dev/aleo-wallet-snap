import React, { useState, useEffect } from "react";
import { Button, Card, Col, Divider, Form, Input, Row, Select } from "antd";

import { CopyButton } from "./components/CopyButton";
import * as snap from "./snap";
import { bufferToHex } from "./utils";

const layout = { labelCol: { span: 3 }, wrapperCol: { span: 21 } };

export const SignMessage = () => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [signedMessage, setSignedMessage] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const signMessage = async () => {
    setSignedMessage("");
    setLoading(true);
    setTimeout(() => { }, 100);
    const signed = await snap.signPayload(selectedAddress, message);
    if (!signed) {
      // TODO: use setError
      alert("Failed to sign a message");
      setLoading(false);
      return;
    }
    setSignedMessage(signed);
    setLoading(false);
  };

  useEffect(() => {
    const readAccounts = async () => {
      setAddresses([]);
      setLoading(true);
      setTimeout(() => { }, 100);
      const accounts = await snap.getAccounts();
      if (!accounts) {
        alert("Failed to read accounts");
        setLoading(false);
        return;
      }
      setAddresses(accounts.map(acc => acc.address));
      setLoading(false);
    };

    readAccounts().catch(console.error);
  }, []);

  const signedMessageHex = () => bufferToHex(Object.values(signedMessage));

  const { Option } = Select;
  const selectAddressOptions = addresses.map(address => (
    <Option value={address} key={address}>{address}</Option>
  ));

  return (
    <>
      <Card
        title="Sign a Message"
        style={{ width: "100%", borderRadius: "20px" }}
        bordered={false}
      >
        <Form {...layout}>
          {!addresses.length && (<p>Please create an account first</p>)}
          {addresses && (
            <Select
              loading={loading}
              placeholder="Please select an account"
              style={{ width: 360 }}
              onChange={setSelectedAddress}>
              {selectAddressOptions}
            </Select>
          )}
          <Divider />
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
                loading={!!loading}
              >
                Sign
              </Button>
            </Col>
          </Row>
        </Form>
        {signedMessage && (
          <Form {...layout}>
            <Divider />
            <Form.Item label="Signed (hex)" colon={false}>
              <Input
                size="large"
                placeholder="Signed Message"
                style={{ width: 360 }}
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
