<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="F16s E-Freight Solutions (F16s EFS) revolutionizes freight forwarding with instant access to air freight export rates and AWB automation. Empowering forwarders with digital efficiency and 150+ airline connections.">
    <meta name="keywords" content="e-freight solutions, air freight automation, AWB processing, freight forwarding software, digital logistics, EDI connectivity">
    <meta name="author" content="F16s E-Freight Solutions">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="{{ url()->current() }}">
    <meta property="og:title" content="F16s E-Freight Solutions | Smart Logistics Automation">
    <meta property="og:description" content="Revolutionize your freight forwarding with F16s. Instant AWB generation, 150+ airline connections, and lightning-fast digital efficiency.">
    <meta property="og:image" content="{{ asset('/media/assets/logos/blue-logo.svg') }}">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="{{ url()->current() }}">
    <meta property="twitter:title" content="F16s E-Freight Solutions | Smart Logistics Automation">
    <meta property="twitter:description" content="Revolutionize your freight forwarding with F16s. Instant AWB generation, 150+ airline connections, and lightning-fast digital efficiency.">
    <meta property="twitter:image" content="{{ asset('/media/assets/logos/blue-logo.svg') }}">

    <link rel="canonical" href="{{ url()->current() }}">

    <!-- Organization Schema -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "F16s E-Freight Solutions",
        "url": "https://f16sefreight.com",
        "logo": "https://f16sefreight.com/media/assets/logos/blue-logo.svg",
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "",
            "contactType": "customer service",
            "areaServed": "Global",
            "availableLanguage": "English"
        },
        "sameAs": [
            "https://www.linkedin.com/company/f16s-efreight-solutions",
            "https://twitter.com/f16sefreight"
        ]
    }
    </script>
    <title>F16s E-Freight Solutions | Smart Freight Forwarding Automation</title>
    <link rel="icon" href="/media/assets/logos/favicon.jpeg" type="image/x-icon">
    <link rel="stylesheet" href="{{ mix('/css/app.css') }}">
</head>
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-JCFDX15593"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-JCFDX15593');
</script>
<body>
    <!-- CUSTOM PRELOADER -->
    <div id="app-preloader" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: #ffffff; display: flex; align-items: center; justify-content: center; z-index: 10000; overflow: hidden; transition: opacity 0.6s ease-in-out;">
        <img src="/media/assets/logos/blue-logo.svg" alt="Loading..." style="width: 150px; height: auto; object-fit: contain; animation: pulse 2s infinite ease-in-out;">
    </div>

    <style>
        @keyframes pulse {
            0% { transform: scale(1); opacity: 0.9; }
            50% { transform: scale(1.05); opacity: 1; }
            100% { transform: scale(1); opacity: 0.9; }
        }
    </style>

    <div id="app"></div>
    
    <!-- Build Assets -->
    <script src="{{ mix('js/manifest.js') }}" defer></script>
    <script src="{{ mix('vendor.js') }}" defer></script>
    <script src="{{ mix('js/app.js') }}" defer></script>
    
    <!-- External Libraries -->
    <script src="https://cdn.jsdelivr.net/clipboard.js/2.0.8/clipboard.min.js"></script>

    <script>
      window.addEventListener('load', function() {
        var loader = document.getElementById('app-preloader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(function() {
                loader.style.display = 'none';
                loader.parentNode.removeChild(loader);
            }, 600);
        }
      });
    </script>
</body>


</html>