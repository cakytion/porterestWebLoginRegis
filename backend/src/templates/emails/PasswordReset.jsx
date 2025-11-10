import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import React from "react";

// template: https://demo.react.email/preview/reset-password/dropbox-reset-password

export const PasswordReset = ({ userName = "User", resetLink = "#" }) => {
  return (
    <Html>
      <Head />
      <Preview>Reset your Porterest password</Preview>
      <Body
        style={{
          backgroundColor: "#f9fafb",
          padding: "20px 0",
          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        <Container
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            padding: "40px",
            margin: "0 auto",
            maxWidth: "600px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Section>
            <Text
              style={{
                fontSize: "16px",
                lineHeight: "24px",
                marginBottom: "16px",
                color: "#374151",
                fontWeight: "400",
              }}
            >
              Hi {userName},
            </Text>
            <Text
              style={{
                fontSize: "16px",
                lineHeight: "24px",
                marginBottom: "24px",
                color: "#374151",
                fontWeight: "400",
              }}
            >
              We received a password reset request for your Porterest account. If this was you, you
              can set a new password here:
            </Text>
            <Button
              href={resetLink}
              style={{
                backgroundColor: "#222222",
                borderRadius: "8px",
                color: "#ffffff",
                fontSize: "16px",
                fontWeight: "600",
                textDecoration: "none",
                textAlign: "center",
                display: "inline-block",
                padding: "12px 32px",
                marginBottom: "24px",
              }}
            >
              Reset Password
            </Button>
            <Text
              style={{
                fontSize: "14px",
                lineHeight: "22px",
                marginBottom: "12px",
                color: "#555555",
                fontWeight: "400",
              }}
            >
              If you don&apos;t want to change your password or didn&apos;t request this, just
              ignore and delete this message.
            </Text>
            <Text
              style={{
                fontSize: "14px",
                lineHeight: "22px",
                marginTop: "24px",
                paddingTop: "16px",
                borderTop: "1px solid #e5e7eb",
                color: "#6b7280",
                fontWeight: "400",
              }}
            >
              This link expires in 15 minutes.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

PasswordReset.PreviewProps = {
  userName: "Alan",
  resetLink: "https://porterest.com/reset-password?token=example",
};

export default PasswordReset;
