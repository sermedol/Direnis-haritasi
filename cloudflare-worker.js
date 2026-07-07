// Sınıf Atlası — kendi CORS proxy'niz (Cloudflare Worker)
//
// Ne işe yarar: Sınıf Atlası tarayıcıdan doğrudan erişilemeyen (CORS engelli)
// haber kaynaklarına (Google Haberler RSS, haber sitesi sayfaları) bu worker
// üzerinden ulaşır. Ücretsiz paylaşılan proxy'lerin aksine bu SADECE sizin
// kotanızı kullanır, başkalarının kötüye kullanımından etkilenmez.
//
// Kurulum:
// 1. https://dash.cloudflare.com adresine gidip ücretsiz bir hesap açın
//    (zaten hesabınız varsa giriş yapın).
// 2. Sol menüden "Workers & Pages" > "Create" > "Create Worker" seçin.
// 3. Worker'a bir isim verin (örn. "sinif-atlasi-proxy") ve "Deploy" deyin.
// 4. Oluşan worker'ı açın, "Edit code" / kod düzenleyiciye girin.
// 5. Editördeki mevcut örnek kodun TAMAMINI silip bu dosyanın içeriğini yapıştırın.
// 6. Sağ üstten "Deploy" / "Save and deploy" deyin.
// 7. Worker'ınızın adresi şuna benzer olacak:
//    https://sinif-atlasi-proxy.KULLANICI-ADINIZ.workers.dev
//    Bu tam adresi Claude'a (bana) verin, kodun geri kalanına ben ekleyeceğim.

export default {
  async fetch(request) {
    const requestUrl = new URL(request.url);

    // Tarayıcının "preflight" (OPTIONS) isteğine izin ver.
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders() });
    }

    const target = requestUrl.searchParams.get("url");
    if (!target || !/^https?:\/\//i.test(target)) {
      return new Response("Eksik veya geçersiz 'url' parametresi.", {
        status: 400,
        headers: corsHeaders()
      });
    }

    try {
      const upstream = await fetch(target, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
          "Accept": "*/*"
        },
        redirect: "follow",
        cf: { cacheTtl: 120, cacheEverything: false }
      });

      const contentType = upstream.headers.get("Content-Type") || "text/plain; charset=utf-8";
      const body = await upstream.arrayBuffer();

      return new Response(body, {
        status: upstream.status,
        headers: { ...corsHeaders(), "Content-Type": contentType }
      });
    } catch (error) {
      return new Response("Proxy hatası: " + error.message, {
        status: 502,
        headers: corsHeaders()
      });
    }
  }
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "*",
    "Cache-Control": "public, max-age=120"
  };
}
