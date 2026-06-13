from playwright.sync_api import sync_playwright
import time
import os

PROD_URL = 'https://running-in-war.vercel.app'
EMAIL = 'yuvaly1.amar@gmail.com'
PASSWORD = 'Yuval123!'

os.makedirs('screenshots', exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(
        viewport={'width': 390, 'height': 844},
        user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15'
    )
    page = context.new_page()

    # Load root -> auto-redirects to /auth via React Router
    page.goto(PROD_URL)
    page.wait_for_load_state('networkidle')
    time.sleep(1)
    page.wait_for_selector('input[placeholder="your@email.com"]', timeout=10000)

    page.fill('input[placeholder="your@email.com"]', EMAIL)
    page.fill('input[type="password"]', PASSWORD)
    page.locator('button[type="submit"]').click()
    page.wait_for_load_state('networkidle')
    time.sleep(2)
    print('After login:', page.url)

    # Screenshot home
    page.screenshot(path='screenshots/01_home.png')
    print('home done')

    # Navigate via BottomNav links (client-side, no full reload)
    nav_links = {
        'map':     '/map',
        'route':   '/route',
        'profile': '/profile',
    }

    for name, path in nav_links.items():
        page.evaluate(f"window.history.pushState(null, '', '{path}')")
        page.evaluate("window.dispatchEvent(new PopStateEvent('popstate'))")
        time.sleep(2)
        page.screenshot(path=f'screenshots/0{list(nav_links.keys()).index(name)+2}_{name}.png')
        print(f'{name} done — url: {page.url}')

    browser.close()
    print('All done.')
