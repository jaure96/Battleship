import * as jose from "https://deno.land/x/jose@v5.2.3/index.ts";
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const JWT_SECRET = Deno.env.get("JWT_SECRET");
if (!JWT_SECRET) throw new Error("Missing JWT_SECRET environment variable");

Deno.serve(async (req) => {
  try {
    const { token: oldToken } = await req.json();

    if (!oldToken) {
      return new Response(JSON.stringify({ error: "Missing old token" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const secretKey = new TextEncoder().encode(JWT_SECRET);

    // Verify the old token
    const { payload } = await jose.jwtVerify(oldToken, secretKey);

    // Extract sub and nickname from the old token's payload
    const id = payload.sub;
    const nickname = payload.nickname;

    if (!id || typeof nickname !== "string") {
      return new Response(JSON.stringify({ error: "Invalid token payload" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Generate a new expiration time (24 hours from now)
    const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24;

    const newPayload = {
      sub: id,
      nickname,
      role: "anon",
      exp,
    };

    // Sign a new JWT with the same id and nickname, but new expiration
    const newToken = await new jose.SignJWT(newPayload)
      .setProtectedHeader({ alg: "HS256" })
      .sign(secretKey);

    return new Response(
      JSON.stringify({
        token: newToken,
        user: { id, nickname },
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (err) {
    console.error("Error renewing guest token:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
