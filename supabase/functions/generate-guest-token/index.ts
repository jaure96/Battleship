// supabase/functions/generate-guest-token/index.ts
import * as jose from "https://deno.land/x/jose@v5.2.3/index.ts";
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// Edge Function para generar un token de invitado sin login
// Compatible con Supabase Edge Functions (Deno runtime)

const JWT_SECRET = Deno.env.get("JWT_SECRET");
if (!JWT_SECRET) throw new Error("Missing JWT_SECRET environment variable");

Deno.serve(async (req) => {
  try {
    const { nickname } = await req.json().catch(() => ({ nickname: "Guest" }));

    const id = crypto.randomUUID();
    const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24; // expira en 24h

    const payload = {
      sub: id,
      nickname,
      role: "anon",
      exp,
    };

    // Firmamos el JWT con HS256
    const secretKey = new TextEncoder().encode(JWT_SECRET);
    const jwt = await new jose.SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .sign(secretKey);

    return new Response(
      JSON.stringify({
        token: jwt,
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
    console.error("Error generating guest token:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
