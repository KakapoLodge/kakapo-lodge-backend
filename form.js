async function main(args) {
  const baseURL = "https://api.sendpulse.com";

  const authValue = await getAuthorizationValue(baseURL);

  const smtpRequestHeaders = new Headers({
    Authorization: authValue,
    "Content-Type": "application/json;charset=utf-8",
  });

  const smtpRequestBody = constructSMTPRequestBody(args);

  const smtpResponse = await fetch(`${baseURL}/smtp/emails`, {
    method: "post",
    body: JSON.stringify(smtpRequestBody),
    headers: smtpRequestHeaders,
  });

  return {
    body: smtpResponse.ok ? "Sent email successfully" : " Failed to send email",
  };
}

async function getAuthorizationValue(baseURL) {
  const authRequestBody = {
    grant_type: "client_credentials",
    client_id: "",
    client_secret: "",
  };
  const authRequestHeaders = new Headers({
    "Content-Type": "application/json;charset=utf-8",
  });

  const authResponse = await fetch(`${baseURL}/oauth/access_token`, {
    method: "POST",
    body: JSON.stringify(authRequestBody),
    headers: authRequestHeaders,
  });
  const authResponseBody = await authResponse.json();

  const tokenType = authResponseBody["token_type"];
  const token = authResponseBody["access_token"];

  return `${tokenType} ${token}`;
}

function constructSMTPRequestBody(args) {
  const emailHTML = constructEmailHTML(args);
  const { email, phone, name, message } = args;

  const requestBody = {
    email: {
      html: btoa(emailHTML),
      text: `Email: ${email}\nPhone: ${phone}\nName: ${name}\nMessage:\n${message}`,
      subject: `Enquiry for Kakapo Lodge by ${name} (${email})`,
      from: {
        name: name,
        email: "stay@kakapolodge.co.nz",
      },
      to: [
        {
          name: "Kakapo Lodge",
          email: "stay@kakapolodge.co.nz",
        },
      ],
    },
  };

  const copy = args.copy || false;

  if (copy) {
    requestBody.email.bcc = [
      {
        name: name,
        email: email,
      }
    ]
  }

  return requestBody;
}

function constructEmailHTML(args) {
  const { email, phone, name, message } = args;

  return `
<!DOCTYPE html>

<html>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <head>
    <title>Enquiry for Kakapo Lodge</title>

    <style>
      body {
        display: flex;
        flex-direction: column;
        gap: 16px;

        width: 64%;
        margin: 32px auto;

        color: #4b5320;
        background-color: white;

        font-family: Arial, Helvetica, sans-serif;
        font-size: 17px;
      }

      #logo {
        width: 100%;
        height: auto;
      }

      #sender-details {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .sender-detail {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .icon-container {
        width: 24px;
        height: auto;
      }

      .icon {
        width: auto;
        height: 17px;
      }

      #message {
        text-align: justify;
      }

      #separator {
        width: 100%;
        color: #8c9b3e;
      }

      #footnote {
        text-align: center;
        color: #8c9b3e;
      }
    </style>
  </head>

  <body>
    <img
      id="logo"
      src="https://raw.githubusercontent.com/KakapoLodge/kakapo-lodge-backend/main/images/kakapo_logo_text.png"
    />

    <br />

    <div id="sender-details">
      <div id="email" class="sender-detail">
        <div class="icon-container">
          <img
            class="icon"
            src="https://raw.githubusercontent.com/KakapoLodge/kakapo-lodge-backend/main/images/icon_envelope.png"
          />
        </div>
        ${email}
      </div>

      <div id="phone" class="sender-detail">
        <div class="icon-container">
          <img
            class="icon"
            src="https://raw.githubusercontent.com/KakapoLodge/kakapo-lodge-backend/main/images/icon_phone.png"
          />
        </div>
        ${phone}
      </div>

      <div id="name" class="sender-detail">
        <div class="icon-container">
          <img
            class="icon"
            src="https://raw.githubusercontent.com/KakapoLodge/kakapo-lodge-backend/main/images/icon_user.png"
          />
        </div>
        ${name}
      </div>
    </div>

    <br />

    <div id="message">
      ${message}
    </div>

    <hr id="separator" />

    <div id="footnote">
      If you have any further enquiries, please send an email to stay@kakapolodge.co.nz
    </div>
  </body>
</html>
  `;
}
