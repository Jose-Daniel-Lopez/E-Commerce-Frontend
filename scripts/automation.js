import { chromium } from 'playwright'

async function runAutomation() {
  const browserOptions = {
    headless: false,
    slowMo: 1000,
    args: ['--start-maximized'],
  }

  const browser = await chromium.launch(browserOptions)
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
  })
  const page = await context.newPage()

  try {
    console.log('🚀 Iniciando automatización...')

    await page.goto('http://localhost:5173/contact')
    console.log('✅ Contact page loaded')


    // Fill Name
    await page.fill('form input[name="fullName"]', 'Juan Pérez')
    await page.waitForTimeout(500)
    console.log('✅ Name filled')

    // Fill Email
    await page.fill('form input[name="email"]', 'juan.perez@email.com')
    await page.waitForTimeout(500)
    console.log('✅ Email filled')

    // Fill Subject
    await page.fill('form input[name="subject"]', 'Consulta sobre producto')
    await page.waitForTimeout(500)
    console.log('✅ Subject filled')

    // Fill Message
    await page.fill('form textarea[name="message"]', 'Hola, tengo una duda sobre un producto.')
    await page.waitForTimeout(500)
    console.log('✅ Message filled')

    // Select contact method (radio)
    await page.check('form input[type="radio"][value="email"]')
    await page.waitForTimeout(300)
    console.log('✅ Contact method selected (email)')

    // Submit form
    await page.click('form button[type="submit"]')
    console.log('✅ Form submitted')

    await page.waitForTimeout(2000)

    await page.screenshot({ path: 'contact_form_result.png' })
    console.log('📸 Screenshot saved')

    await page.waitForTimeout(3000)
  } catch (error) {
    console.error('❌ Error durante la automatización:', error)
    await page.screenshot({ path: 'error_screenshot.png' })
  } finally {
    await browser.close()
    console.log('🔚 Automatización completada')
  }
}

runAutomation().catch(console.error)
