const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(statusCode, success, msg) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ success, data: { msg } }),
  };
}

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return json(405, false, "Method not allowed.");
  }

  const params = new URLSearchParams(event.body || "");
  const email = (params.get("email") || "").trim();
  const first = (params.get("first") || "").trim();

  if (!EMAIL_RE.test(email)) {
    return json(400, false, "Please enter a valid email.");
  }

  const apiKey = process.env.CONVERTKIT_API_KEY;
  const formId = process.env.CONVERTKIT_FORM_ID;
  if (!apiKey || !formId) {
    return json(500, false, "Email signup isn't configured yet.");
  }

  try {
    const res = await fetch(`https://api.convertkit.com/v3/forms/${formId}/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ api_key: apiKey, email, first_name: first }),
    });
    if (res.ok) {
      return json(200, true, "You're in - check your inbox to confirm.");
    }
    return json(500, false, "Could not subscribe right now. Please try again.");
  } catch (err) {
    return json(500, false, "Network error, please try again.");
  }
};
