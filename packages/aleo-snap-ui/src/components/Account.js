import React from "react";
import { Button, Card, Form, Input } from "antd";

import { CopyButton } from "./CopyButton";

export const Account = ({ account, onDeleteAccount }) => {
    const { viewKey, address } = account;

    const layout = { labelCol: { span: 2 }, wrapperCol: { span: 21 } };
    return (
        <Card>
            <Form {...layout}>
                <Form.Item label="View Key" colon={false}>
                    <Input
                        size="large"
                        placeholder="View Key"
                        value={viewKey}
                        addonAfter={<CopyButton data={viewKey} />}
                        disabled
                    />
                </Form.Item>
                <Form.Item label="Address" colon={false}>
                    <Input
                        size="large"
                        placeholder="Address"
                        value={address}
                        addonAfter={<CopyButton data={address} />}
                        disabled
                    />
                </Form.Item>
                <Button type="dashed" danger onClick={onDeleteAccount}>
                    Delete
                </Button>
            </Form>
        </Card>
    );
};
