import json
import urllib.request
import urllib.parse
import sys

def get_pagespeed_report(url, strategy):
    print(f"Fetching PageSpeed report for {url} ({strategy})...")
    api_url = f"https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url={urllib.parse.quote(url)}&strategy={strategy}"
    try:
        req = urllib.request.Request(
            api_url, 
            headers={'User-Agent': 'Mozilla/5.0'}
        )
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode('utf-8'))
            return data
    except Exception as e:
        print(f"Error fetching PageSpeed data: {e}", file=sys.stderr)
        return None

def analyze_report(data, strategy):
    if not data or 'lighthouseResult' not in data:
        print("Invalid report data.")
        return
    
    lh = data['lighthouseResult']
    categories = lh.get('categories', {})
    
    perf_score = categories.get('performance', {}).get('score', 0) * 100
    a11y_score = categories.get('accessibility', {}).get('score', 0) * 100
    bp_score = categories.get('best-practices', {}).get('score', 0) * 100
    seo_score = categories.get('seo', {}).get('score', 0) * 100
    
    print(f"\n==================================================")
    print(f"  STRATEGY: {strategy.upper()}")
    print(f"==================================================")
    print(f"Performance Score:    {perf_score:.0f}/100")
    print(f"Accessibility Score:  {a11y_score:.0f}/100")
    print(f"Best Practices Score: {bp_score:.0f}/100")
    print(f"SEO Score:             {seo_score:.0f}/100")
    print(f"--------------------------------------------------")
    
    # Key metrics
    audits = lh.get('audits', {})
    metrics = {
        'first-contentful-paint': 'First Contentful Paint (FCP)',
        'largest-contentful-paint': 'Largest Contentful Paint (LCP)',
        'total-blocking-time': 'Total Blocking Time (TBT)',
        'cumulative-layout-shift': 'Cumulative Layout Shift (CLS)',
        'speed-index': 'Speed Index (SI)',
        'interactive': 'Time to Interactive (TTI)'
    }
    
    print("KEY METRICS:")
    for key, name in metrics.items():
        audit = audits.get(key, {})
        display_val = audit.get('displayValue', 'N/A')
        status = audit.get('score', 0)
        status_str = "🟢" if status >= 0.9 else ("🟡" if status >= 0.5 else "🔴")
        print(f"  {status_str} {name}: {display_val}")
        
    print(f"--------------------------------------------------")
    print("TOP OPPORTUNITIES (Potential savings):")
    
    opportunities = []
    for audit_id, audit in audits.items():
        # Opportunities typically have details of type 'opportunity'
        details = audit.get('details', {})
        if details.get('type') == 'opportunity':
            overall_savings_ms = details.get('overallSavingsMs', 0)
            overall_savings_bytes = details.get('overallSavingsBytes', 0)
            description = audit.get('description', '')
            title = audit.get('title', '')
            
            # Simple heuristic to clean up markdown in description
            desc_clean = description.split('[')[0].strip()
            
            if overall_savings_ms > 0 or overall_savings_bytes > 0:
                opportunities.append({
                    'id': audit_id,
                    'title': title,
                    'savings_ms': overall_savings_ms,
                    'savings_bytes': overall_savings_bytes,
                    'description': desc_clean
                })
                
    # Sort opportunities by ms savings, then by byte savings
    opportunities.sort(key=lambda x: (x['savings_ms'], x['savings_bytes']), reverse=True)
    
    for opt in opportunities[:8]:
        savings_str = ""
        if opt['savings_ms'] > 0:
            savings_str += f"{opt['savings_ms']/1000:.2f} s"
        if opt['savings_bytes'] > 0:
            if savings_str:
                savings_str += " / "
            savings_str += f"{opt['savings_bytes']/1024/1024:.2f} MB"
            
        print(f"  - **{opt['title']}** (Est. Savings: {savings_str})")
        print(f"    {opt['description']}")
        
    print(f"--------------------------------------------------")
    print("DIAGNOSTICS & PASSED/FAILED AUDITS:")
    diagnostics = [
        ('render-blocking-resources', 'Eliminate render-blocking resources'),
        ('unused-javascript', 'Reduce unused JavaScript'),
        ('unused-css-rules', 'Reduce unused CSS'),
        ('modern-image-formats', 'Serve images in modern formats'),
        ('uses-responsive-images', 'Properly size images'),
        ('offscreen-images', 'Defer offscreen images'),
        ('dom-size', 'Avoid an excessive DOM size'),
        ('server-response-time', 'Initial server response time was short')
    ]
    for audit_id, label in diagnostics:
        audit = audits.get(audit_id, {})
        if audit:
            score = audit.get('score', 0)
            score_str = "🟢 Passed" if score >= 0.9 else ("🟡 Warning" if score >= 0.5 else "🔴 Failed")
            display_val = audit.get('displayValue', '')
            val_str = f" ({display_val})" if display_val else ""
            print(f"  {score_str} - {label}{val_str}")
            
if __name__ == "__main__":
    url = "https://f16sefreight.com/"
    
    # Analyze mobile
    mobile_data = get_pagespeed_report(url, 'mobile')
    analyze_report(mobile_data, 'mobile')
    
    # Analyze desktop
    desktop_data = get_pagespeed_report(url, 'desktop')
    analyze_report(desktop_data, 'desktop')
