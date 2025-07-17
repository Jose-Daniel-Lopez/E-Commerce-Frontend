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

    await page.goto('https://httpbin.org/forms/post')
    console.log('✅ Página cargada correctamente')

    await page.fill('input[name="custname"]', 'Juan Pérez')
    await page.waitForTimeout(1000)
    console.log('✅ Nombre rellenado')

    await page.fill('input[name="custtel"]', '+34 123 456 789')
    await page.waitForTimeout(1000)
    console.log('✅ Teléfono rellenado')

    await page.fill('input[name="custemail"]', 'juan.perez@email.com')
    await page.waitForTimeout(1000)
    console.log('✅ Email rellenado')

    await page.check('input[name="size"][value="large"]')
    await page.waitForTimeout(1000)
    console.log('✅ Tamaño seleccionado (Large)')

    await page.check('input[name="topping"][value="bacon"]')
    await page.waitForTimeout(500)
    await page.check('input[name="topping"][value="cheese"]')
    await page.waitForTimeout(500)
    console.log('✅ Toppings seleccionados')

    await page.fill('input[name="delivery"]', '12:30')
    await page.waitForTimeout(500)
    console.log('✅ Tiempo de entrega rellenado')

    await page.fill('textarea[name="comments"]', 'Tocar el timbre dos veces')
    await page.waitForTimeout(500)
    console.log('✅ Instrucciones de entrega añadidas')

    await page.waitForTimeout(500)

    await page.click('button:text("Submit order")')
    console.log('✅ Formulario enviado')

    await page.waitForTimeout(2000)

    await page.waitForSelector('pre', { timeout: 10000 })
    const result = await page.textContent('pre')
    console.log('📄 Respuesta del servidor:')
    console.log(result)

    await page.screenshot({ path: 'automation_result.png' })
    console.log('📸 Captura de pantalla guardada')

    await page.waitForTimeout(5000)
  } catch (error) {
    console.error('❌ Error durante la automatización:', error)
    await page.screenshot({ path: 'error_screenshot.png' })
  } finally {
    await browser.close()
    console.log('🔚 Automatización completada')
  }
}

runAutomation().catch(console.error)
