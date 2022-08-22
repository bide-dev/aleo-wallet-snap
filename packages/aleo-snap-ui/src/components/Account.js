import React from "react";
import { Button, Card, Form, Input } from "antd";

import { CopyButton } from "./CopyButton";

export const Account = ({ account, onDeleteAccount, onExportSeed }) => {
    const { privateKey, viewKey, address, seed } = account;
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
                {privateKey && (
                    <Form.Item label="Private Key" colon={false}>
                        <Input
                            size="large"
                            placeholder="Private Key"
                            value={privateKey}
                            addonAfter={<CopyButton data={privateKey} />}
                            disabled
                        />
                    </Form.Item>
                )}
                {seed && (
                    <Form.Item label="Seed" colon={false}>
                        <Input
                            size="large"
                            placeholder="Seed"
                            value={seed}
                            addonAfter={<CopyButton data={seed} />}
                            disabled
                        />
                    </Form.Item>
                )}
                {onDeleteAccount && (
                    <Button type="dashed" danger onClick={onDeleteAccount} style={{ margin: '10px' }}>
                        Delete
                    </Button>
                )}
                {onExportSeed && (
                    <Button onClick={onExportSeed} style={{ margin: '10px' }}>
                        Export Seed
                    </Button>
                )}
            </Form>
        </Card>
    );
};
