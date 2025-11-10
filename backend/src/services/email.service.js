import { Resend } from "resend";
import { render } from "@react-email/components";
import React from "react";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (templateComponent, props, recipientEmail, subject) => {
  try {
    // render react component to html string
    const html = await render(React.createElement(templateComponent, props));

    // send via resend
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: recipientEmail,
      subject: subject,
      html: html,
    });

    if (error) {
      console.error("email send failed:", error);
      return { success: false, error: error.message };
    }

    return { success: true, emailId: data.id };
  } catch (error) {
    console.error("email service error:", error);
    return { success: false, error: error.message };
  }
};
