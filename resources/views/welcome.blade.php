<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    @php
        $meta_title = isset($blog) ? ($blog->meta_title ?? $blog->title) . " | F16s E-Freight" : "F16s E-Freight Solutions | Smart Freight Forwarding Automation";
        $meta_desc = isset($blog) ? ($blog->meta_description ?? $blog->excerpt) : "F16s E-Freight Solutions (F16s EFS) revolutionizes freight forwarding with instant access to air freight export rates and AWB automation. Empowering forwarders with digital efficiency and 150+ airline connections.";
        $meta_image = isset($blog) && $blog->image_path ? asset($blog->image_path) : asset('/media/assets/logos/blue-logo.png');
    @endphp

    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="{{ $meta_desc }}">
    <meta name="keywords" content="e-freight solutions, air freight automation, AWB processing, freight forwarding software, digital logistics, EDI connectivity">
    <meta name="author" content="F16s E-Freight Solutions">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="{{ isset($blog) ? 'article' : 'website' }}">
    <meta property="og:url" content="{{ url()->current() }}">
    <meta property="og:title" content="{{ $meta_title }}">
    <meta property="og:description" content="{{ $meta_desc }}">
    <meta property="og:image" content="{{ $meta_image }}">
    <meta property="og:image:secure_url" content="{{ $meta_image }}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="{{ $meta_title }}">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="{{ url()->current() }}">
    <meta property="twitter:title" content="{{ $meta_title }}">
    <meta property="twitter:description" content="{{ $meta_desc }}">
    <meta property="twitter:image" content="{{ $meta_image }}">

    <link rel="canonical" href="{{ url()->current() }}">

    <!-- Organization Schema -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "F16s",
        "url": "https://f16sefreight.com/",
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://f16sefreight.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
        },
        "logo": "https://f16sefreight.com/media/assets/logos/blue-logo.png",
        "sameAs": [
            "https://www.linkedin.com/company/f16s",
            "https://twitter.com/f16s"
        ]
    }
    </script>
    <title>{{ $meta_title }}</title>
    <link rel="icon" href="/media/assets/logos/favicon-white-64.png" type="image/png">
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
    <div id="app-preloader" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: #ffffff; display: none; opacity: 0; align-items: center; justify-content: center; z-index: 10000; overflow: hidden; transition: opacity 0.3s ease-in-out;">
        <img src="/media/assets/logos/blue-logo.png" alt="Loading..." style="width: 150px; height: auto; object-fit: contain; animation: pulse 2s infinite ease-in-out;">
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
      var loaderTimer = setTimeout(function() {
          var loader = document.getElementById('app-preloader');
          if (loader) {
              loader.style.display = 'flex';
              // Force reflow to allow transition
              void loader.offsetWidth;
              loader.style.opacity = '1';
          }
      }, 1000);

      window.addEventListener('load', function() {
        clearTimeout(loaderTimer);
        var loader = document.getElementById('app-preloader');
        if (loader) {
            if (loader.style.opacity === '1') {
                loader.style.opacity = '0';
                setTimeout(function() {
                    loader.style.display = 'none';
                    if (loader.parentNode) loader.parentNode.removeChild(loader);
                }, 300);
            } else {
                loader.style.display = 'none';
                if (loader.parentNode) loader.parentNode.removeChild(loader);
            }
        }
      });
    </script>
</body>


</html>