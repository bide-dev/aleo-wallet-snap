import React from "react";
import { Button, Col, Divider, Form, Row } from "antd";

import { Account } from "./Account";

export const AccountList = ({ accounts, onDeleteAccount, onDeleteWallet, onExportSeed }) => {

    const accountsToRender = (accounts ?? []).map(
        acc => <Account
            key={acc.address}
            account={acc}
            onDeleteAccount={() => onDeleteAccount(acc.address)}
            onExportSeed={() => onExportSeed(acc.address)}
        />
    );
    const layout = { labelCol: { span: 3 }, wrapperCol: { span: 21 } };
    return (
        <>
            {accountsToRender}
            {
                accounts.length > 0 && (
                    <>
                        <Divider />
                        <Form {...layout} onChange={(event) => setSubstr(event.target.value)}>
                            <Row justify="center">
                                <Col>
                                    <Button
                                        type="primary"
                                        danger
                                        onClick={onDeleteWallet}
                                        shape="round"
                                        size="large"
                                    >
                                        Delete All Accounts
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </>
                )
            }

        </>
    );
};
