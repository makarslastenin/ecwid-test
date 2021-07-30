const puppeteer = require("puppeteer");


describe("Тест фильтра по ключевому слову", () => {
    let browser=null;
    let page=null;
    
    afterAll(async()=>{
        
        await browser.close();
    });
    test("Запуск браузера", async ()=>{
         browser = await puppeteer.launch({ headless: false,
            args: ['--start-fullscreen']
         });
    });
    test("Открытие страницы", async ()=>{
         page = await browser.newPage();
         await page.setViewport({
            width: 1920,
            height: 1080});
    });
    test("Переход на страницу сайта", async ()=>{
        await page.goto("https://www.ecwid.ru/demo/search", {waitUntil:"domcontentloaded"}); 
    });
    test("Ввод слова в поисковую строку", async ()=>{
        await page.waitForSelector(".form-control__text");
        await page.type(".form-control__text", "board", { delay: 100 }); 
    },15000);
    test("Нажать на кнопку", async ()=>{
        await page.waitForSelector(".form-control__ico-btn.ec-text-muted");
        await page.click(".form-control__ico-btn.ec-text-muted");
    },15000);
    test("Поиск результата запроса", async ()=>{
      await page.waitForTimeout(8000);
      const items = await page.$$(".grid-product__wrap-inner");
      expect(items.length).toBe(5)

    }, 15000); 

});